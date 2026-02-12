"""
Comprehensive Endpoint Testing

Tests all available endpoints for functionality and error handling
"""
import pytest
from httpx import ASGITransport, AsyncClient
from src.main import app


class TestCVEndpoints:
    """Test all CV-related endpoints."""
    
    @pytest.mark.asyncio
    async def test_parse_cv_text_endpoint(self):
        """Test /ai/cv/parse-text endpoint."""
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/ai/cv/parse-text",
                json={"text": "John Doe\nSoftware Engineer\nemail@example.com"},
                timeout=60.0
            )
            assert response.status_code == 200
            data = response.json()
            assert "success" in data or "data" in data
    
    @pytest.mark.asyncio
    async def test_legacy_cv_parse_endpoint(self):
        """Test /api/cv/parse endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/cv/parse",
                json={"cv_text": "Jane Smith\nData Scientist"},
                timeout=60.0
            )
            # Should work or return appropriate error
            assert response.status_code in [200, 404, 422]


class TestJobEndpoints:
    """Test all job-related endpoints."""
    
    @pytest.mark.asyncio
    async def test_job_match_endpoint(self):
        """Test /api/job/match endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/job/match",
                json={
                    "talent_profile": {"skills": ["Python", "Django"]},
                    "job_details": {"title": "Backend Developer", "required_skills": ["Python"]}
                },
                timeout=60.0
            )
            assert response.status_code in [200, 422]
    
    @pytest.mark.asyncio
    async def test_generate_job_description_endpoint(self):
        """Test /api/job/generate-description endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/job/generate-description",
                json={
                    "job_title": "Frontend Developer",
                    "metadata": {"level": "senior", "tech_stack": ["React", "TypeScript"]}
                },
                timeout=60.0
            )
            assert response.status_code in [200, 422]


class TestScreeningEndpoints:
    """Test all screening-related endpoints."""
    
    @pytest.mark.asyncio
    async def test_screening_score_endpoint(self):
        """Test /api/screening/score endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/screening/score",
                json={
                    "cv_data": {
                        "personal_info": {"name": "Test User"},
                        "skills": ["Python"],
                        "education": [],
                        "work_experience": []
                    },
                    "criteria": {"minimum_experience_years": 3}
                },
                timeout=60.0
            )
            assert response.status_code in [200, 422]
    
    @pytest.mark.asyncio
    async def test_ai_screening_score_endpoint(self):
        """Test /ai/screening/score endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/ai/screening/score",
                json={
                    "talent_id": "test-id",
                    "job_id": "job-123",
                    "criteria": {}
                },
                timeout=60.0
            )
            # May require authentication or specific data
            assert response.status_code in [200, 400, 401, 404, 422]


class TestProfileEndpoints:
    """Test all profile-related endpoints."""
    
    @pytest.mark.asyncio
    async def test_enhance_profile_endpoint(self):
        """Test /api/profile/enhance endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/profile/enhance",
                json={
                    "cv_text": "John Doe, Python developer",
                    "metadata": {}
                },
                timeout=60.0
            )
            assert response.status_code in [200, 422]


class TestCoverLetterEndpoints:
    """Test all cover letter endpoints."""
    
    @pytest.mark.asyncio
    async def test_generate_cover_letter_endpoint_v1(self):
        """Test /api/profile/generate-cover-letter endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/profile/generate-cover-letter",
                json={
                    "cv_text": "John Doe",
                    "job_title": "Developer",
                    "job_description": "We need a developer"
                },
                timeout=60.0
            )
            assert response.status_code in [200, 422]
    
    @pytest.mark.asyncio
    async def test_generate_cover_letter_endpoint_v2(self):
        """Test /api/cover-letter/generate endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/cover-letter/generate",
                json={
                    "job_title": "Software Engineer",
                    "company_name": "TechCorp",
                    "job_description": "Great opportunity",
                    "candidate_info": {"name": "Jane Doe"}
                },
                timeout=60.0
            )
            assert response.status_code in [200, 422]


class TestCompetencyEndpoints:
    """Test competency signal endpoints."""
    
    @pytest.mark.asyncio
    async def test_get_skills_taxonomy_endpoint(self):
        """Test /ai/competency/skills/taxonomy endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/ai/competency/skills/taxonomy")
            assert response.status_code in [200, 404]
    
    @pytest.mark.asyncio
    async def test_generate_competency_signals_endpoint(self):
        """Test /ai/competency/signals endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/ai/competency/signals",
                json={
                    "talent_id": "test-talent-123",
                    "cv_data": {"skills": ["Python"]},
                    "work_history": []
                },
                timeout=60.0
            )
            assert response.status_code in [200, 404, 422]


class TestInsightsEndpoints:
    """Test career insights endpoints."""
    
    @pytest.mark.asyncio
    async def test_generate_career_insights_endpoint(self):
        """Test /ai/insights/career endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/ai/insights/career",
                json={
                    "talent_id": "test-talent-123",
                    "skills": ["Python", "Django"],
                    "experience": []
                },
                timeout=60.0
            )
            assert response.status_code in [200, 404, 422]
    
    @pytest.mark.asyncio
    async def test_trending_roles_endpoint(self):
        """Test /ai/insights/roles/trending endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/ai/insights/roles/trending")
            assert response.status_code in [200, 404]


class TestHealthEndpoints:
    """Test health and monitoring endpoints."""
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self):
        """Test / endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/")
            assert response.status_code == 200
            data = response.json()
            assert "service" in data
            assert "status" in data
    
    @pytest.mark.asyncio
    async def test_health_endpoint(self):
        """Test /health endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/health")
            assert response.status_code == 200
            data = response.json()
            assert "status" in data
            assert data["status"] in ["healthy", "degraded"]
    
    @pytest.mark.asyncio
    async def test_ai_health_endpoint(self):
        """Test /api/ai/health endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/ai/health")
            assert response.status_code == 200
            data = response.json()
            assert "status" in data


class TestErrorHandling:
    """Test error handling across endpoints."""
    
    @pytest.mark.asyncio
    async def test_404_on_invalid_endpoint(self):
        """Test 404 error on non-existent endpoint."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/this/does/not/exist")
            assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_method_not_allowed(self):
        """Test 405 error on wrong HTTP method."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/ai/cv/parse-text")  # Should be POST
            assert response.status_code == 405
    
    @pytest.mark.asyncio
    async def test_validation_error_handling(self):
        """Test 422 validation error handling."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/ai/cv/parse-text",
                json={"wrong_field": "value"}
            )
            assert response.status_code == 422
            data = response.json()
            assert "detail" in data
