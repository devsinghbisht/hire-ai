"""Roadmap generation service."""
from typing import Any, Dict, List
from app.schemas.analysis import RoadmapItem


def parse_roadmap_items(raw_items: List[Any]) -> List[RoadmapItem]:
    """Parse and validate roadmap items from AI output."""
    items: List[RoadmapItem] = []
    for item in raw_items:
        if isinstance(item, dict):
            try:
                items.append(RoadmapItem(
                    skill=str(item.get("skill", "Core Competency")),
                    objective=str(item.get("objective", "Develop foundational knowledge")),
                    practice_task=str(item.get("practice_task", "Review official documentation and tutorials")),
                    project_idea=str(item.get("project_idea", "Build a minimal demo project")),
                    estimated_effort=str(item.get("estimated_effort", "4-6 hours")),
                    completion_criteria=str(item.get("completion_criteria", "Functional code repository with tests")),
                ))
            except Exception:
                pass
    return items
