# Employee Management System (EMS)

A full-stack web app for managing a company's workforce. Admins can manage employees, attendance, leave requests and payslips, while employees get their own portal for clocking in, applying for leave and viewing payslips.

**Live demo:** [https://fullstack-ems-client-mauve.vercel.app/login](https://fullstack-ems-client-mauve.vercel.app/login)

## Features

### Admin
- Dashboard with total employees, departments, today's attendance and pending leaves
- Add, edit and delete employees (soft delete)
- Approve or reject leave applications
- Generate monthly payslips for any employee

### Employee
- Clock in / clock out with automatic late detection and working-hours calculation
- Attendance history and stats
- Apply for leave (sick, annual, casual) and track its status
- View and print payslips
- Update profile and change password

### Automation (Inngest)
- Auto check-out for employees who forget to clock out
- Reminder emails for pending leave applications
- Daily attendance reminder (scheduled cron job)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Axios, React Hot Toast, Lucide Icons |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcrypt |
| Background jobs | Inngest |
| Email | Nodemailer |
| Deployment | Vercel (client and server deployed separately) |

## Project Structure

```
ems/
├── client/          # React frontend
│   └── src/
│       ├── api/         # Axios instance
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth context
│       └── pages/       # Route pages
└── server/          # Express backend
    ├── config/          # DB and mailer setup
    ├── constants/
    ├── controller/      # Route handlers
    ├── inngest/         # Background functions
    ├── middleware/      # Auth middleware
    ├── models/          # Mongoose schemas
    ├── routes/
    ├── seed.js          # Creates the first admin user
    └── server.js
```

## Getting Started

### Prerequisites
- Node.js 18 or newer
- A MongoDB database (MongoDB Atlas works well)
- An Inngest account (for background jobs)

### 1. Clone the repository

```bash
git clone https://github.com/nayab-shafiq-sudo/ems.git
cd ems
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `server/.env` file (see [Environment Variables](#environment-variables)), then:

```bash
# create the first admin user
node seed.js

# start the server (default: http://localhost:4000)
npm run dev
```

### 3. Set up the client

```bash
cd client
npm install
```

Create a `client/.env` file:

```
VITE_BASE_URL=http://localhost:4000
```

Then start the app:

```bash
npm run dev
```

The client runs on `http://localhost:5173`.

## Environment Variables

### `server/.env`

```
MONGO_URI=
JWT_SECRET=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

Add the email credentials used by `config/nodemailer.js` as well (SMTP user and password).

### `client/.env`

```
VITE_BASE_URL=http://localhost:4000
```

> Never commit `.env` files or real keys to GitHub. On Vercel, add these values under **Settings → Environment Variables** and redeploy.

## Deployment Notes

- The **client** and **server** are separate Vercel projects.
- Set `VITE_BASE_URL` in the client project to the deployed server URL (without a trailing `/api`).
- Allow the client's URL in the server's CORS configuration.
- Inngest functions are served from `/api/inngest`. After deploying, sync the app in the Inngest dashboard using the production URL and set `INNGEST_SIGNING_KEY` and `INNGEST_EVENT_KEY` on the server.
- Add `0.0.0.0/0` to MongoDB Atlas Network Access, because Vercel uses dynamic IPs.

## API Overview

| Route | Purpose |
| --- | --- |
| `POST /api/auth/login` | Login for admin and employee |
| `POST /api/auth/change-password` | Change password |
| `/api/employees` | Employee CRUD (admin) |
| `/api/attendance` | Clock in/out and attendance history |
| `/api/leave` | Apply for, list and update leaves |
| `/api/payslips` | Generate and view payslips |
| `/api/dashboard` | Dashboard stats |
| `/api/profile` | Employee profile |

## Author

**Nayab Shafiq**
GitHub: [@nayab-shafiq-sudo](https://github.com/nayab-shafiq-sudo)