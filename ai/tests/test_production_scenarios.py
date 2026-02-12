"""
Production Scenario Tests

Tests realistic production scenarios and workflows
"""
import pytest
from httpx import AsyncClient
from src.main import app


class TestProductionWorkflows:
    """Test complete production workflows."""
    
    @pytest.mark.asyncio
    async def test_full_cv_processing_workflow(self):
        """Test complete CV processing workflow."""
        cv_text = """
        JOHN DOE
        Senior Full-Stack Developer
        
        Contact:
        Email: john.doe@email.com
        Phone: +1 (555) 123-4567
        LinkedIn: linkedin.com/in/johndoe
        GitHub: github.com/johndoe
        
        PROFESSIONAL SUMMARY
        Experienced full-stack developer with 8+ years building scalable web applications.
        Expert in React, Node.js, Python, and cloud infrastructure (AWS, Azure).
        
        TECHNICAL SKILLS
        Languages: JavaScript, TypeScript, Python, Java, SQL
        Frontend: React, Next.js, Vue.js, HTML5, CSS3, TailwindCSS
        Backend: Node.js, Express, FastAPI, Django, REST APIs, GraphQL
        Databases: PostgreSQL, MongoDB, Redis, MySQL
        Cloud: AWS (EC2, S3, Lambda), Azure, Docker, Kubernetes
        Tools: Git, CI/CD, Jest, Pytest, Webpack
        
        WORK EXPERIENCE
        
        Senior Full-Stack Developer | Tech Innovations Inc. | 2020 - Present
        • Led development of microservices architecture serving 1M+ users
        • Reduced API response time by 60% through optimization and caching
        • Mentored team of 5 junior developers
        • Technologies: React, Node.js, PostgreSQL, Docker, AWS
        
        Full-Stack Developer | Digital Solutions Ltd. | 2018 - 2020
        • Developed e-commerce platform processing $5M+ annually
        • Implemented real-time inventory management system
        • Built RESTful APIs consumed by mobile and web clients
        • Technologies: Vue.js, Express, MongoDB, Redis
        
        Software Engineer | StartUp Labs | 2016 - 2018
        • Created MVP products for 10+ startup clients
        • Developed responsive web applications using React
        • Collaborated with designers and product managers
        
        EDUCATION
        
        Bachelor of Science in Computer Science
        Massachusetts Institute of Technology (MIT)
        Graduated: 2016, GPA: 3.8/4.0
        
        CERTIFICATIONS
        • AWS Certified Solutions Architect - Associate (2022)
        • Google Cloud Professional Developer (2021)
        • Microsoft Azure Developer Associate (2020)
        
        NOTABLE PROJECTS
        
        E-Commerce Platform (2021)
        • Built full-stack e-commerce solution with payment integration
        • Technologies: Next.js, Stripe, PostgreSQL, Vercel
        • URL: https://github.com/johndoe/ecommerce
        
        Real-Time Chat Application (2020)
        • Developed WebSocket-based chat with file sharing
        • Technologies: React, Socket.io, Node.js, MongoDB
        
        LANGUAGES
        English (Native), Spanish (Fluent), French (Conversational)
        """
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            # Step 1: Parse CV
            response = await client.post(
                "/ai/cv/parse-text",
                json={"text": cv_text},
                timeout=60.0
            )
            assert response.status_code == 200
            cv_data = response.json()
            assert cv_data["success"] is True
            assert "data" in cv_data
            
            parsed = cv_data["data"]
            assert parsed["personal_info"]["name"]
            assert parsed["personal_info"]["email"]
            assert len(parsed["skills"]) > 0
            assert len(parsed["work_experience"]) > 0
            assert len(parsed["education"]) > 0
    
    @pytest.mark.asyncio
    async def test_job_matching_workflow(self):
        """Test job matching workflow."""
        talent_profile = {
            "name": "John Doe",
            "skills": ["Python", "FastAPI", "React", "PostgreSQL"],
            "experience_years": 5,
            "education": "BS Computer Science"
        }
        
        job_details = {
            "title": "Senior Backend Engineer",
            "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
            "experience_required": "5+ years",
            "description": "Looking for experienced backend engineer"
        }
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/job/match",
                json={
                    "talent_profile": talent_profile,
                    "job_details": job_details
                },
                timeout=60.0
            )
            assert response.status_code == 200
            data = response.json()
            assert "fit_score" in data or "data" in data
    
    @pytest.mark.asyncio
    async def test_screening_workflow(self):
        """Test candidate screening workflow."""
        cv_data = {
            "personal_info": {"name": "Jane Smith", "email": "jane@example.com"},
            "skills": ["Java", "Spring Boot", "Kubernetes"],
            "work_experience": [
                {
                    "company": "Tech Corp",
                    "role": "Software Engineer",
                    "start_date": "2020",
                    "end_date": "2024"
                }
            ],
            "education": [
                {
                    "institution": "Stanford",
                    "degree": "MS",
                    "field_of_study": "Computer Science"
                }
            ]
        }
        
        criteria = {
            "minimum_education": "BS",
            "minimum_experience_years": 3,
            "required_skills": ["Java", "Spring Boot"],
            "preferred_skills": ["Kubernetes", "AWS"]
        }
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/screening/score",
                json={
                    "cv_data": cv_data,
                    "criteria": criteria
                },
                timeout=60.0
            )
            assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_cover_letter_generation_workflow(self):
        """Test cover letter generation workflow."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/cover-letter/generate",
                json={
                    "job_title": "Senior Software Engineer",
                    "company_name": "TechCorp Inc.",
                    "job_description": "We are looking for an experienced software engineer...",
                    "candidate_info": {
                        "name": "John Doe",
                        "experience": "8 years in full-stack development",
                        "key_skills": ["React", "Node.js", "AWS"]
                    }
                },
                timeout=60.0
            )
            assert response.status_code == 200
            data = response.json()
            assert "cover_letter_text" in data or "data" in data
    
    @pytest.mark.asyncio
    async def test_profile_enhancement_workflow(self):
        """Test profile enhancement suggestions workflow."""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/api/profile/enhance",
                json={
                    "cv_text": "John Doe, developer with Python experience",
                    "metadata": {"years_experience": 3}
                },
                timeout=60.0
            )
            assert response.status_code == 200


class TestRealisticCVExamples:
    """Test with realistic CV examples from different industries."""
    
    @pytest.mark.asyncio
    async def test_recent_graduate_cv(self):
        """Test CV of a recent graduate with minimal experience."""
        cv_text = """
        SARAH JOHNSON
        sjohnson@university.edu | (555) 987-6543
        
        EDUCATION
        B.S. Computer Science, Expected May 2024
        State University, GPA: 3.7/4.0
        
        Relevant Coursework: Data Structures, Algorithms, Web Development
        
        INTERNSHIP
        Software Engineering Intern | StartUp Co. | Summer 2023
        - Developed features for mobile app using React Native
        - Participated in agile development process
        
        PROJECTS
        Personal Portfolio Website
        - Built using Next.js and deployed on Vercel
        
        SKILLS
        Python, JavaScript, React, Git
        """
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/ai/cv/parse-text",
                json={"text": cv_text},
                timeout=60.0
            )
            assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_career_switcher_cv(self):
        """Test CV of someone switching careers."""
        cv_text = """
        MICHAEL CHEN
        Former teacher transitioning to tech
        
        Email: mchen@email.com
        
        SUMMARY
        Former high school math teacher with strong analytical skills,
        recently completed coding bootcamp. Passionate about education technology.
        
        TECHNICAL TRAINING
        Full-Stack Web Development Bootcamp | Code Academy | 2024
        - Intensive 12-week program covering HTML, CSS, JavaScript, React, Node.js
        
        PREVIOUS EXPERIENCE
        High School Math Teacher | City School District | 2018-2023
        - Taught Algebra, Geometry, and Calculus
        - Developed educational technology tools for students
        
        SKILLS
        JavaScript, React, Node.js, HTML/CSS, Git
        Problem-solving, Communication, Team collaboration
        """
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/ai/cv/parse-text",
                json={"text": cv_text},
                timeout=60.0
            )
            assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_executive_cv(self):
        """Test CV of senior executive/CTO."""
        cv_text = """
        ROBERT WILLIAMS
        Chief Technology Officer
        
        rwilliams@executive.com | LinkedIn: /in/robertwilliams
        
        EXECUTIVE SUMMARY
        Strategic technology leader with 20+ years driving digital transformation
        for Fortune 500 companies. Proven track record of building and scaling
        engineering organizations.
        
        PROFESSIONAL EXPERIENCE
        
        Chief Technology Officer | Global Enterprise Inc. | 2020 - Present
        - Lead 200+ person engineering organization
        - Oversee $50M+ technology budget
        - Drive cloud migration initiative saving $10M annually
        
        VP of Engineering | Tech Solutions Corp | 2015 - 2020
        - Built engineering team from 20 to 150 people
        - Implemented DevOps culture and CI/CD pipelines
        
        EDUCATION
        MBA, Harvard Business School, 2010
        M.S. Computer Science, Stanford University, 2005
        
        BOARD POSITIONS
        Technical Advisory Board Member, StartUp Accelerator
        """
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/ai/cv/parse-text",
                json={"text": cv_text},
                timeout=60.0
            )
            assert response.status_code == 200


class TestDataScientistCV:
    """Test parsing of data science/ML CVs."""
    
    @pytest.mark.asyncio
    async def test_data_scientist_cv(self):
        """Test CV with ML/AI focus."""
        cv_text = """
        DR. EMILY RODRIGUEZ
        Senior Data Scientist
        
        emily.rodriguez@email.com | GitHub: /emilyrodriguez
        
        SUMMARY
        Ph.D. in Machine Learning with 6+ years applying advanced analytics
        and ML models to solve business problems.
        
        TECHNICAL SKILLS
        Languages: Python, R, SQL, Scala
        ML/DL: TensorFlow, PyTorch, Scikit-learn, XGBoost
        Big Data: Spark, Hadoop, Databricks
        Cloud: AWS (SageMaker, EMR), GCP
        
        EXPERIENCE
        
        Senior Data Scientist | DataTech Corp | 2021 - Present
        - Developed recommendation system increasing revenue by 15%
        - Built NLP models for sentiment analysis
        - Deployed models to production using MLOps practices
        
        Data Scientist | Analytics Firm | 2018 - 2021
        - Created predictive models for customer churn
        - Performed A/B testing and statistical analysis
        
        EDUCATION
        Ph.D. Machine Learning, Carnegie Mellon University, 2018
        B.S. Mathematics, UC Berkeley, 2013
        
        PUBLICATIONS
        - "Deep Learning for Time Series Forecasting" (2022)
        - "Interpretable ML in Production" (2021)
        """
        
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post(
                "/ai/cv/parse-text",
                json={"text": cv_text},
                timeout=60.0
            )
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
