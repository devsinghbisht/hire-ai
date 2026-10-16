-- Migration: 001_create_resume_analyses.sql
-- Description: Optional anonymous storage for saved resume analysis reports

CREATE TABLE IF NOT EXISTS resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title TEXT,
    company_name TEXT,
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    report_json JSONB NOT NULL,
    access_token_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance and lookup
CREATE INDEX IF NOT EXISTS idx_resume_analyses_created_at ON resume_analyses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_token ON resume_analyses (access_token_hash);

-- Enable Row Level Security (RLS)
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;

-- Note: All reads, writes, and deletes are executed securely via the FastAPI backend using
-- service-role permissions after token verification. No direct public anonymous read/write policy is granted.
COMMENT ON TABLE resume_analyses IS 'Stores user-initiated saved analysis reports protected by hashed access tokens';
