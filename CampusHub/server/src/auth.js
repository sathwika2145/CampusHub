
import jwt from 'jsonwebtoken';
import { User } from './models.js';

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
export function setAuthCookie(res, token) {
  res.cookie('compihub_token', token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, path: '/'
  });
}
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.compihub_token;
    if (!token) return res.status(401).json({ message: 'Please sign in.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || !user.active) return res.status(401).json({ message: 'Account unavailable.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired. Please sign in again.' });
  }
}
export const allow = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'You do not have permission to do that.' });
  next();
};
export function safeUser(user) {
  return { id: user._id, username: user.username, email: user.email, role: user.role,
    department: user.department, yearOfStudy: user.yearOfStudy, phone: user.phone,
    subjects: user.subjects, active: user.active };
}
