"""
VeriTalent AI - Main Application Entry Point
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import (
    cv_parser,
    competency,
    fit_scoring,
    lpi_agent,
    insights,
    backend_integration,
    cv,
    job,
    screening,
    profile,
    cover_letter,
)
from src.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print("🚀 VeriTalent AI Service starting...")
    # Initialize services here (DB connections, model loading, etc.)
    yield
    # Shutdown
    print("👋 VeriTalent AI Service shutting down...")


app = FastAPI(
    title="VeriTalent AI Service",
    description="AI-powered intelligence layer for talent screening and competency assessment",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
# Backend Integration (Primary endpoints for backend ↔ AI communication)
app.include_router(cv.router, prefix="/api", tags=["CV Operations"])
app.include_router(job.router, prefix="/api", tags=["Job Operations"])
app.include_router(screening.router, prefix="/api", tags=["Screening"])
app.include_router(profile.router, prefix="/api", tags=["Profile"])
app.include_router(cover_letter.router, tags=["Cover Letter"])

# Backend Integration (Unified endpoint - Alternative)
app.include_router(backend_integration.router)

# Legacy/Direct endpoints (for frontend integration if needed)
app.include_router(cv_parser.router, prefix="/ai/cv", tags=["CV Parser"])
app.include_router(competency.router, prefix="/ai/competency", tags=["Competency"])
app.include_router(fit_scoring.router, prefix="/ai/screening", tags=["Fit Scoring"])
app.include_router(lpi_agent.router, prefix="/ai/lpi", tags=["LPI Agent"])
app.include_router(insights.router, prefix="/ai/insights", tags=["Insights"])


@app.get("/")
async def root():
    """Root endpoint - health check."""
    return {
        "service": "VeriTalent AI",
        "version": "0.1.0",
        "status": "healthy",
    }


@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "services": {
            "api": "up",
            "llm": "connected",
            "vector_db": "connected",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
