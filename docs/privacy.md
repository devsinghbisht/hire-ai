# HireAI Candidate Privacy & Responsible AI Framework

## 1. Candidate Data Privacy
HireAI is built on a privacy-by-default architecture:
- **No User Profiling or Tracking:** We do not track candidates across sessions or create persistent profiles.
- **In-Memory Buffer Extraction:** Resumes are processed in volatile memory. No PDF files are saved to permanent directories.
- **Immediate Discard:** As soon as extraction and analysis complete, file objects are released from memory.
- **No Third-Party Resale or Training:** Candidate text is never sold, shared with recruiters, or used to fine-tune public language models.

## 2. Responsible AI Guidelines
- **No Automatic Rejection:** HireAI is an analytical assistant for job applicants. It does not automate hiring decisions, screen out applicants, or make final determinations of employability.
- **Anti-Hallucination Guardrails:** The platform explicitly forbids the AI from fabricating degrees, certifications, numerical achievements, or employment periods.
- **Score Transparency:** Scores represent textual alignment between the resume and the job description, not an objective measure of a candidate's human capability or potential.
- **Protected Characteristics:** Analysis is based strictly on skills, responsibilities, projects, and educational qualifications without inferring race, age, gender, ethnicity, disability, or other protected attributes.
