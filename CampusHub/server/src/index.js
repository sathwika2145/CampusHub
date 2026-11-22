
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import api from './routes.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 80 }));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'CompiHub API' }));
app.use('/api', api);
app.use((err, _req, res, _next) => {
  console.error(err.message);
  if (err.code === 11000) return res.status(409).json({ message: 'That record already exists.' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Unexpected server error.' });
});

const port = Number(process.env.PORT || 4000);
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. Copy server/.env.example to server/.env and configure it.');
  process.exit(1);
}
try {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/compihub');
  app.listen(port, () => console.log(`CompiHub API listening on http://localhost:${port}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
