# HireAI Architecture & Design Specification

## 1. System Overview

HireAI is an evidence-based career intelligence platform that analyzes a candidate's resume against a specific job description. It evaluates resume quality, identifies demonstrated evidence vs. missing skills, recommends truthful enhancements, and creates an actionable 30-day learning and interview preparation plan.

```
┌────────────────────────────────────────────────────────┐
│                   React 18 + Vite                      │
│            TypeScript + Tailwind CSS + Lucide          │
└───────────────────────────┬────────────────────────────┘
                            │ REST / multipart (JSON)
┌───────────────────────────▼────────────────────────────┐
│                  FastAPI Application                   │
│               Python 3.11+ / Uvicorn                   │
└─────┬─────────────────────┬──────────────────────┬─────┘
      │                     │                      │
┌─────▼──────────┐   ┌──────▼──────────┐   ┌───────▼────────┐
│  Resume Parser │   │   Job Parser    │   │  DB Client     │
│   (pypdf in    │   │   Validation &  │   │  (Supabase /   │
│   memory)      │   │   Sanitization  │   │   In-Memory)   │
└─────┬──────────┘   └──────┬──────────┘   └────────────────┘
      │                     │
┌─────▼─────────────────────▼────────────────────────────┐
│             AI Provider & Analysis Engine              │
│       - Gemma / Gemini 1.5 Flash (via google-genai)    │
│       - Robust JSON Schema Output Validation           │
│       - Local Heuristic Engine (zero-key fallback)     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│          Deterministic Scoring Engine (Python)         │
│  - Weighted category evaluation (45/25/15/15)          │
│  - Clamped 0-100 score + evidence categorization       │
│  - ATS readability & structure heuristics              │
└────────────────────────────────────────────────────────┘
```

## 2. Core Principles & Design Guarantees

1. **Zero Authentication Friction:**
   - No signups, logins, passwords, sessions, or user accounts.
   - Immediate access upon opening the web application.

2. **Truthful & Anti-Hallucination Improvements:**
   - The AI is instructed never to invent degrees, certifications, companies, or false numerical metrics.
   - Where a quantitative metric would strengthen a bullet, placeholders like `[add verified metric if available]` are suggested.
   - All improvements require user confirmation.

3. **Deterministic Backend Scoring:**
   - The final score is **calculated mathematically by Python backend code**, not taken blindly from an LLM prompt.
   - Formula:
     - Essential Skills: 45%
     - Relevant Projects & Experience: 25%
     - Qualifications & Certifications: 15%
     - Preferred Skills & Tools: 15%

4. **Privacy-by-Default:**
   - Uploaded resumes are parsed directly in memory buffers.
   - Temporary file data is deleted immediately.
   - No raw resume text or PDF files are permanently persisted.

5. **Optional Token-Authenticated Persistence:**
   - Cloud saving to Supabase PostgreSQL is purely opt-in.
   - When saved, a cryptographically secure random token is generated (`secrets.token_urlsafe(32)`).
   - Only the SHA-256 hash of the token is saved in the database.
   - Access and deletion endpoints require this token.
