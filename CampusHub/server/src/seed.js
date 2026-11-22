
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Club, Announcement, Event, Resource, Opportunity, DirectoryEntry } from './models.js';

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/compihub');
const accounts = [
  ['CompiHub Admin', 'admin@compihub.local', 'AdminPass123!', 'Admin', 'Administration'],
  ['Demo Faculty', 'faculty@compihub.local', 'FacultyPass123!', 'Faculty', 'CSE'],
  ['Career Team', 'career@compihub.local', 'CareerPass123!', 'Career Coordinator', 'Career Services'],
  ['Demo Student', 'student@compihub.local', 'StudentPass123!', 'Student', 'CSE']
];
const users = {};
for (const [username, email, password, role, department] of accounts) {
  const passwordHash = await bcrypt.hash(password, 12);

  const userData = {
    username,
    email,
    passwordHash,
    role,
    department,
    active: true
  };

  if (role === 'Student') {
    userData.yearOfStudy = 3;
  }

  const user = await User.findOneAndUpdate(
    { email },
    { $set: userData },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  users[role] = user;
}

let club = await Club.findOne({ name: 'Programming Club (Demo)' });
if (!club) club = await Club.create({ name: 'Programming Club (Demo)', category: 'Technology', description: 'Illustrative seed club. Replace with verified club information before public use.', facultyCoordinator: users.Faculty._id, createdBy: users.Admin._id });
if (!(await Announcement.exists({ title: 'Welcome to CompiHub' }))) await Announcement.create({
  title: 'Welcome to CompiHub', body: 'This is sample content for local development. Admins and faculty can publish campus announcements here.',
  departments: [], audience: ['Student', 'Faculty', 'Career Coordinator', 'Admin'], author: users.Admin._id
});
if (!(await Event.exists({ title: 'Student Community Meetup (Demo)' }))) await Event.create({
  title: 'Student Community Meetup (Demo)', description: 'Illustrative event record for testing registration workflows.',
  venue: 'Venue to be confirmed', startsAt: new Date(Date.now() + 7 * 86400000), endsAt: new Date(Date.now() + 7 * 86400000 + 7200000),
  registrationOpensAt: new Date(Date.now() - 86400000), registrationDeadline: new Date(Date.now() + 6 * 86400000),
  capacity: 100, club: club._id, organizer: users.Faculty._id
});
if (!(await Resource.exists({ title: 'Sample CSE Study Resource' }))) await Resource.create({
  title: 'Sample CSE Study Resource', subject: 'Computer Networks', department: 'CSE', type: 'Study material',
  description: 'Sample metadata only. Upload a real document to provide downloadable content.', author: users.Faculty._id
});
if (!(await Opportunity.exists({ title: 'Sample Internship Listing' }))) await Opportunity.create({
  title: 'Sample Internship Listing', category: 'Internship', description: 'Illustrative listing; verify details before applying.',
  organization: 'Example organization', deadline: new Date(Date.now() + 30 * 86400000),
  applicationUrl: 'https://example.com', createdBy: users['Career Coordinator']._id
});
if (!(await DirectoryEntry.exists({ name: 'NIT Warangal official website' }))) await DirectoryEntry.create({
  name: 'NIT Warangal official website', category: 'Facility', description: 'Official institutional website.',
  officialUrl: 'https://www.nitw.ac.in/'
});
console.log('Seed complete. Demo accounts:');
for (const [username, email, password, role] of accounts) console.log(`${role}: ${email} / ${password}`);
await mongoose.disconnect();
