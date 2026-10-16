# HireAI 🎯
### AI-Powered Resume Analysis, Intelligent Job Matching, and Career Guidance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)

HireAI is an open-source, evidence-based career intelligence platform that analyzes a candidate's resume against a specific job description, evaluates document quality, identifies demonstrated evidence vs. missing requirements, recommends truthful bullet enhancements, and generates a personalized 30-day learning roadmap and interview preparation guide.

---

## 1. Problem Statement & Why It Matters

Job seekers face critical hurdles in today's tech hiring landscape:
- **Opaque ATS Systems:** Candidates receive generic automated rejection emails without actionable feedback on why their resume was rejected.
- **Generic "AI Chatbot" Advice:** Chatbots often hallucinate fictional experiences, invent false numerical metrics (e.g. "increased revenue by 300%"), or advise keyword stuffing that hurts credibility.
- **Skill-Gap Blindness:** Candidates struggle to determine which specific requirements from a job description are actually missing from their resume vs. which simply need clearer wording.
- **Account Friction & Privacy Concerns:** Most resume platforms demand accounts, credit cards, or permanently store candidates' personal resumes and data.

HireAI solves this with an **evidence-based, privacy-first, zero-login** workflow that produces explainable, deterministic scores and truthful suggestions grounded strictly in submitted text.

---

## 2. Core Questions HireAI Answers

1. **Match Score:** How well does my resume align with this specific job description?
2. **Evidence Breakdown:** Which requirements are demonstrated, partially shown, or missing?
3. **ATS Diagnostics:** Is my document structured properly for parsing and readability?
4. **Truthful Rewrites:** How can I sharpen my bullet points using strong action verbs without fabricating claims?
5. **Interview Preparation:** What technical and behavioral questions should I expect based on my actual projects?
6. **Career Roadmap:** What practical 30-day projects and tasks will close my critical skill gaps?

---

## 3. Key Features

- ⚡ **Zero Login Required:** Immediate analysis upon opening the application. No signups, accounts, or cookies.
- 📄 **Robust PDF Processing:** In-memory extraction using `pypdf` with validation of MIME types, byte limits, and whitespace normalization.
- 🧠 **Gemma / Gemini 1.5 Flash AI Engine:** Deep requirement extraction, evidence alignment, and STAR interview question generation via official `google-genai` SDK.
- 🛡️ **Offline Heuristic Engine:** Runs fully functional analysis with local keyword extraction and deterministic scoring even without an AI key configured.
- ⚖️ **Explainable Deterministic Scoring:** Mathematical backend formula (not hallucinated by an LLM prompt):
  - Essential Skills & Competencies: 45%
  - Relevant Projects & Experience: 25%
  - Qualifications & Certifications: 15%
  - Preferred Skills & Tools: 15%
- 🔍 **ATS Diagnostics & Myth-Busting:** Checks standard section completeness, single-column hierarchy, and term density while clarifying how ATS systems actually work.
- ✍️ **Anti-Hallucination Bullet Rewrites:** Original vs. Suggested rewrites with grounding evidence, copy buttons, and local accept/reject controls.
- 🗺️ **Personalized 30-Day Roadmap:** Phased milestones with practical tasks, demo project ideas, effort estimates, and verifiable completion criteria.
- 🎤 **Targeted Interview Prep:** Role-specific, behavioral, and project-grounded questions with STAR talking points, plus dynamic question regeneration.
- 💾 **Optional Anonymous Cloud Persistence:** Save reports to Supabase PostgreSQL using cryptographically hashed SHA-256 access tokens. Retrieve or delete anytime with your private key.
- 📥 **Export to HTML / PDF / JSON:** One-click offline export for sharing or printing.

---

## 4. Technology Stack

### Frontend
- **Framework:** React 18, TypeScript, Vite
- **Styling:** Vanilla Tailwind CSS with custom HSL palette and subtle micro-animations
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form, Zod

### Backend
- **Framework:** FastAPI, Python 3.11+ / 3.13
- **Server:** Uvicorn (ASGI)
- **PDF Extraction:** `pypdf` (in-memory, zero permanent file persistence)
- **Validation:** Pydantic v2
- **Testing:** Pytest, pytest-asyncio, HTTPX

### AI & Data Layer
- **AI Model:** Gemma / Gemini 1.5 Flash (isolated behind `AIProvider`)
- **Database (Optional):** Supabase PostgreSQL (with Row Level Security and token hashing)

---

## 5. Architecture Overview

```
React Frontend (Vite + Tailwind)
   │
   ▼ HTTP Multipart / JSON
FastAPI Backend (app/main.py)
   ├── Resume Parser (In-memory pypdf extraction)
   ├── Job Parser (Validation & requirement parsing)
   ├── AI Provider (Google Gen AI SDK / Local Heuristic Engine)
   ├── Deterministic Scoring Engine (Calculated in Python)
   └── Optional Database Client (Supabase with SHA-256 tokens)
```

---

## 6. How the Match Score is Calculated

The final score is **calculated deterministically in Python**, not generated randomly or accepted blindly from an LLM prompt:

$$\text{Category Score} = \frac{\sum (\text{Evidence Weight} \times \text{Importance})}{\sum \text{Max Possible Weight}} \times 100$$

Where Evidence Weights are:
- **Demonstrated:** $1.0$
- **Partially Demonstrated:** $0.5$
- **Not Found in Resume:** $0.0$

Final weighted overall score:
- **Essential Skills:** 45%
- **Experience & Projects:** 25%
- **Qualifications & Certifications:** 15%
- **Preferred Skills & Tools:** 15%

Scores are bounded between 0 and 100 and mapped to transparent alignment tiers (Strong, Moderate, Limited).

---

## 7. Prerequisites

- **Python:** 3.11, 3.12, or 3.13
- **Node.js:** 18+ or 20+
- **Google AI API Key (Optional):** For Gemini / Gemma hosted inference. *(HireAI will automatically fall back to its internal heuristic engine if no key is provided.)*
- **Supabase Account (Optional):** For cloud report persistence.

---

## 8. Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/hireai.git
cd hireai
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Edit `backend/.env` with your settings:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMMA_MODEL=gemini-1.5-flash
AI_PROVIDER=google
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
MAX_UPLOAD_MB=5
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

`frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 9. Running the Application

### Start Backend
In terminal 1 (`backend` directory with venv active):
```bash
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### Start Frontend
In terminal 2 (`frontend` directory):
```bash
npm run dev
```
Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 10. Optional Supabase Setup

If you want cloud report persistence:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Go to SQL Editor and run `supabase/migrations/001_create_resume_analyses.sql`.
3. Copy your Project URL and `service_role` secret key into `backend/.env`:
```env
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

*Note: If Supabase credentials are not supplied, HireAI seamlessly stores saved reports in memory.*

---

## 11. Running Automated Tests

HireAI includes full automated backend testing with mocked AI responses:

```bash
cd backend
source venv/bin/activate
pytest -v
```

Expected output:
```
============================== 33 passed in 0.08s ==============================
```

To test the frontend build:
```bash
cd frontend
npm run build
```

---

## 12. Two-Minute Hackathon Demo Script

1. **Open [http://localhost:5173](http://localhost:5173):** Point out the lack of login or account friction.
2. **One-Click Demo:** Click **"Load Sample Resume & Tech Lead Job Description"** on the homepage to populate realistic data instantly.
3. **Run Analysis:** Click **"Analyze My Resume"** and watch the real-time stage progress bar.
4. **Review Match Score:** Show the 0–100 score, evidence breakdown (Demonstrated, Partial, Missing), and the transparent calculation formula.
5. **Inspect ATS Diagnostics:** Navigate to the ATS tab to see standard section checks and keyword coverage.
6. **Truthful Rewrites:** Open the Resume Improvement page to show bullet rewrites with grounding evidence, copy buttons, and Accept/Reject buttons.
7. **Personalized 30-Day Roadmap:** Show the phased learning curriculum with estimated hours and concrete project ideas.
8. **Interview Prep:** View STAR talking points and click **"Generate More Questions"** to trigger a real backend call.
9. **Export Report:** Click **"Export HTML"** to download a self-contained offline report, **"Print / PDF"** to print or save as PDF, or **"Copy JSON"** to copy raw analysis data.

---

## 13. Limitations & Disclaimers

- **ATS Heuristics:** Different proprietary applicant tracking systems use varying algorithms; HireAI provides structural and readability guidance, not a guaranteed simulation of any specific vendor.
- **OCR:** Scanned image-only PDFs are detected and rejected with a helpful error prompt; text-based PDFs are required.
- **Hiring Decisions:** HireAI is designed to assist candidates with self-improvement; it is not a candidate screening or hiring decision tool.

---

## 14. License

HireAI is released under the [MIT License](LICENSE). Contributions, bug reports, and pull requests are warmly welcome!
