
import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const roles = ['Student', 'Faculty', 'Career Coordinator', 'Admin'];
const userSchema = new Schema({
  username: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: roles, default: 'Student' },
  department: { type: String, default: '' },
  yearOfStudy: { type: Number, min: 1, max: 4 },
  phone: { type: String, default: '' },
  subjects: [{ type: String }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

const announcementSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  body: { type: String, required: true, maxlength: 10000 },
  departments: [{ type: String }],
  audience: [{ type: String, enum: roles }],
  attachmentUrl: String,
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const clubSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { type: String, default: 'Student club' },
  description: { type: String, required: true },
  logoUrl: String,
  coverUrl: String,
  facultyCoordinator: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const membershipSchema = new Schema({
  club: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date
}, { timestamps: true });
membershipSchema.index({ club: 1, student: 1 }, { unique: true });

const eventSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  description: { type: String, required: true, maxlength: 10000 },
  posterUrl: String,
  venue: { type: String, required: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  registrationOpensAt: { type: Date, default: Date.now },
  registrationDeadline: { type: Date, required: true },
  capacity: { type: Number, min: 1, default: null },
  previousYearUrl: String,
  status: { type: String, enum: ['Published', 'Closed', 'Completed'], default: 'Published' },
  club: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const registrationSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
registrationSchema.index({ event: 1, student: 1 }, { unique: true });

const resourceSchema = new Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true },
  department: { type: String, required: true },
  type: { type: String, enum: ['Exam paper', 'Class notes', 'Lab manual', 'Study material', 'Other'], default: 'Study material' },
  semester: String,
  description: String,
  fileUrl: String,
  externalUrl: String,
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const opportunitySchema = new Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Internship', 'Job', 'Hackathon', 'Workshop', 'Scholarship', 'Competition', 'Other'], default: 'Other' },
  description: { type: String, required: true },
  eligibility: String,
  audience: [{ type: String, enum: ['Student', 'Faculty'] }],
  departments: [{ type: String }],
  organization: String,
  compensation: String,
  deadline: Date,
  applicationUrl: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const directorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Faculty', 'Department', 'Building', 'Classroom/Lab', 'Facility', 'Other'], default: 'Other' },
  department: String,
  description: String,
  location: String,
  contact: String,
  officialUrl: String
}, { timestamps: true });

const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: String,
  readAt: Date
}, { timestamps: true });

const auditSchema = new Schema({
  actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetType: String,
  targetId: String,
  details: Schema.Types.Mixed
}, { timestamps: true });

export const User = model('User', userSchema);
export const Announcement = model('Announcement', announcementSchema);
export const Club = model('Club', clubSchema);
export const Membership = model('Membership', membershipSchema);
export const Event = model('Event', eventSchema);
export const Registration = model('Registration', registrationSchema);
export const Resource = model('Resource', resourceSchema);
export const Opportunity = model('Opportunity', opportunitySchema);
export const DirectoryEntry = model('DirectoryEntry', directorySchema);
export const Notification = model('Notification', notificationSchema);
export const Audit = model('Audit', auditSchema);
export { roles };
