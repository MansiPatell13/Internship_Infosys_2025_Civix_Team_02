# Internship_Infosys_2025_Civix_Team_02

# Civix – Digital Civic Engagement & Petition Platform

**Civix** is a full-stack web platform that empowers citizens to participate in local governance by enabling petition creation, polling, and transparent communication with public officials. It promotes civic engagement through geo-targeted issues and public sentiment tracking.

---

## 🌟 Features

- 🔐 **User Roles & Authentication**  
  Secure registration and login for citizens and officials, including OTP verification and password reset.

- 📝 **Petition Management**  
  Create, sign, filter, and manage petitions based on category and location.

- 📊 **Public Sentiment Polling**  
  Citizens vote on polls; results are visualized in real-time.

- 🏛️ **Official Response & Reporting**  
  Officials respond to petitions and generate downloadable engagement reports.

- 📍 **Geo-tagging Support**  
  Petitions and polls can be filtered by user location.

---

## 🧰 Tech Stack

### 🔧 Backend (Node.js + Express)
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT-based auth, role-based access control
- **Environment Config**: `.env`
- **Main Entry**: `server.js`

### 🎨 Frontend (React + Vite)
- **Routing**: React Router
- **State Management**: Context API
- **Styling**: CSS Modules

---

## 📁 Project Structure

```plaintext
Civix/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── src/
│       ├── config/                  # Database connection (db.js)
│       ├── controllers/            # Business logic (petition, poll, report, etc.)
│       │   ├── comment.controller.js
│       │   ├── petition.controller.js
│       │   ├── poll.controller.js
│       │   └── report.controller.js
│       ├── middleware/             # Auth, role check, caching
│       │   ├── auth.js
│       │   ├── cacheControl.js
│       │   ├── checkRole.js
│       │   └── role.js
│       ├── models/                 # Mongoose schemas
│       │   ├── Comment.js
│       │   ├── Complaint.js
│       │   ├── Petition.js
│       │   ├── Report.js
│       │   ├── User.js
│       │   ├── poll.js
│       │   └── vote.js
│       └── routes/                 # Express route handlers
│           ├── auth.routes.js
│           ├── comment.routes.js
│           ├── dashboard.routes.js
│           ├── forgotPassword.routes.js
│           ├── official.routes.js
│           ├── petition.routes.js
│           ├── poll.routes.js
│           ├── report.routes.js
│           └── settings.routes.js

├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── emo_copy.jpg
│   │   ├── issues.jpg
│   │   ├── logo.png
│   │   ├── map.png
│   │   └── vite.svg
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── App.css
│       ├── assets/
│       │   └── react.svg
│       ├── components/
│       │   ├── Auth/
│       │   │   ├── login.jsx, signup.jsx, otpverification.jsx, etc.
│       │   ├── Landing/
│       │   │   ├── Home.jsx, Footer.jsx, Navbar.jsx
│       │   ├── NavbarPoll/
│       │   ├── Petition/
│       │   ├── poll/
│       │   ├── Reports/
│       │   └── setting/
│       ├── pages/
│       │   └── PollPage.jsx
│       ├── utils/
│       │   └── api.js
│       ├── DashboardHome.jsx
│       ├── DashboardLayout.jsx
│       ├── ProtectedRoute.jsx
│       └── ResetPassword.jsx

├── README.md
├── .gitignore
├── .git.code-workspace
├── package-lock.json
└── eslint.config.js
```

## 🚀 Getting Started
1. Clone the Repository
```bash
git clone https://github.com/MansiPatell13/internship_infosys_2025_civix_team_02.git
cd internship_infosys_2025_civix_team_02
git checkout front2

```

2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

3. Frontend Setup
``` bash
cd frontend
npm install
npm run dev
```
