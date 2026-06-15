# SkillBridge AI

An AI-powered career development platform built for engineering 
students preparing for campus placements. The platform combines 
resume analysis, skill gap detection, mock interviews, and mentor 
matching in a single full-stack application.

---

## Problem Statement

Engineering students face four core problems during placement 
preparation:

1. They do not know if their resume is ATS compatible
2. They cannot identify which skills they are missing for a role
3. They have no structured way to practice interviews
4. They lack access to industry mentors

SkillBridge AI addresses all four problems in one platform.

---

## Features

**Resume Analyzer**
Upload a PDF or DOCX resume. The system extracts text, matches 
it against job role requirements, and returns an ATS score with 
a breakdown of matched and missing skills.

**Skill Gap Analysis**
Select a target role. The platform compares your resume skills 
against role requirements and lists exactly what you need to learn.

**AI Mock Interview**
Generate role-specific interview questions using Google Gemini AI. 
Submit answers and receive a score with structured feedback 
covering strengths and areas for improvement.

**Job Description Matcher**
Paste any job description. The system extracts technical keywords 
and calculates a match percentage against your skill profile.

**Cover Letter Generator**
Provide company name, role, experience, and tone. Gemini AI 
generates a complete, ready-to-send cover letter.

**LinkedIn Profile Analyzer**
Paste your LinkedIn profile text. The system scores each section 
and generates an optimized headline and about section using AI.

**Mentor Matching**
Mentors are recommended based on the skills you are missing. 
View experience, ratings, and connect directly.

**Public Profile Page**
Each user gets a shareable profile at /profile/username showing 
skills, ATS score, and interview performance. No login required 
to view.

---

## Tech Stack

**Frontend**
- React.js
- React Router DOM
- CSS3

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- jsonwebtoken
- Multer
- pdf-parse
- mammoth

**AI**
- Google Gemini API
- Model: gemini-2.5-flash

---

## Project Structure

```
SkillBridge/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── resume.js
│   │   ├── interview.js
│   │   ├── coverletter.js
│   │   ├── linkedin.js
│   │   └── mentor.js
│   ├── .env
│   ├── .gitignore
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   └── PublicProfile.jsx
│       └── App.js
│
└── README.md
```

---

## Getting Started

### Prerequisites

```
Node.js v18+
MongoDB Atlas account
Google Gemini API key
```

### Installation

Clone the repository:

```bash
git clone https://github.com/divyabansal24/skillbridge-ai.git
cd skillbridge-ai
```

Setup backend:

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the backend:

```bash
node server.js
```

Setup frontend:

```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000` in your browser.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and receive JWT |
| POST | /api/resume/upload | Upload resume and get ATS score |
| POST | /api/interview/questions | Generate interview questions |
| POST | /api/interview/evaluate | Evaluate answer with AI |
| POST | /api/coverletter/generate | Generate cover letter |
| POST | /api/linkedin/analyze | Analyze LinkedIn profile |
| POST | /api/jd/match | Match job description |
| GET | /api/profile/:username | Get public profile |
| POST | /api/user/setup-profile | Update profile settings |
| POST | /api/user/sync-scores | Sync scores to database |

---

## Security

- Passwords hashed using bcryptjs with salt rounds of 10
- Authentication handled via JWT tokens with 24 hour expiry
- Environment variables used for all sensitive credentials
- Passwords never returned in API responses
- Resume files deleted from server after processing

---

## Developer

Divya Bansal
BTech Computer Science Engineering
SRMIST Chennai, Class of 2027

- GitHub: github.com/divyabansal24
- LinkedIn: linkedin.com/in/divya-bansal2412

---

## License

This project was built as a final year academic project at 
SRMIST Chennai. Open for reference and learning purposes.