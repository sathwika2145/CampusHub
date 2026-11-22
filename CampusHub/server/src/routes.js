
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { User, Announcement, Club, Membership, Event, Registration, Resource, Opportunity, DirectoryEntry, Notification, Audit, roles } from './models.js';
import { requireAuth, allow, signToken, setAuthCookie, safeUser } from './auth.js';

const router = Router();
const uploadsDir = path.resolve('uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage, limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^(application\/pdf|image\/(png|jpeg|webp)|text\/plain|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/.test(file.mimetype);
    cb(ok ? null : new Error('Only PDF, PNG, JPEG, WEBP, TXT, and DOCX files are accepted.'), ok);
  }
});
const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const clean = value => typeof value === 'string' ? value.trim() : value;
const safeUrl = value => {
  if (!value) return true;
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
};
const audit = (actor, action, targetType, targetId, details = {}) => Audit.create({ actor, action, targetType, targetId: String(targetId || ''), details });

router.post('/auth/register', asyncRoute(async (req, res) => {
  const username = clean(req.body.username);
  const email = clean(req.body.email)?.toLowerCase();
  const password = req.body.password;
  const role = clean(req.body.role);

  if (!username || !email || typeof password !== 'string' || password.length < 10) {
    return res.status(400).json({
      message: 'Provide a username, valid email, and password of at least 10 characters.'
    });
  }

  // Only these roles are supported
  if (!roles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role selected.' });
  }

  // Public registration must not allow users to create Admin accounts
  if (role === 'Admin') {
    return res.status(403).json({
      message: 'Admin accounts must be created by an existing Admin.'
    });
  }

  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(409).json({
      message: 'An account with that email already exists.'
    });
  }

  const user = await User.create({
    username,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role,
    department: clean(req.body.department) || ''
  });

  setAuthCookie(res, signToken(user));

  res.status(201).json({ user: safeUser(user) });
}));
router.post('/auth/login', asyncRoute(async (req, res) => {
  const email = clean(req.body.email)?.toLowerCase();
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !user.active || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  setAuthCookie(res, signToken(user));
  res.json({ user: safeUser(user) });
}));
router.post('/auth/logout', (_req, res) => { res.clearCookie('compihub_token', { path: '/' }); res.json({ ok: true }); });
router.get('/auth/me', requireAuth, (req, res) => res.json({ user: safeUser(req.user) }));
router.post('/auth/forgot-password', asyncRoute(async (_req, res) => {
  // Do not reveal whether an email exists. Email delivery requires a configured provider.
  res.json({ message: 'If the account exists, password-reset instructions can be sent once email delivery is configured.' });
}));
router.patch('/profile', requireAuth, asyncRoute(async (req, res) => {
  const allowed = ['username', 'department', 'yearOfStudy', 'phone', 'subjects'];
  for (const key of allowed) if (req.body[key] !== undefined) req.user[key] = req.body[key];
  await req.user.save();
  res.json({ user: safeUser(req.user) });
}));

router.get('/dashboard', requireAuth, asyncRoute(async (req, res) => {
  const [announcements, events, opportunities, resources] = await Promise.all([
    Announcement.countDocuments({ status: 'Published' }),
    Event.countDocuments({ status: 'Published', endsAt: { $gte: new Date() } }),
    Opportunity.countDocuments({ active: true, $or: [{ deadline: null }, { deadline: { $gte: new Date() } }] }),
    Resource.countDocuments()
  ]);
  res.json({ role: req.user.role, counts: { announcements, events, opportunities, resources } });
}));

router.get('/announcements', requireAuth, asyncRoute(async (req, res) => {
  const filter = { status: 'Published' };
  if (req.query.department) filter.$or = [{ departments: req.query.department }, { departments: { $size: 0 } }];
  if (req.query.search) filter.title = { $regex: String(req.query.search).slice(0, 80), $options: 'i' };
  res.json(await Announcement.find(filter).populate('author', 'username role department').sort({ createdAt: -1 }).limit(100));
}));
router.post('/announcements', requireAuth, allow('Faculty', 'Admin'), asyncRoute(async (req, res) => {
  const item = await Announcement.create({ ...req.body, author: req.user._id });
  await audit(req.user._id, 'announcement.create', 'Announcement', item._id);
  res.status(201).json(item);
}));
router.patch('/announcements/:id', requireAuth, allow('Faculty', 'Admin'), asyncRoute(async (req, res) => {
  const item = await Announcement.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Announcement not found.' });
  if (req.user.role !== 'Admin' && String(item.author) !== String(req.user._id)) return res.status(403).json({ message: 'You can edit only your own announcements.' });
  Object.assign(item, req.body); await item.save(); res.json(item);
}));
router.delete('/announcements/:id', requireAuth, allow('Admin'), asyncRoute(async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id); res.json({ ok: true });
}));

router.get('/clubs', requireAuth, asyncRoute(async (_req, res) => {
  res.json(await Club.find().populate('facultyCoordinator', 'username email').sort({ name: 1 }));
}));
router.post('/clubs', requireAuth, allow('Admin'), asyncRoute(async (req, res) => {
  const club = await Club.create({
    ...req.body,
    createdBy: req.user._id
  });

  await audit(req.user._id, 'club.create', 'Club', club._id);
  res.status(201).json(club);
}));
router.patch('/clubs/:id', requireAuth, allow('Admin'), asyncRoute(async (req, res) => {
  const allowedFields = [
    'name',
    'category',
    'description',
    'facultyCoordinator'
  ];

  const patch = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      patch[field] = req.body[field];
    }
  }

  if (
    patch.facultyCoordinator &&
    patch.facultyCoordinator !== ''
  ) {
    const faculty = await User.findOne({
      _id: patch.facultyCoordinator,
      role: 'Faculty',
      active: true
    });

    if (!faculty) {
      return res.status(400).json({
        message: 'Choose an active Faculty account.'
      });
    }
  } else if (patch.facultyCoordinator === '') {
    patch.facultyCoordinator = null;
  }

  const club = await Club.findByIdAndUpdate(
    req.params.id,
    { $set: patch },
    { new: true, runValidators: true }
  ).populate('facultyCoordinator', 'username email');

  if (!club) {
    return res.status(404).json({
      message: 'Club not found.'
    });
  }

  await audit(req.user._id, 'club.update', 'Club', club._id);

  res.json(club);
}));

router.delete('/clubs/:id', requireAuth, allow('Admin'), asyncRoute(async (req, res) => {
  const clubId = req.params.id;

  const hasEvents = await Event.exists({ club: clubId });
  const hasMemberships = await Membership.exists({ club: clubId });

  if (hasEvents || hasMemberships) {
    return res.status(409).json({
      message: 'Cannot delete this club because it has events or membership records.'
    });
  }

  const club = await Club.findByIdAndDelete(clubId);

  if (!club) {
    return res.status(404).json({
      message: 'Club not found.'
    });
  }

  await audit(req.user._id, 'club.delete', 'Club', club._id);

  res.json({
    message: 'Club deleted successfully.'
  });
}));

router.post('/clubs/:id/join', requireAuth, allow('Student'), asyncRoute(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).json({ message: 'Club not found.' });
  const existing = await Membership.findOne({ club: club._id, student: req.user._id });
  if (existing) return res.status(409).json({ message: `Your request is already ${existing.status.toLowerCase()}.` });
  res.status(201).json(await Membership.create({ club: club._id, student: req.user._id }));
}));
router.get('/memberships', requireAuth, asyncRoute(async (req, res) => {
  const filter = req.user.role === 'Student' ? { student: req.user._id } : {};
  const memberships = await Membership.find(filter).populate('club').populate('student', 'username email department');
  const visible = req.user.role === 'Admin' ? memberships : req.user.role === 'Student' ? memberships :
    memberships.filter(m => m.club && String(m.club.facultyCoordinator) === String(req.user._id));
  res.json(visible);
}));
router.patch('/memberships/:id', requireAuth, allow('Faculty', 'Admin'), asyncRoute(async (req, res) => {
  if (!['Approved', 'Rejected'].includes(req.body.status)) return res.status(400).json({ message: 'Status must be Approved or Rejected.' });
  const m = await Membership.findById(req.params.id).populate('club');
  if (!m) return res.status(404).json({ message: 'Membership request not found.' });
  if (req.user.role !== 'Admin' && String(m.club.facultyCoordinator) !== String(req.user._id)) return res.status(403).json({ message: 'Only the assigned faculty coordinator can review this request.' });
  m.status = req.body.status; m.reviewedBy = req.user._id; m.reviewedAt = new Date(); await m.save(); res.json(m);
}));

router.get('/events', requireAuth, asyncRoute(async (_req, res) => {
  const events = await Event.find().populate('club', 'name').populate('organizer', 'username role').sort({ startsAt: 1 }).limit(200);
  const counts = await Registration.aggregate([{ $group: { _id: '$event', count: { $sum: 1 } } }]);
  const countMap = Object.fromEntries(counts.map(c => [String(c._id), c.count]));
  res.json(events.map(e => ({ ...e.toObject(), registrationCount: countMap[String(e._id)] || 0, registrationOpen: e.status === 'Published' && e.registrationOpensAt <= new Date() && e.registrationDeadline > new Date() })));
}));
router.post('/events', requireAuth, allow('Faculty'), asyncRoute(async (req, res) => {
  const club = await Club.findById(req.body.club);
  if (!club) return res.status(400).json({ message: 'Select an existing club.' });
  if (req.user.role !== 'Admin' && String(club.facultyCoordinator) !== String(req.user._id)) return res.status(403).json({ message: 'You must be the club faculty coordinator.' });
  if (new Date(req.body.endsAt) <= new Date(req.body.startsAt) || new Date(req.body.registrationDeadline) > new Date(req.body.startsAt)) return res.status(400).json({ message: 'Check event and registration dates.' });
  const event = await Event.create({ ...req.body, organizer: req.user._id });
  res.status(201).json(event);
}));
router.patch('/events/:id', requireAuth, allow('Faculty', 'Admin'), asyncRoute(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('club');
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  if (req.user.role !== 'Admin' && String(event.club.facultyCoordinator) !== String(req.user._id)) return res.status(403).json({ message: 'Not authorized to manage this event.' });
  Object.assign(event, req.body); await event.save(); res.json(event);
}));
router.post('/events/:id/register', requireAuth, allow('Student'), asyncRoute(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  const now = new Date();
  if (event.status !== 'Published' || now < event.registrationOpensAt || now >= event.registrationDeadline || now >= event.startsAt) return res.status(400).json({ message: 'Registration is not open.' });
  if (event.capacity != null) {
    const count = await Registration.countDocuments({ event: event._id });
    if (count >= event.capacity) return res.status(409).json({ message: 'This event has reached capacity.' });
  }
  try { res.status(201).json(await Registration.create({ event: event._id, student: req.user._id })); }
  catch (e) { if (e.code === 11000) return res.status(409).json({ message: 'You are already registered.' }); throw e; }
}));
router.delete('/events/:id/register', requireAuth, allow('Student'), asyncRoute(async (req, res) => {
  await Registration.findOneAndDelete({ event: req.params.id, student: req.user._id }); res.json({ ok: true });
}));
router.get('/events/:id/registrations', requireAuth, allow('Faculty', 'Admin'), asyncRoute(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('club');
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  if (req.user.role !== 'Admin' && String(event.club.facultyCoordinator) !== String(req.user._id)) return res.status(403).json({ message: 'Not authorized.' });
  res.json(await Registration.find({ event: event._id }).populate('student', 'username email department yearOfStudy').sort({ createdAt: 1 }));
}));
router.get('/registrations', requireAuth, allow('Student'), asyncRoute(async (req, res) => {
  const registrations = await Registration.find({
    student: req.user._id
  }).populate('event');

  res.json(registrations);
}));
router.get('/resources', requireAuth, asyncRoute(async (req, res) => {
  const filter = {};
  for (const key of ['department', 'type', 'subject']) if (req.query[key]) filter[key] = req.query[key];
  if (req.query.search) filter.title = { $regex: String(req.query.search).slice(0, 80), $options: 'i' };
  res.json(await Resource.find(filter).populate('author', 'username role').sort({ createdAt: -1 }).limit(200));
}));
router.post('/resources', requireAuth, allow('Faculty'), upload.single('file'), asyncRoute(async (req, res) => {
  if (!req.file && !safeUrl(req.body.externalUrl)) return res.status(400).json({ message: 'Provide a valid external URL or upload a supported file.' });
  const resource = await Resource.create({ ...req.body, fileUrl: req.file ? `/uploads/${req.file.filename}` : '', author: req.user._id });
  res.status(201).json(resource);
}));
router.delete('/resources/:id', requireAuth, allow('Faculty'), asyncRoute(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ message: 'Resource not found.' });
  if (req.user.role !== 'Admin' && String(resource.author) !== String(req.user._id)) return res.status(403).json({ message: 'You can delete only your own resources.' });
  await resource.deleteOne(); res.json({ ok: true });
}));

router.get('/opportunities', requireAuth, asyncRoute(async (req, res) => {
  const filter = { active: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.department) filter.$or = [{ departments: req.query.department }, { departments: { $size: 0 } }];
  if (req.query.search) filter.title = { $regex: String(req.query.search).slice(0, 80), $options: 'i' };
  res.json(await Opportunity.find(filter).populate('createdBy', 'username role').sort({ deadline: 1 }).limit(200));
}));
router.post('/opportunities', requireAuth, allow('Career Coordinator'), asyncRoute(async (req, res) => {
  if (!safeUrl(req.body.applicationUrl)) return res.status(400).json({ message: 'Application URL must use HTTP or HTTPS.' });
  res.status(201).json(await Opportunity.create({ ...req.body, createdBy: req.user._id }));
}));
// EDIT an opportunity
// EDIT opportunity
router.patch(
  '/opportunities/:id',
  requireAuth,
  allow('Career Coordinator'),
  asyncRoute(async (req, res) => {
    const item = await Opportunity.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Opportunity not found.'
      });
    }

    if (String(item.createdBy) !== String(req.user._id)) {
      return res.status(403).json({
        message: 'You can edit only your own opportunities.'
      });
    }

    if (!safeUrl(req.body.applicationUrl)) {
      return res.status(400).json({
        message: 'Application URL must use HTTP or HTTPS.'
      });
    }

    const allowedFields = [
      'title',
      'category',
      'description',
      'organization',
      'eligibility',
      'compensation',
      'deadline',
      'applicationUrl',
      'departments'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await item.save();

    res.json({
      message: 'Opportunity updated successfully.',
      opportunity: item
    });
  })
);


// DELETE opportunity
router.delete(
  '/opportunities/:id',
  requireAuth,
  allow('Career Coordinator'),
  asyncRoute(async (req, res) => {
    const item = await Opportunity.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Opportunity not found.'
      });
    }

    if (String(item.createdBy) !== String(req.user._id)) {
      return res.status(403).json({
        message: 'You can delete only your own opportunities.'
      });
    }

    item.active = false;
    await item.save();

    res.json({
      message: 'Opportunity deleted successfully.'
    });
  })
);

router.get('/directory', requireAuth, asyncRoute(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.department) filter.department = req.query.department;
  if (req.query.search) filter.name = { $regex: String(req.query.search).slice(0, 80), $options: 'i' };
  res.json(await DirectoryEntry.find(filter).sort({ category: 1, name: 1 }).limit(300));
}));
router.post('/directory', requireAuth, allow('Admin'), asyncRoute(async (req, res) => {
  if (!safeUrl(req.body.officialUrl)) return res.status(400).json({ message: 'Official URL must use HTTP or HTTPS.' });
  res.status(201).json(await DirectoryEntry.create(req.body));
}));
router.patch('/directory/:id', requireAuth, allow('Admin'), asyncRoute(async (req, res) => {
  if (req.body.officialUrl && !safeUrl(req.body.officialUrl)) return res.status(400).json({ message: 'Official URL must use HTTP or HTTPS.' });
  const item = await DirectoryEntry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Directory entry not found.' });
  res.json(item);
}));
router.delete('/directory/:id', requireAuth, allow('Admin'), asyncRoute(async (req, res) => {
  await DirectoryEntry.findByIdAndDelete(req.params.id); res.json({ ok: true });
}));

router.get('/admin/users', requireAuth, allow('Admin'), asyncRoute(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(500);
  const counts = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
  res.json({ users: users.map(safeUser), counts });
}));
router.patch('/admin/users/:id', requireAuth, allow('Admin'), asyncRoute(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found.' });
  if (req.body.role && !roles.includes(req.body.role)) return res.status(400).json({ message: 'Invalid role.' });
  if (String(target._id) === String(req.user._id) && req.body.active === false) return res.status(400).json({ message: 'You cannot deactivate your own account.' });
  if (req.body.role) target.role = req.body.role;
  if (typeof req.body.active === 'boolean') target.active = req.body.active;
  await target.save(); await audit(req.user._id, 'user.update', 'User', target._id, { role: target.role, active: target.active });
  res.json({ user: safeUser(target) });
}));
router.get('/notifications', requireAuth, asyncRoute(async (req, res) => res.json(await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(50))));
router.patch('/notifications/:id/read', requireAuth, asyncRoute(async (req, res) => {
  const item = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { readAt: new Date() }, { new: true });
  if (!item) return res.status(404).json({ message: 'Notification not found.' });
  res.json(item);
}));

export default router;
