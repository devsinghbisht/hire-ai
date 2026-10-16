"""Optional Supabase database client with secure token-based anonymous persistence."""
import hashlib
import hmac
import secrets
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple

from app.core.config import get_settings
from app.core.logging_config import get_logger

logger = get_logger(__name__)
settings = get_settings()

_supabase_client = None

# In-memory store when Supabase is not configured (cleared on restart)
_local_store: Dict[str, Dict[str, Any]] = {}


def _hash_token(token: str) -> str:
    """Generate SHA-256 hash of access token for storage and lookup."""
    return hashlib.sha256(token.strip().encode("utf-8")).hexdigest()


def get_supabase_client():
    """Get Supabase client if configured, else None."""
    global _supabase_client
    if not settings.supabase_enabled:
        return None
    if _supabase_client is None:
        try:
            from supabase import create_client
            _supabase_client = create_client(
                settings.supabase_url,
                settings.supabase_service_role_key,
            )
            logger.info("Supabase client initialized successfully")
        except Exception as exc:
            logger.error("Failed to initialize Supabase client: %s", exc)
            return None
    return _supabase_client


def save_analysis_record(
    report_json: Dict[str, Any],
    job_title: Optional[str] = None,
    company_name: Optional[str] = None,
    match_score: Optional[int] = None,
) -> Tuple[str, str]:
    """
    Save analysis report and return (analysis_id, raw_access_token).
    The raw token is only returned once and never stored in plaintext.
    """
    analysis_id = str(uuid.uuid4())
    raw_token = secrets.token_urlsafe(32)
    token_hash = _hash_token(raw_token)
    created_at = datetime.now(timezone.utc).isoformat()

    client = get_supabase_client()
    if client is not None:
        try:
            data = {
                "id": analysis_id,
                "job_title": job_title,
                "company_name": company_name,
                "match_score": match_score,
                "report_json": report_json,
                "access_token_hash": token_hash,
            }
            client.table("resume_analyses").insert(data).execute()
            logger.info("Saved analysis %s to Supabase", analysis_id)
            return analysis_id, raw_token
        except Exception as exc:
            logger.warning("Supabase save failed (%s); storing in local memory", exc)

    # In-memory storage fallback
    _local_store[analysis_id] = {
        "id": analysis_id,
        "job_title": job_title,
        "company_name": company_name,
        "match_score": match_score,
        "report_json": report_json,
        "access_token_hash": token_hash,
        "created_at": created_at,
    }
    return analysis_id, raw_token


def get_analysis_record(analysis_id: str, raw_token: str) -> Optional[Dict[str, Any]]:
    """Retrieve saved analysis after validating the access token."""
    expected_hash = _hash_token(raw_token)

    client = get_supabase_client()
    if client is not None:
        try:
            resp = client.table("resume_analyses").select("*").eq("id", analysis_id).execute()
            if resp.data and len(resp.data) > 0:
                row = resp.data[0]
                stored_hash = row.get("access_token_hash", "")
                if hmac.compare_digest(stored_hash, expected_hash):
                    return row.get("report_json")
                logger.warning("Access token mismatch for analysis %s", analysis_id)
                return None
        except Exception as exc:
            logger.warning("Supabase get failed (%s); checking local memory", exc)

    # Check local store
    record = _local_store.get(analysis_id)
    if record:
        stored_hash = record.get("access_token_hash", "")
        if hmac.compare_digest(stored_hash, expected_hash):
            return record.get("report_json")
    return None


def delete_analysis_record(analysis_id: str, raw_token: str) -> bool:
    """Delete saved analysis after validating the access token."""
    expected_hash = _hash_token(raw_token)

    client = get_supabase_client()
    if client is not None:
        try:
            # First verify token
            resp = client.table("resume_analyses").select("access_token_hash").eq("id", analysis_id).execute()
            if resp.data and len(resp.data) > 0:
                stored_hash = resp.data[0].get("access_token_hash", "")
                if hmac.compare_digest(stored_hash, expected_hash):
                    client.table("resume_analyses").delete().eq("id", analysis_id).execute()
                    logger.info("Deleted analysis %s from Supabase", analysis_id)
                    return True
                return False
        except Exception as exc:
            logger.warning("Supabase delete failed (%s); checking local memory", exc)

    # Check local store
    record = _local_store.get(analysis_id)
    if record:
        stored_hash = record.get("access_token_hash", "")
        if hmac.compare_digest(stored_hash, expected_hash):
            del _local_store[analysis_id]
            return True
    return False
