"""Health check endpoint."""
from fastapi import APIRouter
from app.core.config import get_settings

router = APIRouter(tags=["health"])
settings = get_settings()


@router.get("/health", summary="Health check")
async def health():
    return {
        "status": "ok",
        "version": settings.app_version,
        "ai_configured": settings.ai_enabled,
        "database_configured": settings.supabase_enabled,
        "model": settings.gemma_model if settings.ai_enabled else "not configured",
    }
