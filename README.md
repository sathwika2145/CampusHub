# CompiHub – Campus Community Platform

### Never Miss a Beat!

CompiHub is a full-stack campus community platform designed for the NIT Warangal community. It brings campus announcements, clubs, events, academic resources, career opportunities and directory information together in one place.

The platform provides separate access and functionalities for students, faculty members, career coordinators and administrators, making it easier to share information and manage campus activities.

---

## Features

### 1. Dashboard
- Central dashboard with campus activity information.
- Overview of announcements and upcoming events.
- Role-based navigation and access.

### 2. Announcements
- View campus announcements.
- Search and filter announcements.
- Faculty and administrators can publish and manage announcements.
- Department-based announcement filtering.

### 3. Clubs and Events
- Browse available campus clubs.
- Request club membership.
- Faculty coordinators can review membership requests.
- Create and manage club events.
- Register for events and cancel registrations.
- Event capacity and registration deadline management.

### 4. Academic Resources
- Access academic study materials.
- Filter resources by department, subject and type.
- Faculty members can upload academic resources.
- Support for document uploads and external resource links.

### 5. Career Opportunities
- Browse internships and other career opportunities.
- Search and filter opportunity listings.
- Career coordinators can create, edit and deactivate listings.
- View application links and deadlines.

### 6. Campus Directory
- Search campus directory entries.
- Filter entries by category and department.
- Administrators can add, update and delete directory entries.

### 7. User Profile
- View account information.
- Update profile details.

### 8. Administration
- View and manage registered users.
- Assign user roles.
- Activate or deactivate accounts.
- Create and manage clubs.
- Assign faculty coordinators.
- Manage campus information.

---

## User Roles

CompiHub supports four types of user accounts:

| Role | Permissions |
|---|---|
| Student | View campus information, join clubs, register for events and access resources. |
| Faculty | Publish announcements, manage assigned club activities, review membership requests and upload academic resources. |
| Career Coordinator | Manage career and internship opportunity listings. |
| Admin | Manage users, roles, clubs, announcements and directory information. |

Public registration creates Student accounts. Privileged roles are assigned by the administrator.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, HTML, CSS, JavaScript |
| Frontend Tool | Vite |
| Routing | React Router DOM |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| File Uploads | Multer |
| Security | Helmet, CORS, Express Rate Limit |
| Configuration | dotenv |
| Testing | Node.js Test Runner |

---

## Project Architecture

The application follows a client-server architecture.

1. **Frontend:** React provides the user interface and handles navigation, forms and user interactions.
2. **Backend:** Express.js provides REST APIs and processes client requests.
3. **Database:** MongoDB stores user accounts, announcements, clubs, events, resources and other application data.
4. **Authentication:** JWT-based authentication uses HTTP-only cookies to maintain user sessions.
5. **Authorization:** Role-based middleware controls access to protected operations.
6. **File Storage:** Uploaded files are stored locally in the server/uploads directory during development.

### Application Flow

```text
             USER
               |
               v
        React Frontend
               |
               v
        Express REST API
               |
        Authentication
        & Authorization
               |
               v
          MongoDB
               |
               v
        JSON Response
               |
               v
        React Frontend
```

---

## Project Structure

```text
CampusHub/
│
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── api.js
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
│
├── server/
│   ├── package.json
│   ├── .env.example
│   │
│   ├── src/
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── models.js
│   │   ├── routes.js
│   │   └── seed.js
│   │
│   ├── test/
│   │   └── basic.test.js
│   │
│   └── uploads/
│
├── logo.png
├── NITW.jpg
├── .gitignore
└── README.md
```

---

## Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js (version 18 or above)
- npm
- MongoDB (local installation or MongoDB connection URI)
- Git

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd CampusHub
```

### Step 2: Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file using the provided example:

```bash
cp .env.example .env
```

For Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Configure the environment variables in `server/.env`:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/compihub
JWT_SECRET=your_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Make sure MongoDB is running before starting the backend.

### Step 3: Seed Development Data

Run:

```bash
npm run seed
```

This creates sample accounts and illustrative campus data for local development.

### Step 4: Start the Backend

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:4000
```

API health check:

```text
http://localhost:4000/api/health
```

### Step 5: Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the URL displayed by Vite, usually:

```text
http://localhost:5173
```

---

## Development Demo Accounts

After running the seed command, the following accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | admin@compihub.local | AdminPass123! |
| Faculty | faculty@compihub.local | FacultyPass123! |
| Career Coordinator | career@compihub.local | CareerPass123! |
| Student | student@compihub.local | StudentPass123! |

**Note:** These are demonstration credentials for local development only. Do not use them for production deployment. Change all demo passwords and secrets before deployment.

---

## Authentication and Security

The project includes the following security measures:

- Password hashing using bcryptjs.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Role-based access control.
- Protected backend routes.
- CORS configuration.
- Helmet security middleware.
- Rate limiting on authentication endpoints.
- Request validation and error handling.
- File upload size and MIME-type restrictions.

---

## Testing

The backend uses Node.js's built-in test runner.

To execute the available tests:

```bash
cd server
npm test
```

The current basic test file covers:

- Public registration role restrictions.
- External URL validation for HTTP and HTTPS links.
- Rejection of invalid and JavaScript URLs.

---

## Future Improvements

Some improvements planned for future versions include:

- Email-based password recovery.
- Production cloud storage for uploaded files.
- Expanded automated API and integration testing.
- Improved notification workflows.
- Production deployment with HTTPS.
- Additional campus integrations and verified institutional information.

---

## Project Information

**Project Name:** CompiHub – Campus Community Platform

**Institution:** National Institute of Technology, Warangal

**Department:** Computer Science and Engineering

**Project Type:** Full Stack Development

**Tagline:** Never Miss a Beat!

---

## Acknowledgement

We thank our faculty and department for their guidance and support throughout the development of this project.

We also acknowledge the documentation and resources provided by the developers of React, Node.js, Express.js and MongoDB, which helped us build this application.

---

**CompiHub – Bringing the Campus Community Together.**
