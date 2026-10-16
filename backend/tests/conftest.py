"""Shared test fixtures."""
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


SAMPLE_JD = """
Software Engineer - Python Backend

We are looking for a Python Backend Engineer with:
- 2+ years of experience with Python
- Strong knowledge of FastAPI or Django
- Experience with PostgreSQL or MySQL databases
- Familiarity with Docker and containerization
- Experience with REST API design
- Good understanding of Git and version control

Preferred:
- Experience with AWS or GCP
- Knowledge of Redis for caching
- Familiarity with CI/CD pipelines

Responsibilities:
- Design and implement scalable backend services
- Write clean, testable code
- Collaborate with frontend engineers
"""

SAMPLE_RESUME_TEXT = """
John Doe
john.doe@email.com | github.com/johndoe | linkedin.com/in/johndoe

EDUCATION
B.Tech Computer Science - XYZ University, 2023

SKILLS
Python, FastAPI, PostgreSQL, Git, Docker, REST APIs, JavaScript

PROJECTS
Resume Analyzer - Built a resume analysis tool using Python and FastAPI.
  Technologies: Python, FastAPI, PostgreSQL, Docker
  Highlights: Designed REST API endpoints, deployed with Docker

Task Manager - A task management application
  Technologies: Python, Django, SQLite

CERTIFICATIONS
AWS Cloud Practitioner (2023)
"""
