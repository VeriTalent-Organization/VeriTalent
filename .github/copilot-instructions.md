# VeriTalent AI - Python Coding Guidelines

## Overview
The `ai/` folder contains the AI/ML layer for VeriTalent, built with Python. This module handles CV parsing, competency signal generation, fit scoring, and the LPI (Learning & Performance Intelligence) agent.

## Environment
- **Shell**: Fish (no bash heredocs, no bash-specific syntax)
- **Package Manager**: UV (not pip, not poetry)
- **Python Version**: 3.11+
- **AI Integration**: Pure manual LLM calls (no LangChain, no LlamaIndex, no external AI frameworks)

## Architecture
- **Framework**: FastAPI for REST API endpoints
- **LLM**: Direct OpenAI API calls (or compatible API)
- **Vector DB**: ChromaDB for embeddings storage
- **Data Validation**: Pydantic v2 models
- **HTTP Client**: httpx for async requests

## Project Structure
```
ai/
├── src/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings (pydantic-settings)
│   ├── api/
│   │   ├── routes/          # API endpoint handlers
│   │   └── dependencies.py  # FastAPI dependencies
│   ├── core/                # AI engines
│   │   ├── cv_parser/       # CV parsing logic
│   │   ├── competency/      # Competency signal generation
│   │   ├── fit_scoring/     # Candidate-job fit scoring
│   │   ├── lpi/             # LPI agent services
│   │   └── insights/        # Career recommendations
│   ├── models/              # Pydantic data models
│   ├── services/            # External service integrations
│   └── utils/               # Utilities
├── tests/                   # Test suite (pytest)
├── docs/                    # Documentation
└── pyproject.toml          # UV project config
```

## Development Workflow (Fish Shell + UV)

### Initial Setup
```fish
cd ai
uv venv
source .venv/bin/activate.fish
uv pip install -r requirements.txt
cp .env.example .env
```

### Add Dependencies
```fish
uv add fastapi uvicorn pydantic
uv add --dev pytest pytest-asyncio black ruff
```

### Run Development Server
```fish
uv run uvicorn src.main:app --reload --port 8080
```

### Run Tests
```fish
uv run pytest tests/ -v --cov=src
```

### Code Formatting
```fish
uv run black src/ tests/
uv run ruff check src/ tests/ --fix
```

### Type Checking
```fish
uv run mypy src/
```

### Sync Dependencies
```fish
uv sync
```

## Shell Guidelines (Fish)

### DO use fish syntax:
```fish
# Variables
set MY_VAR "value"
set -x EXPORT_VAR "exported"

# Conditionals
if test -f .env
    echo "Found .env"
end

# Loops
for file in *.py
    echo $file
end

# Command substitution
set result (uv run python --version)
```

### DO NOT use bash syntax:
```fish
# WRONG - bash heredocs
cat << EOF
content
EOF

# WRONG - bash export
export VAR="value"

# WRONG - bash conditionals
if [ -f .env ]; then
    echo "Found"
fi
```

## LLM Integration (Pure Manual - No Frameworks)

### Direct OpenAI API Calls
```python
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def extract_cv_data(text: str) -> dict:
    """Direct API call - no LangChain, no abstractions."""
    response = await client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},
        temperature=0.1,
    )
    return json.loads(response.choices[0].message.content)
```

### DO NOT use:
```python
# WRONG - No LangChain
from langchain.llms import OpenAI
from langchain.chains import LLMChain

# WRONG - No LlamaIndex
from llama_index import VectorStoreIndex

# WRONG - No other AI frameworks
from haystack import Pipeline
```

### Embeddings (Direct API)
```python
async def generate_embedding(text: str) -> list[float]:
    """Direct embedding call."""
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return response.data[0].embedding
```

### Vector Storage (ChromaDB Direct)
```python
import chromadb

client = chromadb.PersistentClient(path="./data/chroma")
collection = client.get_or_create_collection("cv_embeddings")

# Store
collection.add(
    ids=["cv-001"],
    embeddings=[embedding],
    metadatas=[{"talent_id": "VT/001"}],
    documents=[cv_text],
)

# Search
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=10,
)
```

## Code Style Guidelines

### Python Version
- Use Python 3.11+ features
- Type hints are **required** for all functions

### Imports
```python
# Standard library first
from datetime import datetime
from typing import Optional

# Third-party packages
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from openai import AsyncOpenAI

# Local imports (absolute)
from src.models.cv import ParsedCV
from src.services.llm_service import LLMService
```

### Function Signatures
```python
async def parse_cv(
    content: bytes,
    filename: str,
    content_type: str,
) -> ParsedCV:
    """
    Parse a CV document and extract structured data.
    
    Args:
        content: Raw file content as bytes
        filename: Original filename
        content_type: MIME type of the file
        
    Returns:
        ParsedCV with extracted information
        
    Raises:
        ValueError: If file type is unsupported
    """
    ...
```

### Pydantic Models
```python
from pydantic import BaseModel, Field

class CompetencySignal(BaseModel):
    """Individual competency signal."""
    
    skill: str
    score: int = Field(..., ge=0, le=100, description="Score 0-100")
    level: str = Field(..., description="Beginner/Intermediate/Advanced")
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    
    model_config = {"extra": "forbid"}
```

### Error Handling
```python
from fastapi import HTTPException, status

async def get_talent(talent_id: str) -> TalentProfile:
    try:
        talent = await talent_service.get(talent_id)
        if not talent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Talent not found: {talent_id}"
            )
        return talent
    except DatabaseError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred"
        )
```

### Async/Await
- Use `async def` for all I/O operations
- Use `await` for async calls
- Use `httpx` for HTTP requests (not `requests`)

```python
import httpx

# Good - async http client
async with httpx.AsyncClient() as client:
    response = await client.get(url)

# Bad - blocking call
import requests
response = requests.get(url)  # Blocks event loop!
```

### Logging
```python
import logging

logger = logging.getLogger(__name__)

async def process_cv(cv_id: str):
    logger.info(f"Processing CV: {cv_id}")
    try:
        result = await parse_cv(cv_id)
        logger.info(f"CV processed successfully: {cv_id}")
        return result
    except Exception as e:
        logger.error(f"Failed to process CV {cv_id}: {e}", exc_info=True)
        raise
```

## Prompt Engineering

### Store prompts as constants
```python
# src/prompts/cv_parser.py
CV_PARSER_SYSTEM_PROMPT = """You are an expert CV parser.
Extract structured information from the CV text.

Output JSON with these exact fields:
- personal_info: {name, email, phone, location}
- skills: [skill names as strings]
- education: [{institution, degree, field}]
- work_experience: [{company, role, responsibilities}]

Rules:
1. Only include information present in the text
2. Use null for missing fields
3. Standardize date formats to YYYY-MM-DD"""

PROMPT_VERSION = "cv_parser_v1.0"
```

### Validate LLM outputs
```python
def validate_cv_output(data: dict) -> bool:
    """Validate LLM response structure."""
    required = ["personal_info", "skills"]
    return all(field in data for field in required)

# Always wrap LLM calls with validation
try:
    result = json.loads(llm_response)
    if not validate_cv_output(result):
        raise ValueError("Invalid structure")
except (json.JSONDecodeError, ValueError):
    return default_structure()
```

## Testing

### Test Structure
```python
import pytest
from src.core.cv_parser.parser import CVParserService

class TestCVParser:
    @pytest.fixture
    def parser(self):
        return CVParserService()

    @pytest.mark.asyncio
    async def test_parse_simple_cv(self, parser):
        result = await parser.parse_text("John Doe\nSoftware Engineer")
        assert result.personal_info.name == "John Doe"
```

### Run specific tests
```fish
uv run pytest tests/test_cv_parser.py -v
uv run pytest tests/ -k "test_parse" -v
```

## Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...

# Optional with defaults
OPENAI_MODEL=gpt-4-turbo-preview
AI_API_PORT=8080
LOG_LEVEL=INFO

# Vector DB
CHROMA_PERSIST_DIR=./data/chroma
```

## Security

- Never log full CV content (PII)
- Sanitize file uploads
- Validate file types and sizes
- Never commit .env files

## Project Commands Summary (Fish + UV)

```fish
# Setup
uv venv && source .venv/bin/activate.fish && uv sync

# Run
uv run uvicorn src.main:app --reload --port 8080

# Test
uv run pytest tests/ -v

# Lint
uv run ruff check src/ --fix

# Format
uv run black src/ tests/

# Type check
uv run mypy src/
```

---

*This file is referenced by GitHub Copilot for AI/Python code assistance.*
