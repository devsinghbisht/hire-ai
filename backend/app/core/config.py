"""Application configuration loaded from environment variables."""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # AI Provider
    gemini_api_key: str = ""
    gemma_model: str = "gemini-3.1-flash-lite"
    ai_provider: str = "google"

    # Supabase (optional)
    supabase_url: str = ""
    supabase_service_role_key: str = ""

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Upload limits
    max_upload_mb: int = 5
    max_resume_text_chars: int = 15000
    max_job_description_chars: int = 8000

    # App
    environment: str = "development"
    app_version: str = "1.0.0"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_mb * 1024 * 1024

    @property
    def supabase_enabled(self) -> bool:
        return bool(self.supabase_url and self.supabase_service_role_key)

    @property
    def ai_enabled(self) -> bool:
        return bool(self.gemini_api_key)


@lru_cache()
def get_settings() -> Settings:
    return Settings()
