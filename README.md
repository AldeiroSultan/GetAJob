# GetAJob — Team 23 (COSC 360)

A full stack job portal built with React, Node.js, Express, and MongoDB Atlas.

---

## Before You Start

Make sure you have these installed:
- **Node.js** v18 or higher — check with `node -v`
- **npm** — comes with Node, check with `npm -v`

You also need the `.env` file inside the `backend/` folder. If you don't have it, create one and paste this in:

```
PORT=5000
MONGO_URI=mongodb+srv://admin:fakejordans123@cluster0.jspaimy.mongodb.net/getajob?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=fakejordanssecretkey123
```

---

## How to Run It

You need **two terminals open at the same time** — one for the backend, one for the frontend.

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run dev
```
You should see:
```
Server running on port 5000
MongoDB Connected: ...
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```
You should see:
```
VITE ready in ...ms
Local: http://localhost:5173/
```

Then open your browser and go to **http://localhost:5173**

---

## Testing the App

### As a Guest (no account)
- Browse jobs at `/jobs`
- Search and filter jobs by title, location, or type
- Click any job to see the full details
- View discussion threads on job posts
- Trying to apply will redirect you to login

### As a Job Seeker
1. Go to `/register` and create an account — select **Job Seeker**
2. Browse jobs and click **Apply Now** on any job
3. Write an optional cover letter and submit
4. Check your applications on `/profile`

### As an Employer
1. Go to `/register` and create an account — select **Employer**
2. Go to `/employer/dashboard`
3. Click **Post New Job** and fill in the details
4. After posting, you can edit or delete your jobs from the dashboard
5. Click **Applicants** on any job to see who applied

### As an Admin
> Admin accounts have to be set manually in MongoDB Atlas — change a user's role field to `"admin"` in the database.

1. Log in with an admin account
2. Go to `/admin/dashboard` to see site stats
3. Go to `/admin/users` to search, enable/disable, or delete users
4. Go to `/admin/jobs` to view and delete any job listing

---

## Pages Quick Reference

| Page | URL |
|------|-----|
| Home | `/` |
| Browse Jobs | `/jobs` |
| Job Details | `/jobs/:id` |
| Discussion | `/discussion/:jobId` |
| Login | `/login` |
| Register | `/register` |
| Profile | `/profile` |
| Employer Dashboard | `/employer/dashboard` |
| Post a Job | `/employer/post-job` |
| Admin Dashboard | `/admin/dashboard` |
| Manage Users | `/admin/users` |
| Manage Jobs | `/admin/jobs` |
| About | `/about` |
| Contact | `/contact` |

---

## Project Structure

```
GetAJob/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Route logic
│   ├── middleware/           # Auth + file upload middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── uploads/              # Profile image storage
│   ├── .env                  # Environment variables (not on GitHub)
│   └── server.js             # Entry point
│
└── frontend/
    └── src/
        ├── components/       # Navbar, Footer, JobCard, etc.
        ├── context/          # AuthContext (global user state)
        ├── pages/            # All page components
        │   ├── admin/        # Admin pages
        │   └── employer/     # Employer pages
        └── styles/           # CSS files per component
```

---

## Common Issues

**MongoDB won't connect** — The DNS fix is already in `db.js` using Google's DNS servers. If it still fails try a different network.

**Port already in use** — Kill the process using the port or just change `PORT=5001` in your `.env`

**Blank white page** — Open browser console (F12) and check for errors, usually a missing `export default` in one of the page files.

**Can't log in after registering** — Make sure both backend and frontend servers are running at the same time.

---

## Tech Stack

- **Frontend** — React 19, React Router, Vite
- **Backend** — Node.js, Express 5
- **Database** — MongoDB Atlas (cloud), Mongoose ODM
- **Auth** — JWT tokens, bcryptjs password hashing
- **File Uploads** — Multer

---

