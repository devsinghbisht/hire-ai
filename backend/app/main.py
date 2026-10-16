"""HireAI FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logging_config import setup_logging
from app.api.routes.analysis import router as analysis_router
from app.api.routes.health import router as health_router

setup_logging()
settings = get_settings()

app = FastAPI(
    title="HireAI API",
    description="AI-Powered Resume Analysis, Job Matching, and Career Guidance API",
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "Accept"],
)

app.include_router(health_router)
app.include_router(analysis_router)


@app.get("/", include_in_schema=False)
async def root():
    return {"message": "HireAI API is running. Visit /docs for API documentation."}
