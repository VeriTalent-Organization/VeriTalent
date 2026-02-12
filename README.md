# VeriTalent AI Microservice

AI-powered talent verification and competency assessment service built with FastAPI and Azure AI.

## Overview

VeriTalent AI is a microservice that provides intelligent talent assessment capabilities including:
- 📄 **CV Parsing** - Extract structured data from resumes using AI
- 🧠 **Competency Signal Generation** - Multi-source weighted skill validation
- 🎯 **Job Matching** - AI-powered talent-to-job fit scoring
- 📊 **TAPI Intelligence** - Talent Activity & Performance tracking
- ✉️ **Cover Letter Generation** - AI-generated personalized cover letters
- 💼 **Career Insights** - Personalized career development recommendations
- 🔍 **Batch Screening** - Automated candidate assessment at scale

## Quick Start

### Prerequisites

- **Option 1 - Docker (Recommended for Production)**
  - Docker 20.10+
  - Docker Compose 2.0+
  
- **Option 2 - Local Development**
  - Python 3.11+
  - UV package manager

- **Required for Both**
  - Azure AI API key (Grok model via Azure OpenAI-compatible endpoint)
  - Azure Cosmos DB connection string (MongoDB vCore)

### Option 1: Docker Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/VeriTalent-Organization/VeriTalent.git
cd VeriTalent

# Configure environment (edit .env.local with your credentials)
# This file is already present in the root directory
nano .env.local

# Build and run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f veritalent-ai

# Visit API docs
open http://localhost:8080/docs
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide.

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/VeriTalent-Organization/VeriTalent.git
cd VeriTalent/ai

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate.fish  # or activate.bat on Windows
uv sync

# The service uses .env.local from the project root
# Ensure .env.local is properly configured (see Environment Configuration below)

# Start the service
./start.fish

# Or manually
uv run uvicorn src.main:app --reload --port 8080
```

The service will be available at `http://localhost:8080`

### Run Demo

```bash
# Run comprehensive demo
./run_demo.fish

# Or manually
uv run python demo_script.py
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8080/docs`
- ReDoc: `http://localhost:8080/redoc`
- Health Check: `http://localhost:8080/health`

## Project Structure

```
ai/
├── src/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── api/
│   │   └── routes/          # API endpoint definitions
│   ├── core/                # Core AI business logic
│   │   ├── cv_parser/       # CV parsing engine
│   │   ├── competency/      # Competency signal generation
│   │   ├── fit_scoring/     # Job matching algorithms
│   │   ├── lpi/             # TAPI/LPI processing
│   │   └── insights/        # Career insights generation
│   ├── models/              # Pydantic data models
│   ├── services/            # External service integrations
│   └── utils/               # Utility functions
├── tests/                   # Test suite
├── demo_script.py           # Comprehensive demo
├── start.fish               # Service startup script
└── run_demo.fish            # Demo runner script
```

## Key Features

### Multi-Source Competency Signals

Uses weighted validation across 6 sources:
- CV / Profile Analysis (15%)
- Professional Recommendations (15%)
- Verified Certifications (20%)
- TAPI Intelligence (20%)
- Work Experience References (20%)
- Base Signal Mark (10%)

Signal levels: Poor (0-30) | Low (31-50) | Good (51-60) | Very Good (61-75) | Excellent (76-100)

### Backend Integration

Direct API integration with VeriTalent backend - no frontend dependencies.

## Environment Configuration

### Environment File Location

**⚠️ IMPORTANT:** This project uses `.env.local` in the **project root** (not in the `ai/` directory).

```
VeriTalent/
├── .env.local          ← Main environment file (edit this)
├── ai/
│   ├── .env.example    ← Reference template only (do not edit)
│   └── src/
```

The AI service automatically loads environment variables from `/VeriTalent/.env.local`.

### Required Environment Variables

Edit `.env.local` in the project root with your credentials:

```env
# Azure AI Configuration (REQUIRED)
AZURE_AI_ENDPOINT=https://verdiaq-ai-resource.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview
AZURE_AI_API_KEY=your-azure-api-key-here
AZURE_AI_MODEL=grok-4-fast-reasoning
AZURE_EMBEDDING_MODEL=text-embedding-3-small

# Cosmos DB MongoDB vCore (REQUIRED)
COSMOS_CONNECTION_STRING=mongodb://your-cosmos-connection-string
COSMOS_DATABASE_NAME=veritalent_ai
COSMOS_VECTORS_COLLECTION=embeddings

# API Configuration
AI_API_HOST=0.0.0.0
AI_API_PORT=8080
AI_API_DEBUG=false
AI_API_KEY=your-production-api-key

# Backend Integration
BACKEND_API_URL=https://veritalent-server.onrender.com/v1

# Security
SECRET_KEY=change-this-to-secure-random-string
ALLOWED_ORIGINS=https://veritalent.com,https://app.veritalent.com

# Logging
LOG_LEVEL=INFO

# Limits
MAX_CV_SIZE_MB=10
MAX_TOKENS_PER_REQUEST=4000
```

## Docker Deployment

### Quick Start with Docker

```bash
# Build the image
docker-compose build

# Run the service
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f veritalent-ai

# Stop the service
docker-compose down
```

### Production Docker Commands

```bash
# Build production image
docker build -t veritalent-ai:latest ./ai

# Run container
docker run -d \
  --name veritalent-ai \
  -p 8080:8080 \
  --env-file .env.local \
  -v ai-data:/app/data \
  veritalent-ai:latest

# Health check
curl http://localhost:8080/health
```

### Deploy to Cloud

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:
- Azure Container Instances (ACI)
- AWS ECS
- Google Cloud Run
- Render.com
- Railway.app

## Documentation

- [Deployment Guide](DEPLOYMENT.md) - **Docker & Cloud deployment**
- [Architecture](ai/ARCHITECTURE.md) - System design and components
- [Azure Deployment](ai/AZURE_DEPLOYMENT.md) - Azure-specific deployment
- [Demo Guide](ai/DEMO_GUIDE.md) - Running demos
- [Quick Start](ai/QUICK_START.md) - Getting started
- [Testing Report](ai/TESTING_REPORT.md) - Test results

## Development

### Local Development Setup

```bash
cd VeriTalent/ai

# Install dependencies
uv sync

# Install dev dependencies
uv add --dev pytest pytest-asyncio black ruff mypy

# Run tests
uv run pytest tests/ -v --cov=src

# Format code
uv run black src/ tests/

# Lint code
uv run ruff check src/ --fix

# Type check
uv run mypy src/
```

### Running Tests in Docker

```bash
# Run tests in Docker container
docker-compose exec veritalent-ai pytest tests/ -v

# With coverage
docker-compose exec veritalent-ai pytest tests/ -v --cov=src --cov-report=html
```

## API Endpoints

### Health & Info
- `GET /` - Service info
- `GET /health` - Health check

### Core Endpoints (Backend Integration)
- `POST /api/cv/parse` - Parse CV and extract structured data
- `POST /api/job/match` - Calculate talent-to-job fit score
- `POST /api/cover-letter/generate` - Generate personalized cover letter
- `POST /api/screening/screen` - Screen single candidate
- `POST /api/profile/analyze` - Analyze talent profile

### AI Endpoints (Direct AI Operations)
- `POST /ai/competency/signals` - Generate multi-source competency signals
- `POST /ai/insights/career` - Get personalized career insights
- `POST /ai/lpi/submit` - Submit learning activity for TAPI analysis
- `POST /ai/lpi/reports/{report_id}` - Get LPI report
- `POST /ai/screening/batch-score` - Batch candidate screening

### API Documentation
- Swagger UI: `http://localhost:8080/docs`
- ReDoc: `http://localhost:8080/redoc`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Open an issue on GitHub
- Check documentation in `ai/docs/`
- Review API docs at `/docs` endpoint

---

**Tech Stack:** Python · FastAPI · Azure AI (Grok) · Pydantic · ChromaDB · Uvicorn
