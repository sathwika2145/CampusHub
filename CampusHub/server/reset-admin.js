import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { User } from './src/models.js';

dotenv.config();

const rl = readline.createInterface({ input: stdin, output: stdout });

try {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/compihub'
  );

  const email = (await rl.question('Enter Admin email: '))
    .trim()
    .toLowerCase();

  const password = await rl.question('Enter new Admin password: ');

  if (password.length < 10) {
    throw new Error('Password must be at least 10 characters.');
  }

  const admin = await User.findOne({ email }).select('+passwordHash');

  if (!admin) {
    throw new Error('No account found with this email.');
  }

 if (admin.role !== 'Faculty') {
  throw new Error('This account does not have the Faculty role.');
}

  admin.passwordHash = await bcrypt.hash(password, 12);
  await admin.save();

  console.log('Admin password reset successfully!');
} catch (error) {
  console.error('Error:', error.message);
} finally {
  rl.close();
  await mongoose.disconnect();
}
