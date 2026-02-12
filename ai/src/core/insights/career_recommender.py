"""
Career Recommender

Generates career insights and recommendations for talents.
"""
from typing import Optional

from src.models.talent import CareerInsight, GrowthRecommendation
from src.services.llm_service import LLMService


class CareerRecommender:
    """Service for generating career recommendations."""

    def __init__(self):
        self.llm_service = LLMService()
        # In-memory storage for demo
        self._insights = {}

    async def generate(
        self,
        talent_id: str,
        competency_signals: list[dict] = None,
        career_history: list[dict] = None,
    ) -> CareerInsight:
        """
        Generate career insights for a talent.
        
        Args:
            talent_id: Unique identifier for the talent
            competency_signals: List of competency signal data
            career_history: List of work experience data
            
        Returns:
            CareerInsight with suggestions and recommendations
        """
        competency_signals = competency_signals or []
        career_history = career_history or []
        
        # Extract top skills
        top_skills = [
            s.get("skill") for s in competency_signals
            if s.get("score", 0) >= 60
        ]
        
        # Determine suggested roles based on skills
        suggested_roles = self._match_roles_to_skills(top_skills)
        
        # Identify growth areas
        growth_areas = [
            s.get("skill") for s in competency_signals
            if 30 <= s.get("score", 0) < 60
        ]
        
        # Identify skill gaps
        skill_gaps = self._identify_skill_gaps(top_skills, suggested_roles)
        
        # Calculate market readiness
        market_readiness = self._calculate_market_readiness(
            competency_signals, career_history
        )
        
        insight = CareerInsight(
            suggested_roles=suggested_roles[:5],
            growth_areas=growth_areas[:5],
            market_readiness=market_readiness,
            skill_gaps=skill_gaps[:5],
            career_trajectory=self._determine_trajectory(career_history),
        )
        
        # Store for retrieval
        self._insights[talent_id] = insight
        
        return insight

    def _match_roles_to_skills(self, skills: list[str]) -> list[str]:
        """Match skills to potential job roles."""
        # Simple skill-to-role mapping
        role_skills = {
            "Software Engineer": ["Python", "JavaScript", "Java", "C++", "Git"],
            "Data Analyst": ["Python", "SQL", "Excel", "Data Analysis", "Statistics"],
            "Data Scientist": ["Python", "Machine Learning", "Statistics", "SQL", "R"],
            "Marketing Manager": ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
            "Product Manager": ["Product Management", "Agile", "Communication", "Analytics"],
            "Frontend Developer": ["JavaScript", "React", "HTML", "CSS", "TypeScript"],
            "Backend Developer": ["Python", "Node.js", "Java", "SQL", "API"],
            "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
            "UX Designer": ["UI/UX", "Figma", "User Research", "Prototyping"],
            "Project Manager": ["Project Management", "Agile", "Communication", "Leadership"],
        }
        
        skills_lower = [s.lower() for s in skills]
        role_scores = {}
        
        for role, required_skills in role_skills.items():
            matches = sum(
                1 for rs in required_skills
                if rs.lower() in skills_lower
            )
            if matches > 0:
                role_scores[role] = matches / len(required_skills)
        
        # Sort by score and return top roles
        sorted_roles = sorted(
            role_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return [role for role, _ in sorted_roles]

    def _identify_skill_gaps(
        self,
        current_skills: list[str],
        suggested_roles: list[str],
    ) -> list[str]:
        """Identify skills needed for suggested roles."""
        role_skills = {
            "Software Engineer": ["Python", "JavaScript", "Git", "Data Structures"],
            "Data Analyst": ["Python", "SQL", "Excel", "Visualization"],
            "Data Scientist": ["Python", "Machine Learning", "Statistics"],
            "Marketing Manager": ["Digital Marketing", "Analytics", "SEO"],
        }
        
        current_lower = [s.lower() for s in current_skills]
        gaps = set()
        
        for role in suggested_roles[:3]:
            if role in role_skills:
                for skill in role_skills[role]:
                    if skill.lower() not in current_lower:
                        gaps.add(skill)
        
        return list(gaps)

    def _calculate_market_readiness(
        self,
        competency_signals: list[dict],
        career_history: list[dict],
    ) -> float:
        """Calculate overall market readiness score."""
        if not competency_signals:
            return 0.3
        
        # Average competency score
        avg_score = sum(
            s.get("score", 0) for s in competency_signals
        ) / len(competency_signals)
        
        # Experience factor
        experience_factor = min(1.0, len(career_history) * 0.2) if career_history else 0.2
        
        # Combined readiness
        readiness = (avg_score / 100) * 0.7 + experience_factor * 0.3
        
        return round(readiness, 2)

    def _determine_trajectory(self, career_history: list[dict]) -> str:
        """Determine career trajectory based on history."""
        if not career_history:
            return "Entry-level - building foundation"
        
        history_length = len(career_history)
        
        if history_length >= 5:
            return "Senior-level - leadership track"
        elif history_length >= 3:
            return "Mid-level - specialization phase"
        elif history_length >= 1:
            return "Early-career - growth phase"
        
        return "Entry-level - exploration phase"

    async def get_stored_insights(self, talent_id: str) -> Optional[CareerInsight]:
        """Retrieve stored insights for a talent."""
        return self._insights.get(talent_id)

    async def get_trending_roles(
        self,
        industry: Optional[str] = None,
        location: Optional[str] = None,
        limit: int = 10,
    ) -> list[dict]:
        """Get trending job roles."""
        # Placeholder data - would be from market data API
        trending = [
            {"role": "AI/ML Engineer", "growth": "+45%", "demand": "Very High"},
            {"role": "Data Engineer", "growth": "+38%", "demand": "High"},
            {"role": "Cloud Architect", "growth": "+35%", "demand": "High"},
            {"role": "Product Manager", "growth": "+28%", "demand": "High"},
            {"role": "DevOps Engineer", "growth": "+25%", "demand": "High"},
            {"role": "Full Stack Developer", "growth": "+22%", "demand": "Medium"},
            {"role": "Cybersecurity Analyst", "growth": "+20%", "demand": "High"},
            {"role": "UX Designer", "growth": "+18%", "demand": "Medium"},
            {"role": "Data Analyst", "growth": "+15%", "demand": "Medium"},
            {"role": "Digital Marketing Manager", "growth": "+12%", "demand": "Medium"},
        ]
        
        return trending[:limit]

    async def get_in_demand_skills(
        self,
        role: Optional[str] = None,
        industry: Optional[str] = None,
        limit: int = 20,
    ) -> list[dict]:
        """Get in-demand skills."""
        # Placeholder data
        skills = [
            {"skill": "Python", "demand": "Very High", "growth": "+30%"},
            {"skill": "Machine Learning", "demand": "Very High", "growth": "+45%"},
            {"skill": "Cloud Computing (AWS/Azure)", "demand": "Very High", "growth": "+35%"},
            {"skill": "Data Analysis", "demand": "High", "growth": "+25%"},
            {"skill": "JavaScript/TypeScript", "demand": "High", "growth": "+20%"},
            {"skill": "SQL", "demand": "High", "growth": "+15%"},
            {"skill": "Docker/Kubernetes", "demand": "High", "growth": "+28%"},
            {"skill": "React/Vue", "demand": "High", "growth": "+22%"},
            {"skill": "API Development", "demand": "Medium", "growth": "+18%"},
            {"skill": "Agile/Scrum", "demand": "Medium", "growth": "+12%"},
        ]
        
        return skills[:limit]

    async def generate_growth_plan(self, talent_id: str) -> dict:
        """Generate a personalized growth plan."""
        insights = self._insights.get(talent_id)
        
        if not insights:
            return {
                "message": "No insights available. Please generate insights first.",
            }
        
        plan = {
            "short_term": [
                {
                    "goal": f"Develop proficiency in {insights.skill_gaps[0]}" if insights.skill_gaps else "Build core skills",
                    "timeline": "1-3 months",
                    "actions": [
                        "Complete online course",
                        "Build a practice project",
                        "Join relevant community",
                    ],
                },
            ],
            "medium_term": [
                {
                    "goal": f"Target role: {insights.suggested_roles[0]}" if insights.suggested_roles else "Define career path",
                    "timeline": "3-6 months",
                    "actions": [
                        "Apply to relevant positions",
                        "Build portfolio projects",
                        "Network with professionals",
                    ],
                },
            ],
            "long_term": [
                {
                    "goal": "Establish as industry expert",
                    "timeline": "6-12 months",
                    "actions": [
                        "Contribute to open source",
                        "Write technical content",
                        "Mentor others",
                    ],
                },
            ],
        }
        
        return plan
