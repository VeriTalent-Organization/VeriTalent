"""
CV Parser Tests
"""
import pytest
from src.core.cv_parser.extractors import (
    extract_personal_info,
    extract_education,
    extract_work_experience,
    extract_skills,
)
from src.core.cv_parser.normalizers import (
    normalize_skills,
    parse_date,
    calculate_experience_years,
)


class TestExtractors:
    """Tests for CV data extractors."""

    def test_extract_personal_info_complete(self):
        """Test extracting complete personal info."""
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "location": "Lagos, Nigeria",
            "linkedin": "linkedin.com/in/johndoe",
        }
        
        result = extract_personal_info(data)
        
        assert result.name == "John Doe"
        assert result.email == "john@example.com"
        assert result.location == "Lagos, Nigeria"

    def test_extract_personal_info_minimal(self):
        """Test extracting minimal personal info."""
        data = {"name": "Jane Doe"}
        
        result = extract_personal_info(data)
        
        assert result.name == "Jane Doe"
        assert result.email is None
        assert result.phone is None

    def test_extract_education(self):
        """Test extracting education entries."""
        data = [
            {
                "institution": "University of Lagos",
                "degree": "BSc",
                "field_of_study": "Computer Science",
            },
        ]
        
        result = extract_education(data)
        
        assert len(result) == 1
        assert result[0].institution == "University of Lagos"
        assert result[0].degree == "BSc"

    def test_extract_work_experience(self):
        """Test extracting work experience."""
        data = [
            {
                "company": "TechCorp",
                "role": "Software Engineer",
                "responsibilities": ["Developed APIs", "Wrote tests"],
            },
        ]
        
        result = extract_work_experience(data)
        
        assert len(result) == 1
        assert result[0].company == "TechCorp"
        assert result[0].role == "Software Engineer"
        assert len(result[0].responsibilities) == 2

    def test_extract_skills_strings(self):
        """Test extracting skills from strings."""
        data = ["Python", "JavaScript", "SQL"]
        
        result = extract_skills(data)
        
        assert result == ["Python", "JavaScript", "SQL"]

    def test_extract_skills_dicts(self):
        """Test extracting skills from dictionaries."""
        data = [
            {"name": "Python", "level": "advanced"},
            {"skill": "JavaScript"},
        ]
        
        result = extract_skills(data)
        
        assert "Python" in result
        assert "JavaScript" in result


class TestNormalizers:
    """Tests for CV data normalizers."""

    def test_normalize_skills_removes_duplicates(self):
        """Test that duplicate skills are removed."""
        skills = ["Python", "python", "PYTHON", "JavaScript"]
        
        result = normalize_skills(skills)
        
        assert len(result) == 2
        assert "Python" in result
        assert "Javascript" in result

    def test_normalize_skills_removes_empty(self):
        """Test that empty skills are removed."""
        skills = ["Python", "", "  ", "JavaScript"]
        
        result = normalize_skills(skills)
        
        assert len(result) == 2
        assert "" not in result

    def test_parse_date_various_formats(self):
        """Test parsing various date formats."""
        assert parse_date("2023-01-15").year == 2023
        assert parse_date("January 2023").month == 1
        assert parse_date("Jan 2023").month == 1
        assert parse_date("2023").year == 2023

    def test_parse_date_invalid(self):
        """Test parsing invalid date returns None."""
        assert parse_date("") is None
        assert parse_date("invalid") is None
