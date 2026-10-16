# HireAI REST API Reference

Base URL: `http://localhost:8000/api/v1` (or production configured origin)

All endpoints accept and return JSON unless receiving `multipart/form-data` file uploads.

---

### 1. Health & Status
- **Method:** `GET`
- **Route:** `/health`
- **Response:**
```json
{
  "status": "healthy",
  "app_version": "1.0.0",
  "environment": "development",
  "ai_enabled": true,
  "model": "gemini-1.5-flash",
  "supabase_enabled": false
}
```

---

### 2. Full Resume Analysis
- **Method:** `POST`
- **Route:** `/api/v1/analyze`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `resume`: PDF File (required)
  - `job_description`: string (required, min 50 chars)
  - `job_title`: string (optional)
  - `company_name`: string (optional)
  - `include_roadmap`: boolean (default `true`)
  - `include_interview_questions`: boolean (default `true`)
- **Response:** Returns complete `AnalysisResponse` schema with candidate profile, requirements, match analysis, ATS diagnostics, resume improvements, skill gaps, learning roadmap, and interview questions.

---

### 3. Standalone ATS Diagnostic
- **Method:** `POST`
- **Route:** `/api/v1/ats-check`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `resume`: PDF File (required)
  - `job_description`: string (optional)
- **Response:** `ATSAnalysis` schema with readability score, section completeness, formatting warnings, keyword coverage, and limitations notice.

---

### 4. Resume Bullet Improvement
- **Method:** `POST`
- **Route:** `/api/v1/resume-improve`
- **Content-Type:** `application/json`
- **Body:**
```json
{
  "resume_text": "Experienced Python developer...",
  "job_description": "Looking for a backend engineer...",
  "section": "Experience"
}
```
- **Response:** List of `ResumeSuggestion` objects with original bullet, suggested rewrite, evidence grounding, reason, and `requires_user_confirmation`.

---

### 5. Tailored Interview Questions
- **Method:** `POST`
- **Route:** `/api/v1/interview-questions`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `resume`: PDF File (required)
  - `job_description`: string (required)
  - `categories`: comma-separated string (optional, e.g. `technical,behavioral`)
  - `question_count`: integer (5–20, default `12`)
- **Response:** List of `InterviewQuestion` objects with question, category, difficulty, rationale, and STAR answer points.

---

### 6. Save Analysis (Optional Persistence)
- **Method:** `POST`
- **Route:** `/api/v1/analyses`
- **Content-Type:** `application/json`
- **Body:**
```json
{
  "analysis": { ... },
  "job_title": "Software Engineer",
  "company_name": "Tech Corp"
}
```
- **Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "access_token": "a8F9z_secure_random_token_string...",
  "message": "Report saved successfully. Store your access token securely to view or delete it later."
}
```

---

### 7. Retrieve Saved Analysis
- **Method:** `GET`
- **Route:** `/api/v1/analyses/{analysis_id}`
- **Headers:** `X-Access-Token: <token>` (or query param `?token=<token>`)
- **Response:** Stored `AnalysisResponse` JSON object.

---

### 8. Delete Saved Analysis
- **Method:** `DELETE`
- **Route:** `/api/v1/analyses/{analysis_id}`
- **Headers:** `X-Access-Token: <token>`
- **Response:**
```json
{
  "message": "Saved analysis successfully deleted."
}
```
