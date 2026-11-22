
# CompiHub — Never miss a beat

A full-stack starting implementation for the NIT Warangal campus community platform.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT in an HTTP-only cookie, bcrypt password hashing, role middleware
- Uploads: local development storage under `server/uploads`

## Requirements
- Node.js 18+
- MongoDB running locally, or a MongoDB connection URI

## Setup
1. Copy `server/.env.example` to `server/.env`.
2. Set `MONGO_URI`, `JWT_SECRET`, and optionally `CLIENT_ORIGIN`.
3. In one terminal:
   ```bash
   cd server
   npm install
   npm run seed
   npm run dev
   ```
4. In another terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```
5. Open the Vite URL printed in the terminal (usually `http://localhost:5173`).

## Development seed accounts
Run `npm run seed` in `server` to create:
- Admin: `admin@compihub.local` / `AdminPass123!`
- Faculty: `faculty@compihub.local` / `FacultyPass123!`
- Career Coordinator: `career@compihub.local` / `CareerPass123!`
- Student: `student@compihub.local` / `StudentPass123!`

These are local demo accounts only. Change credentials and secrets before deployment. Seed data is illustrative; verify official NITW details before using publicly.

## Notes
- Public signup always creates a Student account. Only Admin can assign privileged roles.
- Password reset is represented by a secure request endpoint and requires a configured email provider to deliver reset links; this starter does not send emails.
- Local uploads are for development. Use private object storage and malware scanning for production.
- Event registration uses a database transaction when supported by the MongoDB deployment. Run MongoDB as a replica set for transactional guarantees in production.
- Run `npm test` in `server` for the available API logic tests.
