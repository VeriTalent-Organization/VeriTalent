# =============================================================================
# VeriTalent AI Microservice - Production Docker Image
# =============================================================================
# Multi-stage build for optimized production image

# Stage 1: Builder
FROM python:3.11-slim as builder

# Set working directory
WORKDIR /app

# Install system dependencies required for building Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install UV package manager
RUN pip install --no-cache-dir uv

# Copy dependency files
COPY ai/pyproject.toml ai/uv.lock* ./

# Install Python dependencies using UV
RUN uv pip install --system --no-cache -r pyproject.toml


# Stage 2: Runtime
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY ai/src/ ./src/
COPY ai/data/ ./data/
COPY ai/demo_script.py ./
COPY ai/start.fish ./
COPY ai/run_demo.fish ./

# Create necessary directories
RUN mkdir -p /app/data/chroma /app/logs

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    AI_API_HOST=0.0.0.0 \
    AI_API_PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
