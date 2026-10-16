"""Resume improvement service focusing on truthful, evidence-grounded enhancements."""
import asyncio
import re
from typing import Any, Dict, List, Optional

from app.core.logging_config import get_logger
from app.schemas.analysis import ResumeSuggestion
from app.services.ai_provider import call_ai

logger = get_logger(__name__)

PROMPT_TEMPLATE = """You are an expert resume editor and career advisor.
Review the following resume excerpt against the target job description.
Suggest 3 to 6 targeted improvements for the candidate's bullet points.

CRITICAL TRUTHFULNESS & ANTI-HALLUCINATION RULES:
1. Do NOT invent companies, degrees, dates, certifications, or technologies the candidate did not mention.
2. Do NOT invent specific quantitative metrics (e.g. "increased revenue by $4.2M"). If a metric would strengthen the point, use a placeholder such as "[add verified metric, e.g. % or latency]".
3. Focus on:
   - Strong action verbs (e.g. Architected, Streamlined, Spearheaded, Accelerated).
   - Better readability and active voice.
   - Alignment with keywords and responsibilities mentioned in the target job description.

RESUME CONTENT:
```
{resume_text}
```

TARGET JOB DESCRIPTION:
```
{job_description}
```

SECTION FILTER: {section_filter}

Respond strictly with a JSON object:
{{
  "improvements": [
    {{
      "section": "Experience" or "Summary" or "Projects",
      "original_text": "Exact or near-exact original phrase/sentence",
      "suggested_text": "Improved, punchy, truthful alternative",
      "reason": "Why this improvement strengthens the application",
      "supporting_evidence": "Target role requirement or skill this aligns with",
      "requires_user_confirmation": true
    }}
  ]
}}
"""


async def generate_resume_improvements(
    resume_text: str,
    job_description: str,
    section: Optional[str] = None,
) -> List[ResumeSuggestion]:
    """Generate truthful bullet point improvements."""
    sec_filter = section if section else "All applicable sections (Experience, Projects, Summary)"
    prompt = PROMPT_TEMPLATE.format(
        resume_text=resume_text[:6000],
        job_description=job_description[:4000],
        section_filter=sec_filter,
    )

    loop = asyncio.get_event_loop()
    raw = await loop.run_in_executor(None, call_ai, prompt)

    improvements_raw = []
    if isinstance(raw, dict):
        improvements_raw = raw.get("improvements") or raw.get("resume_improvements") or []
    elif isinstance(raw, list):
        improvements_raw = raw

    results: List[ResumeSuggestion] = []
    for item in improvements_raw:
        if isinstance(item, dict):
            try:
                results.append(ResumeSuggestion(
                    section=str(item.get("section", "Experience")),
                    original_text=str(item.get("original_text", "")),
                    suggested_text=str(item.get("suggested_text", "")),
                    reason=str(item.get("reason", "Enhance impact and clarity")),
                    supporting_evidence=item.get("supporting_evidence"),
                    requires_user_confirmation=bool(item.get("requires_user_confirmation", True)),
                ))
            except Exception as e:
                logger.debug("Skipping invalid suggestion item: %s", e)

    return results
