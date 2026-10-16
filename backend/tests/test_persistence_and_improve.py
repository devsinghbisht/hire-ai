"""Tests for resume improvement and token-authenticated report persistence."""
import pytest
from app.schemas.analysis import AnalysisResponse, MatchAnalysis, ATSAnalysis


def test_resume_improve_endpoint(client):
    """Test POST /api/v1/resume-improve."""
    payload = {
        "resume_text": "Experienced Python developer with 3 years building web APIs using FastAPI and PostgreSQL.",
        "job_description": "Looking for a Senior Python backend engineer with FastAPI, Docker, and PostgreSQL experience to architect microservices.",
        "section": "Experience",
    }
    response = client.post("/api/v1/resume-improve", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    item = data[0]
    assert "suggested_text" in item
    assert "original_text" in item
    assert "requires_user_confirmation" in item


def test_save_and_retrieve_analysis(client):
    """Test saving a report, retrieving with token, and rejecting invalid tokens."""
    # Construct a valid AnalysisResponse dict
    sample_analysis = AnalysisResponse(
        analysis_id="test-analysis-1234",
        match_analysis=MatchAnalysis(
            overall_score=85,
            score_label="Strong Evidence Alignment",
            score_explanation="Matches backend requirements well.",
            strengths=["Python proficiency", "REST architecture"],
        ),
        ats_analysis=ATSAnalysis(
            readability_score=90,
            formatting_warnings=[],
        ),
        model_used="gemini-1.5-flash",
    ).model_dump()

    # Save report
    save_res = client.post(
        "/api/v1/analyses",
        json={
            "analysis": sample_analysis,
            "job_title": "Python Developer",
            "company_name": "Acme Corp",
        },
    )
    assert save_res.status_code == 200
    save_body = save_res.json()
    analysis_id = save_body["id"]
    access_token = save_body["access_token"]
    assert analysis_id and access_token

    # Retrieve without token should fail with 401
    get_no_tok = client.get(f"/api/v1/analyses/{analysis_id}")
    assert get_no_tok.status_code == 401

    # Retrieve with bad token should fail with 404
    get_bad_tok = client.get(
        f"/api/v1/analyses/{analysis_id}",
        headers={"X-Access-Token": "invalid_wrong_token"},
    )
    assert get_bad_tok.status_code == 404

    # Retrieve with valid header token should succeed
    get_ok = client.get(
        f"/api/v1/analyses/{analysis_id}",
        headers={"X-Access-Token": access_token},
    )
    assert get_ok.status_code == 200
    retrieved_report = get_ok.json()
    assert retrieved_report["analysis_id"] == "test-analysis-1234"

    # Retrieve with query param token should also succeed
    get_param_ok = client.get(f"/api/v1/analyses/{analysis_id}?token={access_token}")
    assert get_param_ok.status_code == 200

    # Delete with bad token should fail
    del_bad = client.delete(
        f"/api/v1/analyses/{analysis_id}",
        headers={"X-Access-Token": "bad_token"},
    )
    assert del_bad.status_code == 404

    # Delete with valid token should succeed
    del_ok = client.delete(
        f"/api/v1/analyses/{analysis_id}",
        headers={"X-Access-Token": access_token},
    )
    assert del_ok.status_code == 200

    # Subsequent retrieval should now return 404
    get_deleted = client.get(
        f"/api/v1/analyses/{analysis_id}",
        headers={"X-Access-Token": access_token},
    )
    assert get_deleted.status_code == 404
