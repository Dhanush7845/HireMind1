# HireMind ? AI-Powered Resume Intelligence & Career Analysis Platform

> **A Production-Grade Full-Stack Placement & Career Acceleration Platform**  
> *Engineered with React.js, Node.js, Express.js, MongoDB, and Deterministic ATS Scoring Algorithms.*

---

## ?? Executive Summary

**HireMind** is an end-to-end full-stack web platform designed to empower students and job seekers to optimize their resumes for applicant tracking systems (ATS), measure real-time job description compatibility, discover hidden technical skill gaps, and receive recruiter-grade actionable improvement roadmaps.

Rather than relying on vague opaque scoring or generic templates, HireMind features a **deterministic 8-factor evaluation algorithm**, a **normalized canonical skill database (>500 skills)**, robust **PDF/DOCX document text extraction**, and an **ultra-modern SaaS dashboard** built for serious final-year placement demonstrations and recruiter evaluations.

---

## ??? System Architecture & Workflow

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 18 + Vite + Modern SaaS UI Kit)"]
        UI_Land[Landing Page Showcase]
        UI_Auth[Auth: Login / Register]
        UI_Dash[Executive Command Dashboard]
        UI_Upload[Drag & Drop Resume Ingestion]
        UI_Analysis[Resume Intelligence & 8-Factor ATS Score]
        UI_Job[Job Description Matcher & Gap Analysis]
        UI_Reports[Historical Audit Reports & PDF Export]
        UI_Profile[Candidate Profile & Target Roles]
        Axios[Axios API Client + JWT Interceptors]
    end

    subgraph Server ["Backend (Node.js + Express REST API)"]
        AuthMW[JWT Auth Middleware]
        UploadMW[Multer File Filter & 5MB Limit]
        ErrorMW[Centralized Error Handling]
        
        subgraph Controllers
            AuthCtrl[authController]
            ResumeCtrl[resumeController]
            AnalysisCtrl[analysisController]
            JobCtrl[jobController]
            UserCtrl[userController]
        end

        subgraph Engine ["Core Intelligence Services"]
            Parser[resumeParser (PDF & DOCX Extraction)]
            Taxonomy[skillExtractor (500+ Skills & Alias Normalizer)]
            Analyzer[resumeAnalyzer (Section & Entity Recognizer)]
            ATSScorer[atsScorer (8-Factor Deterministic Engine)]
            JobMatcher[jobMatcher (Required vs Preferred Skill Gap)]
        end
    end

    subgraph DB ["Database (MongoDB + Mongoose)"]
        M_User[(Users)]
        M_Resume[(Resumes)]
        M_Analysis[(Analyses)]
        M_Job[(JobMatches)]
    end

    Client -->|REST API + JWT Bearer| Server
    UploadMW --> Parser --> Taxonomy --> Analyzer --> ATSScorer
    JobCtrl --> JobMatcher
    Controllers --> DB
```

---

## ?? Key Features

### 1. ?? Multi-Format Resume Ingestion & Extraction
- Supports both **PDF** (`pdf-parse`) and **Word DOCX** (`mammoth`) documents with a 5MB size limit.
- Cleans and normalizes unicode characters, bullets, dashed lists, and section delimiters.
- Extracts structured entity models:
  - **Personal Info**: Full Name, Email, Phone, LinkedIn, GitHub, Portfolio URL, Location.
  - **Education**: Degree (B.Tech, M.S., B.S., etc.), College/University, CGPA / Percentage, Graduation Year.
  - **Work & Internship Experience**: Role, Company, Duration, Responsibilities.
  - **Projects**: Title, Tech Stack Pills, Descriptive Highlights.
  - **Certifications**: Title, Issuing Authority (AWS, Google, Meta, Coursera, Oracle, etc.).

### 2. ?? Canonical Skill Database & Alias Normalization
- Normalized taxonomy covering **500+ skills** grouped into 7 domains:
  1. *Programming Languages* (Java, Python, JavaScript, TypeScript, C++, Go, Rust, etc.)
  2. *Frameworks & Libraries* (React, Node.js, Express.js, Next.js, Django, Spring Boot, etc.)
  3. *Databases & Caching* (MongoDB, PostgreSQL, MySQL, Redis, DynamoDB, Oracle, etc.)
  4. *Cloud & DevOps* (AWS, Docker, Kubernetes, CI/CD, Terraform, Linux, etc.)
  5. *AI / ML & Data Science* (PyTorch, TensorFlow, Scikit-learn, Pandas, NLP, Computer Vision)
  6. *Core CS & Methodologies* (Data Structures & Algorithms, OOP, System Design, REST APIs, Microservices)
  7. *Tools & Platforms* (Git, GitHub, Postman, Jira, Figma, Vite, Jest)
- Normalizes variations automatically (`ReactJS` $\to$ `React`, `NodeJS` $\to$ `Node.js`, `Mongo` $\to$ `MongoDB`, `Python3` $\to$ `Python`, etc.) using word-boundary safe pattern matching.

### 3. ?? Deterministic "HireMind ATS Compatibility Score" (0?100)
Transparent, deterministic scoring modeled after real recruiter evaluation rubrics:
| Factor | Weight | Evaluation Criteria |
| :--- | :---: | :--- |
| **Skills Relevance & Density** | **25%** | Total count, multi-category diversity, and industry standard stack coverage |
| **Work / Internship Experience** | **20%** | Verified industry tenures, role relevance, and quantifiable metrics (e.g. "improved by 40%") |
| **Technical Projects Depth** | **15%** | Multiple end-to-end full-stack projects showcasing real-world technologies |
| **Education Credentials** | **10%** | Degree clarity, accredited university, graduation year, and CGPA |
| **Resume Structure & Sections** | **10%** | Standard ATS-compliant section headers and logical readability |
| **Keyword Optimization** | **10%** | Active technical action verbs (*architected*, *engineered*, *deployed*, *optimized*) |
| **Contact Information** | **5%** | Complete header with Email, Phone, GitHub, and LinkedIn hyperlinks |
| **Certifications & Badges** | **5%** | Verified cloud, software engineering, and vendor certifications |

### 4. ?? Job Description Matching & Gap Analysis
- Paste any real-world job posting (e.g., from LinkedIn, Indeed, campus placement drives).
- Pre-loaded with **4 one-click instant demo templates** (MERN Full Stack, AI/ML Engineer, Frontend UI, Backend & DevOps).
- Computes:
  - **Compatibility Score (0?100%)** with category grade (*Excellent Match*, *Good Match*, *Moderate Match*, *Low Match*).
  - **Matching Skills List** (verified skills you already have).
  - **Missing Skills List** (critical skill gaps to address).
  - **Keyword Density Analysis** (frequency of requirements in the posting vs resume).
  - **Tailored Resume Optimization Strategy**.

### 5. ?? Executive Candidate Command Dashboard
- Key metric cards: Latest ATS Score, Job Compatibility %, Total Skills Detected, Analyses Completed.
- Interactive Chart.js visualizations: Historical Score Progression trendline & Skill Arsenal Doughnut.
- Recent analyses quick audit table with instant drill-down.

### 6. ?? Historical Reports & Profile Management
- Audit history of all previous resume analyses and job match evaluations.
- Search and filtering across records.
- PDF / Print export capabilities.
- Candidate Profile settings to manage target career roles and change credentials.

---

## ??? Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router v6, Axios, Chart.js, react-chartjs-2, Lucide Icons, Canvas Confetti |
| **Styling** | Custom Pure CSS3 SaaS Design System, Modern Glassmorphism, CSS Grid/Flexbox, Plus Jakarta Sans |
| **Backend** | Node.js (ESM), Express.js 4, Mongoose 8, JWT, bcryptjs, Multer |
| **Document Processing** | `pdf-parse` (PDF text extraction), `mammoth` (DOCX parsing), Regex Tokenizers |
| **Database** | MongoDB (Local / Atlas) |
| **Security** | JWT Bearer Auth, bcrypt password hashing (salt=10), sanitized uploads, centralized error handling |

---

## ?? Project Structure

```
HireMind/
??? client/                     # Frontend Application
?   ??? src/
?   ?   ??? components/         # Reusable UI Components
?   ?   ?   ??? Navbar.jsx
?   ?   ?   ??? Sidebar.jsx
?   ?   ?   ??? ResumeUpload.jsx
?   ?   ?   ??? ResumeScore.jsx
?   ?   ?   ??? SkillCard.jsx
?   ?   ?   ??? SkillGap.jsx
?   ?   ?   ??? JobMatchCard.jsx
?   ?   ?   ??? AnalysisCard.jsx
?   ?   ?   ??? RecommendationCard.jsx
?   ?   ?   ??? WeeklyChart.jsx
?   ?   ?   ??? LoadingSpinner.jsx
?   ?   ??? pages/              # Main Route Pages
?   ?   ?   ??? Landing.jsx
?   ?   ?   ??? Login.jsx
?   ?   ?   ??? Register.jsx
?   ?   ?   ??? Dashboard.jsx
?   ?   ?   ??? ResumeAnalysis.jsx
?   ?   ?   ??? JobMatch.jsx
?   ?   ?   ??? Reports.jsx
?   ?   ?   ??? Profile.jsx
?   ?   ??? services/
?   ?   ?   ??? api.js          # Axios Client with Auth Interceptors
?   ?   ??? context/
?   ?   ?   ??? AuthContext.jsx # Auth State Provider
?   ?   ??? App.jsx             # React Router Setup
?   ?   ??? main.jsx            # React Entry Point
?   ?   ??? style.css           # Full Modern SaaS Design System
?   ??? package.json
?   ??? vite.config.js
?
??? server/                     # Backend API Server
?   ??? config/
?   ?   ??? db.js               # MongoDB Mongoose Connection
?   ??? controllers/
?   ?   ??? authController.js
?   ?   ??? resumeController.js
?   ?   ??? analysisController.js
?   ?   ??? jobController.js
?   ?   ??? userController.js
?   ??? middleware/
?   ?   ??? authMiddleware.js   # JWT Protection
?   ?   ??? uploadMiddleware.js # Multer Validation (PDF/DOCX <= 5MB)
?   ?   ??? errorMiddleware.js  # Centralized Error Handler
?   ??? models/
?   ?   ??? User.js
?   ?   ??? Resume.js
?   ?   ??? Analysis.js
?   ?   ??? JobMatch.js
?   ??? routes/
?   ?   ??? authRoutes.js
?   ?   ??? resumeRoutes.js
?   ?   ??? analysisRoutes.js
?   ?   ??? jobRoutes.js
?   ?   ??? userRoutes.js
?   ??? services/
?   ?   ??? resumeParser.js     # PDF & DOCX Ingestion
?   ?   ??? resumeAnalyzer.js   # Entity & Section Extraction
?   ?   ??? skillExtractor.js   # Canonical Taxonomy & Normalization
?   ?   ??? atsScorer.js        # Deterministic 8-Factor ATS Algorithm
?   ?   ??? jobMatcher.js       # Required vs Preferred Gap Analysis
?   ??? tests/
?   ?   ??? testSuite.js        # Unit Tests for Parser & Scorer
?   ?   ??? testE2E.js          # Live HTTP API End-to-End Test
?   ??? uploads/                # Managed upload directory
?   ??? .env                    # Environment Variables
?   ??? package.json
?   ??? server.js               # Server Entry Point
?
??? README.md
??? .gitignore
```

---

## ? Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+)
- [MongoDB](https://www.mongodb.com/) (Running locally or MongoDB Atlas URI)

### 1. Clone or Navigate to Project
```bash
cd HireMind
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create/check `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/Hiremind
JWT_SECRET=hiremind_super_secure_jwt_secret_key_2026_placement_project
CLIENT_URL=http://localhost:5173
```

Start the Backend Server:
```bash
npm start
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
# Frontend will run on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser!

---

## ?? Running Automated Tests

Run backend unit and integration test suites:

```bash
# 1. Test Parser, Normalizer, ATS Scorer, and Job Matcher Logic
cd server
node tests/testSuite.js

# 2. Test Full Live REST APIs End-to-End with MongoDB
node tests/testE2E.js
```

---

## ?? REST API Reference

### Authentication
- `POST /api/auth/register` ? Register a new candidate account.
- `POST /api/auth/login` ? Sign in and receive JWT token.
- `GET /api/auth/me` ? Get current logged-in user profile.

### Resume Ingestion & Analysis
- `POST /api/resumes/upload` ? Upload PDF/DOCX file, parse text, compute ATS score, and store structured analysis (`multipart/form-data`).
- `GET /api/resumes` ? List all resumes for the authenticated user.
- `GET /api/resumes/:id` ? Retrieve a single resume with analysis snapshot.
- `DELETE /api/resumes/:id` ? Delete resume and associated records.

### Analysis & Dashboard
- `GET /api/analysis` ? List all analysis history reports.
- `GET /api/analysis/:id` ? Get full single analysis breakdown.
- `GET /api/analysis/dashboard/stats` ? Consolidated dashboard metrics, score history, and category distributions.

### Job Description Matching
- `POST /api/jobs/analyze` ? Match a job description against candidate resume skills (`{ jobTitle, company, jobDescription, resumeId }`).
- `GET /api/jobs/history` ? List previous job matching records.
- `GET /api/jobs/:id` ? Get single job match record.
- `DELETE /api/jobs/:id` ? Delete a job match record.

### User Profile
- `GET /api/users/profile` ? Get candidate profile and placement summary.
- `PUT /api/users/profile` ? Update name, email, target roles, bio, and skills.
- `PUT /api/users/change-password` ? Change password with current password verification.

---

## ?? Recruiter & Placement Viva Talking Points

1. **Why deterministic ATS scoring over opaque LLM prompts?**  
   *Deterministic scoring ensures 100% reproducibility, zero API billing costs, millisecond response latency, and crystal-clear transparency for candidate feedback across standard evaluation criteria.*
2. **How does skill normalization work?**  
   *Word-boundary regular expressions map hundreds of real-world aliases (`ReactJS`, `React.js`, `NodeJS`, `Mongo`, `Python3`, `C++`, `RESTful API`) to normalized canonical identifiers without false-positive sub-string collisions.*
3. **How does Job Description Matching differentiate requirements?**  
   *The engine parses job descriptions into Required vs Preferred qualifications, assigns weighted scoring (70% required, 20% preferred, 10% keyword density), and pinpoints exact missing skills to prepare for interviews.*

---

? 2026 **HireMind Platform** ? AI-Powered Resume Intelligence. Built for Placement Excellence.
