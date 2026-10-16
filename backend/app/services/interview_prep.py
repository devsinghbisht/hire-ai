"""Interview preparation service."""
from typing import Any, List
from app.schemas.analysis import InterviewQuestion


def parse_interview_questions(raw_questions: List[Any]) -> List[InterviewQuestion]:
    """Parse and validate interview questions from AI output."""
    questions: List[InterviewQuestion] = []
    for item in raw_questions:
        if isinstance(item, dict):
            try:
                pts = item.get("answer_points", [])
                answer_points = [str(p) for p in pts] if isinstance(pts, list) else []
                questions.append(InterviewQuestion(
                    question=str(item.get("question", "")),
                    category=str(item.get("category", "technical")),
                    difficulty=str(item.get("difficulty", "medium")),
                    reason=str(item.get("reason", "Assesses candidate alignment with role requirements")),
                    answer_points=answer_points,
                    follow_up_question=item.get("follow_up_question"),
                ))
            except Exception:
                pass
    return questions
