# VeriTalent AI Microservice - Azure Deployment Guide

## Overview

This document provides comprehensive guidance for deploying the VeriTalent AI microservice on Azure and integrating it with Jeffrey's backend system.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Azure Resources Setup](#azure-resources-setup)
3. [Containerization](#containerization)
4. [Deployment Options](#deployment-options)
5. [Environment Configuration](#environment-configuration)
6. [Networking & Communication](#networking--communication)
7. [Security & Authentication](#security--authentication)
8. [Monitoring & Logging](#monitoring--logging)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Scaling & Performance](#scaling--performance)
11. [Cost Optimization](#cost-optimization)
12. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Azure Cloud                            │
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Azure Front     │         │  Azure API       │          │
│  │  Door / CDN      │────────▶│  Management      │          │
│  └──────────────────┘         └──────────────────┘          │
│           │                            │                     │
│           │                            │                     │
│           ▼                            ▼                     │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Jeffrey Backend │         │  VeriTalent AI   │          │
│  │  (App Service)   │◀───────▶│  (Container App) │          │
│  │  Node.js/Java    │         │  FastAPI/Python  │          │
│  └──────────────────┘         └──────────────────┘          │
│           │                            │                     │
│           │                            │                     │
│           ▼                            ▼                     │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Azure SQL       │         │  Azure AI        │          │
│  │  Database        │         │  Service         │          │
│  └──────────────────┘         │  (Grok-4 Model)  │          │
│                                └──────────────────┘          │
│                                         │                    │
│                                         ▼                    │
│                                ┌──────────────────┐          │
│                                │  Azure Blob      │          │
│                                │  Storage (CVs)   │          │
│                                └──────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Communication Flow

1. **Client → Jeffrey Backend**: User uploads CV or requests AI services
2. **Jeffrey Backend → AI Microservice**: RESTful API calls over HTTPS
3. **AI Microservice → Azure AI Service**: Streaming LLM requests
4. **AI Microservice → Jeffrey Backend**: JSON responses with processed data
5. **Jeffrey Backend → Client**: Final results delivered to user

---

## Azure Resources Setup

### Required Azure Services

#### 1. Azure Container Registry (ACR)
- **Purpose**: Store Docker images
- **SKU**: Standard or Premium
- **Name**: `verittalentairegistry.azurecr.io`

```bash
# Create ACR
az acr create \
  --resource-group veritalent-rg \
  --name verittalentairegistry \
  --sku Standard \
  --location eastus
```

#### 2. Azure Container Apps (Recommended)
- **Purpose**: Host AI microservice
- **Why**: Serverless, auto-scaling, cost-effective
- **Environment**: `veritalent-ai-env`

```bash
# Create Container Apps environment
az containerapp env create \
  --name veritalent-ai-env \
  --resource-group veritalent-rg \
  --location eastus
```

#### 3. Azure AI Service (Already Configured)
- **Endpoint**: `https://verdiaq-ai-resource.services.ai.azure.com`
- **Model**: grok-4-fast-reasoning
- **API Key**: Stored in Azure Key Vault (see below)

#### 4. Azure Key Vault
- **Purpose**: Securely store secrets
- **Secrets**:
  - `azure-ai-api-key`
  - `jeffrey-backend-api-key`
  - `openai-api-key` (if using OpenAI as fallback)

```bash
# Create Key Vault
az keyvault create \
  --name veritalent-keyvault \
  --resource-group veritalent-rg \
  --location eastus

# Add secrets
az keyvault secret set \
  --vault-name veritalent-keyvault \
  --name azure-ai-api-key \
  --value "YOUR_AZURE_AI_API_KEY_HERE"
```

#### 5. Azure Blob Storage
- **Purpose**: Store uploaded CVs, generated reports
- **Container**: `cv-uploads`, `processed-cvs`

```bash
# Create storage account
az storage account create \
  --name veritalentstorage \
  --resource-group veritalent-rg \
  --location eastus \
  --sku Standard_LRS

# Create containers
az storage container create --name cv-uploads --account-name veritalentstorage
az storage container create --name processed-cvs --account-name veritalentstorage
```

#### 6. Azure Application Insights
- **Purpose**: Monitoring, logging, telemetry
- **Integration**: FastAPI instrumentation

```bash
# Create Application Insights
az monitor app-insights component create \
  --app veritalent-ai-insights \
  --location eastus \
  --resource-group veritalent-rg \
  --application-type web
```

---

## Containerization

### Dockerfile

Create `/home/tife/VeriTalent/ai/Dockerfile`:

```dockerfile
# Multi-stage build for smaller image size
FROM python:3.12-slim as builder

# Install UV package manager
RUN pip install --no-cache-dir uv

WORKDIR /app

# Copy dependency files
COPY pyproject.toml ./
COPY src ./src

# Install dependencies
RUN uv venv && \
    . .venv/bin/activate && \
    uv sync --no-dev

# Production image
FROM python:3.12-slim

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/src /app/src

# Set environment variables
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import httpx; httpx.get('http://localhost:8080/health')"

# Run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### .dockerignore

Create `/home/tife/VeriTalent/ai/.dockerignore`:

```
.venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.pytest_cache/
.coverage
htmlcov/
.env
.env.local
tests/
docs/
*.md
!README.md
.git/
.gitignore
```

### Build and Push Image

```bash
# Navigate to AI directory
cd /home/tife/VeriTalent/ai

# Build Docker image
docker build -t veritalent-ai:latest .

# Tag for ACR
docker tag veritalent-ai:latest verittalentairegistry.azurecr.io/veritalent-ai:latest

# Login to ACR
az acr login --name verittalentairegistry

# Push to ACR
docker push verittalentairegistry.azurecr.io/veritalent-ai:latest
```

---

## Deployment Options

### Option 1: Azure Container Apps (RECOMMENDED)

**Pros:**
- Serverless - pay only for what you use
- Auto-scaling (0 to N instances)
- HTTPS/TLS out of the box
- Managed infrastructure
- Best for microservices

**Deployment:**

```bash
# Deploy Container App
az containerapp create \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --environment veritalent-ai-env \
  --image verittalentairegistry.azurecr.io/veritalent-ai:latest \
  --registry-server verittalentairegistry.azurecr.io \
  --registry-username <acr-username> \
  --registry-password <acr-password> \
  --target-port 8080 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 10 \
  --cpu 2 \
  --memory 4Gi \
  --env-vars \
    AZURE_AI_ENDPOINT=https://verdiaq-ai-resource.services.ai.azure.com \
    AZURE_AI_MODEL=grok-4-fast-reasoning \
    AZURE_AI_API_VERSION=2024-05-01-preview \
    LOG_LEVEL=INFO \
  --secrets \
    azure-ai-api-key=keyvaultref:https://veritalent-keyvault.vault.azure.net/secrets/azure-ai-api-key
```

**Auto-scaling Configuration:**

```bash
# Configure scaling rules
az containerapp update \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --min-replicas 1 \
  --max-replicas 10 \
  --scale-rule-name http-scaling \
  --scale-rule-type http \
  --scale-rule-http-concurrency 50
```

### Option 2: Azure App Service

**Pros:**
- Familiar deployment model
- Built-in CI/CD
- Easy SSL/custom domains
- Good for traditional apps

**Deployment:**

```bash
# Create App Service Plan
az appservice plan create \
  --name veritalent-ai-plan \
  --resource-group veritalent-rg \
  --is-linux \
  --sku P1V2

# Create Web App for Containers
az webapp create \
  --name veritalent-ai-app \
  --resource-group veritalent-rg \
  --plan veritalent-ai-plan \
  --deployment-container-image-name verittalentairegistry.azurecr.io/veritalent-ai:latest

# Configure app settings
az webapp config appsettings set \
  --name veritalent-ai-app \
  --resource-group veritalent-rg \
  --settings \
    AZURE_AI_ENDPOINT=https://verdiaq-ai-resource.services.ai.azure.com \
    AZURE_AI_MODEL=grok-4-fast-reasoning \
    AZURE_AI_API_VERSION=2024-05-01-preview
```

### Option 3: Azure Kubernetes Service (AKS)

**When to use:**
- Need advanced orchestration
- Multiple microservices
- Complex networking requirements
- Team has Kubernetes expertise

---

## Environment Configuration

### Environment Variables

Create production `.env` file (stored as Azure secrets):

```env
# Azure AI Configuration
AZURE_AI_ENDPOINT=https://verdiaq-ai-resource.services.ai.azure.com
AZURE_AI_API_KEY=<from-key-vault>
AZURE_AI_MODEL=grok-4-fast-reasoning
AZURE_AI_API_VERSION=2024-05-01-preview

# API Configuration
API_PORT=8080
API_HOST=0.0.0.0
ALLOWED_ORIGINS=https://veritalent.com,https://api.veritalent.com

# Backend Integration
JEFFREY_BACKEND_URL=https://api.veritalent.com
JEFFREY_BACKEND_API_KEY=<from-key-vault>

# Storage
AZURE_STORAGE_CONNECTION_STRING=<from-key-vault>
CV_UPLOAD_CONTAINER=cv-uploads

# Monitoring
APPLICATIONINSIGHTS_CONNECTION_STRING=<from-app-insights>
LOG_LEVEL=INFO

# Performance
MAX_WORKERS=4
REQUEST_TIMEOUT=300
MAX_REQUEST_SIZE=10485760  # 10MB
```

### Configuration in Code

Update `/home/tife/VeriTalent/ai/src/config.py`:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings from environment variables."""
    
    # Azure AI
    azure_ai_endpoint: str
    azure_ai_api_key: str
    azure_ai_model: str = "grok-4-fast-reasoning"
    azure_ai_api_version: str = "2024-05-01-preview"
    
    # API
    api_port: int = 8080
    api_host: str = "0.0.0.0"
    allowed_origins: list[str] = ["*"]
    
    # Backend
    jeffrey_backend_url: str
    jeffrey_backend_api_key: str
    
    # Storage
    azure_storage_connection_string: str
    cv_upload_container: str = "cv-uploads"
    
    # Monitoring
    applicationinsights_connection_string: str | None = None
    log_level: str = "INFO"
    
    # Performance
    max_workers: int = 4
    request_timeout: int = 300
    max_request_size: int = 10 * 1024 * 1024  # 10MB
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )


settings = Settings()
```

---

## Networking & Communication

### 1. Service Discovery

**Option A: Direct URL (Simple)**

Jeffrey backend calls AI microservice directly:

```typescript
// Jeffrey backend (Node.js/TypeScript)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL; // https://veritalent-ai-service.azurecontainerapps.io

async function parseCv(cvText: string) {
  const response = await fetch(`${AI_SERVICE_URL}/ai/cv/parse-text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.AI_SERVICE_API_KEY
    },
    body: JSON.stringify({ text: cvText })
  });
  
  return response.json();
}
```

**Option B: Azure API Management (Production)**

Use API Management as gateway for:
- Rate limiting
- Authentication
- Monitoring
- Caching
- Load balancing

```bash
# Create API Management instance
az apim create \
  --name veritalent-apim \
  --resource-group veritalent-rg \
  --publisher-email admin@veritalent.com \
  --publisher-name VeriTalent \
  --sku-name Developer

# Import AI API
az apim api create \
  --service-name veritalent-apim \
  --resource-group veritalent-rg \
  --api-id veritalent-ai-api \
  --path /ai \
  --display-name "VeriTalent AI API" \
  --service-url https://veritalent-ai-service.azurecontainerapps.io
```

### 2. CORS Configuration

Already configured in `/home/tife/VeriTalent/ai/src/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # ["https://veritalent.com", "https://api.veritalent.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Virtual Network Integration

For secure communication:

```bash
# Create VNet
az network vnet create \
  --name veritalent-vnet \
  --resource-group veritalent-rg \
  --address-prefix 10.0.0.0/16 \
  --subnet-name ai-subnet \
  --subnet-prefix 10.0.1.0/24

# Integrate Container App with VNet
az containerapp update \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --vnet veritalent-vnet \
  --subnet ai-subnet
```

### 4. Private Endpoints

For maximum security (backend ↔ AI service over private network):

```bash
# Create private endpoint
az network private-endpoint create \
  --name ai-service-private-endpoint \
  --resource-group veritalent-rg \
  --vnet-name veritalent-vnet \
  --subnet backend-subnet \
  --private-connection-resource-id <container-app-id> \
  --connection-name ai-service-connection
```

---

## Security & Authentication

### 1. API Key Authentication

**Implementation in AI Service:**

Update `/home/tife/VeriTalent/ai/src/api/dependencies.py`:

```python
from fastapi import Header, HTTPException, status
from src.config import settings


async def verify_api_key(x_api_key: str = Header(..., alias="X-API-Key")) -> bool:
    """Verify API key from request header."""
    if x_api_key != settings.jeffrey_backend_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    return True
```

**Usage in routes:**

```python
from fastapi import Depends
from src.api.dependencies import verify_api_key

@router.post("/ai/cv/parse-text", dependencies=[Depends(verify_api_key)])
async def parse_cv_text(request: ParseCVRequest):
    # Protected endpoint
    ...
```

### 2. Managed Identity (Azure to Azure)

Use Managed Identity for Azure AI Service access:

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

# Get secrets without storing keys in code
credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://veritalent-keyvault.vault.azure.net", credential=credential)
api_key = client.get_secret("azure-ai-api-key").value
```

**Enable Managed Identity:**

```bash
az containerapp identity assign \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --system-assigned

# Grant Key Vault access
az keyvault set-policy \
  --name veritalent-keyvault \
  --object-id <managed-identity-principal-id> \
  --secret-permissions get list
```

### 3. Network Security

- Enable HTTPS only
- Use Azure Front Door for DDoS protection
- Implement rate limiting
- IP whitelisting (Jeffrey backend IPs only)

---

## Monitoring & Logging

### 1. Application Insights Integration

Update `/home/tife/VeriTalent/ai/src/main.py`:

```python
from opencensus.ext.azure.log_exporter import AzureLogHandler
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer
import logging

# Configure logging
if settings.applicationinsights_connection_string:
    logger = logging.getLogger(__name__)
    logger.addHandler(
        AzureLogHandler(connection_string=settings.applicationinsights_connection_string)
    )
    
    # Configure tracing
    tracer = Tracer(
        exporter=AzureExporter(connection_string=settings.applicationinsights_connection_string),
        sampler=ProbabilitySampler(1.0)
    )
```

### 2. Custom Metrics

```python
from opencensus.stats import aggregation, measure, stats, view

# Define metrics
cv_parse_duration = measure.MeasureFloat("cv_parse_duration", "CV parsing duration", "ms")
cv_parse_count = measure.MeasureInt("cv_parse_count", "CV parsing count", "1")

# Create views
duration_view = view.View(
    "cv_parse_duration_distribution",
    "Distribution of CV parsing duration",
    [],
    cv_parse_duration,
    aggregation.DistributionAggregation([0, 100, 500, 1000, 5000, 10000])
)

# Record metrics
async def parse_cv(text: str):
    start_time = time.time()
    result = await llm_service.parse_cv(text)
    duration = (time.time() - start_time) * 1000
    
    stats.stats.record([(cv_parse_duration, duration), (cv_parse_count, 1)])
    return result
```

### 3. Structured Logging

```python
import structlog

logger = structlog.get_logger()

async def parse_cv(talent_id: str, text: str):
    logger.info("cv_parse_started", talent_id=talent_id, text_length=len(text))
    try:
        result = await llm_service.parse_cv(text)
        logger.info("cv_parse_completed", talent_id=talent_id, skills_count=len(result.skills))
        return result
    except Exception as e:
        logger.error("cv_parse_failed", talent_id=talent_id, error=str(e), exc_info=True)
        raise
```

### 4. Health Check Endpoints

Already implemented:

- `/health` - Basic health check
- `/api/ai/health` - AI service health check

Monitor these endpoints with Azure Monitor:

```bash
# Create availability test
az monitor app-insights web-test create \
  --name ai-service-health-check \
  --resource-group veritalent-rg \
  --location eastus \
  --web-test-kind ping \
  --url https://veritalent-ai-service.azurecontainerapps.io/health \
  --frequency 300 \
  --timeout 30
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `/home/tife/VeriTalent/.github/workflows/deploy-ai-service.yml`:

```yaml
name: Deploy AI Service to Azure

on:
  push:
    branches: [main]
    paths:
      - 'ai/**'
  workflow_dispatch:

env:
  AZURE_CONTAINER_REGISTRY: verittalentairegistry.azurecr.io
  CONTAINER_APP_NAME: veritalent-ai-service
  RESOURCE_GROUP: veritalent-rg

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      
      - name: Run tests
        working-directory: ./ai
        run: |
          pip install uv
          uv venv
          source .venv/bin/activate
          uv sync
          uv run pytest tests/ -v --cov=src
      
      - name: Login to Azure
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Login to ACR
        run: |
          az acr login --name verittalentairegistry
      
      - name: Build and push Docker image
        working-directory: ./ai
        run: |
          docker build -t ${{ env.AZURE_CONTAINER_REGISTRY }}/veritalent-ai:${{ github.sha }} .
          docker tag ${{ env.AZURE_CONTAINER_REGISTRY }}/veritalent-ai:${{ github.sha }} \
                     ${{ env.AZURE_CONTAINER_REGISTRY }}/veritalent-ai:latest
          docker push ${{ env.AZURE_CONTAINER_REGISTRY }}/veritalent-ai:${{ github.sha }}
          docker push ${{ env.AZURE_CONTAINER_REGISTRY }}/veritalent-ai:latest
      
      - name: Deploy to Azure Container Apps
        run: |
          az containerapp update \
            --name ${{ env.CONTAINER_APP_NAME }} \
            --resource-group ${{ env.RESOURCE_GROUP }} \
            --image ${{ env.AZURE_CONTAINER_REGISTRY }}/veritalent-ai:${{ github.sha }}
      
      - name: Health check
        run: |
          sleep 30
          ENDPOINT=$(az containerapp show \
            --name ${{ env.CONTAINER_APP_NAME }} \
            --resource-group ${{ env.RESOURCE_GROUP }} \
            --query properties.configuration.ingress.fqdn -o tsv)
          
          curl -f https://${ENDPOINT}/health || exit 1
```

### Azure DevOps Pipeline

Create `ai/azure-pipelines.yml`:

```yaml
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - ai/*

pool:
  vmImage: 'ubuntu-latest'

variables:
  containerRegistry: 'verittalentairegistry.azurecr.io'
  imageName: 'veritalent-ai'
  resourceGroup: 'veritalent-rg'
  containerAppName: 'veritalent-ai-service'

stages:
  - stage: Test
    jobs:
      - job: RunTests
        steps:
          - task: UsePythonVersion@0
            inputs:
              versionSpec: '3.12'
          
          - script: |
              pip install uv
              uv venv
              source .venv/bin/activate
              uv sync
              uv run pytest tests/ -v --cov=src --cov-report=xml
            displayName: 'Run tests'
            workingDirectory: $(System.DefaultWorkingDirectory)/ai
          
          - task: PublishCodeCoverageResults@1
            inputs:
              codeCoverageTool: 'Cobertura'
              summaryFileLocation: '$(System.DefaultWorkingDirectory)/ai/coverage.xml'

  - stage: Build
    dependsOn: Test
    jobs:
      - job: BuildAndPush
        steps:
          - task: Docker@2
            inputs:
              containerRegistry: 'ACRServiceConnection'
              repository: $(imageName)
              command: 'buildAndPush'
              Dockerfile: '$(System.DefaultWorkingDirectory)/ai/Dockerfile'
              tags: |
                $(Build.BuildId)
                latest

  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: DeployToAzure
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: 'AzureServiceConnection'
                    scriptType: 'bash'
                    scriptLocation: 'inlineScript'
                    inlineScript: |
                      az containerapp update \
                        --name $(containerAppName) \
                        --resource-group $(resourceGroup) \
                        --image $(containerRegistry)/$(imageName):$(Build.BuildId)
```

---

## Scaling & Performance

### 1. Auto-Scaling Rules

```bash
# HTTP concurrency-based scaling
az containerapp update \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --scale-rule-name http-rule \
  --scale-rule-type http \
  --scale-rule-http-concurrency 50

# CPU-based scaling
az containerapp update \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --scale-rule-name cpu-rule \
  --scale-rule-type cpu \
  --scale-rule-metadata value=70
```

### 2. Caching Strategy

Implement Redis for caching:

```python
from redis.asyncio import Redis
import json

redis_client = Redis.from_url(settings.redis_connection_string)

async def get_cached_cv_parse(cv_hash: str):
    """Get cached CV parsing result."""
    cached = await redis_client.get(f"cv:parse:{cv_hash}")
    if cached:
        return json.loads(cached)
    return None

async def cache_cv_parse(cv_hash: str, result: dict, ttl: int = 3600):
    """Cache CV parsing result for 1 hour."""
    await redis_client.setex(
        f"cv:parse:{cv_hash}",
        ttl,
        json.dumps(result)
    )
```

### 3. Connection Pooling

```python
import httpx

# Global HTTP client with connection pooling
http_client = httpx.AsyncClient(
    limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
    timeout=httpx.Timeout(300.0)
)
```

### 4. Resource Limits

```bash
# Set CPU and memory limits
az containerapp update \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --cpu 2.0 \
  --memory 4Gi
```

---

## Cost Optimization

### 1. Container Apps Pricing

- **Consumption plan**: Pay per vCPU-second and GB-second
- **Typical costs**: ~$50-200/month for moderate traffic
- **Scale to zero**: Reduce costs during low traffic

### 2. Azure AI Service Costs

- **Grok-4 pricing**: ~$0.01-0.05 per 1K tokens
- **Monthly estimate**: $100-500 depending on usage
- **Optimization**: Cache frequent queries, batch processing

### 3. Cost-Saving Tips

```bash
# Scale to zero during off-hours
az containerapp update \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --min-replicas 0

# Use spot instances for AKS (if using Kubernetes)
az aks nodepool add \
  --resource-group veritalent-rg \
  --cluster-name veritalent-aks \
  --name spotpool \
  --priority Spot \
  --eviction-policy Delete \
  --spot-max-price -1
```

### 4. Cost Monitoring

```bash
# Set up cost alerts
az consumption budget create \
  --name ai-service-budget \
  --category cost \
  --amount 500 \
  --time-grain monthly \
  --start-date 2024-01-01 \
  --end-date 2025-01-01 \
  --notification enabled=true operator=GreaterThan threshold=80 \
  --notification-email admin@veritalent.com
```

---

## Troubleshooting

### Common Issues

#### 1. Container App Not Starting

```bash
# Check logs
az containerapp logs show \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --tail 100

# Check revisions
az containerapp revision list \
  --name veritalent-ai-service \
  --resource-group veritalent-rg
```

#### 2. Azure AI Timeouts

- Increase timeout: `REQUEST_TIMEOUT=300`
- Verify streaming is enabled: `stream: True`
- Check network connectivity
- Verify API key is correct

#### 3. High Latency

- Enable Application Insights profiler
- Check database query performance
- Review Azure AI service limits
- Consider adding Redis cache

#### 4. Memory Leaks

```bash
# Increase memory
az containerapp update \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --memory 8Gi

# Monitor memory usage
az monitor metrics list \
  --resource <container-app-id> \
  --metric "WorkingSetBytes"
```

### Debugging Tools

```bash
# Access container console
az containerapp exec \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --command /bin/bash

# Stream logs
az containerapp logs show \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --follow

# Check environment variables
az containerapp show \
  --name veritalent-ai-service \
  --resource-group veritalent-rg \
  --query properties.template.containers[0].env
```

---

## Communication with Jeffrey Backend

### 1. Backend Integration Pattern

**Jeffrey Backend (Node.js/TypeScript):**

```typescript
// services/aiService.ts
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://veritalent-ai-service.azurecontainerapps.io';
const AI_API_KEY = process.env.AI_SERVICE_API_KEY;

const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': AI_API_KEY
  },
  timeout: 120000 // 2 minutes
});

export async function parseCV(cvText: string): Promise<ParsedCV> {
  try {
    const response = await aiClient.post('/ai/cv/parse-text', {
      text: cvText
    });
    return response.data.data;
  } catch (error) {
    console.error('AI service error:', error);
    throw new Error('Failed to parse CV');
  }
}

export async function calculateJobFit(
  talentProfile: any,
  jobDetails: any
): Promise<JobFitScore> {
  const response = await aiClient.post('/api/job/match', {
    talent_profile: talentProfile,
    job_details: jobDetails
  });
  return response.data;
}

export async function generateCoverLetter(
  candidateInfo: any,
  jobInfo: any
): Promise<string> {
  const response = await aiClient.post('/api/cover-letter/generate', {
    job_title: jobInfo.title,
    company_name: jobInfo.company,
    job_description: jobInfo.description,
    candidate_info: candidateInfo
  });
  return response.data.cover_letter;
}
```

### 2. Error Handling

```typescript
// middleware/errorHandler.ts
export function handleAIServiceError(error: any) {
  if (error.response) {
    // AI service returned error response
    const status = error.response.status;
    const detail = error.response.data?.detail || 'AI service error';
    
    switch (status) {
      case 401:
        throw new Error('AI service authentication failed');
      case 429:
        throw new Error('AI service rate limit exceeded');
      case 500:
        throw new Error('AI service internal error');
      default:
        throw new Error(`AI service error: ${detail}`);
    }
  } else if (error.request) {
    // Request made but no response
    throw new Error('AI service not reachable');
  } else {
    throw new Error('Failed to call AI service');
  }
}
```

### 3. Retry Logic

```typescript
import retry from 'async-retry';

async function parseCV WithRetry(cvText: string): Promise<ParsedCV> {
  return retry(
    async () => {
      return await parseCV(cvText);
    },
    {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000,
      onRetry: (err, attempt) => {
        console.log(`AI service retry attempt ${attempt}:`, err.message);
      }
    }
  );
}
```

### 4. Webhook Integration

If Jeffrey backend needs real-time notifications:

```python
# In AI service
import httpx

async def notify_backend(event_type: str, data: dict):
    """Send event notification to Jeffrey backend."""
    webhook_url = f"{settings.jeffrey_backend_url}/webhooks/ai-events"
    
    async with httpx.AsyncClient() as client:
        await client.post(
            webhook_url,
            json={
                "event": event_type,
                "data": data,
                "timestamp": datetime.utcnow().isoformat()
            },
            headers={"X-API-Key": settings.jeffrey_backend_api_key}
        )

# Usage
async def parse_cv(text: str):
    result = await llm_service.extract_cv_data(text)
    
    # Notify backend
    await notify_backend("cv.parsed", {
        "talent_id": talent_id,
        "skills_count": len(result.skills)
    })
    
    return result
```

---

## Production Checklist

Before deploying to production:

- [ ] All environment variables configured in Azure Key Vault
- [ ] Docker image builds successfully
- [ ] All tests passing (`uv run pytest tests/ -v --cov`)
- [ ] HTTPS/TLS enabled
- [ ] CORS configured correctly
- [ ] API authentication implemented
- [ ] Rate limiting configured
- [ ] Application Insights enabled
- [ ] Health check endpoints working
- [ ] Auto-scaling rules configured
- [ ] Cost alerts set up
- [ ] Backup and disaster recovery plan
- [ ] Documentation complete
- [ ] CI/CD pipeline tested
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Jeffrey backend integration tested

---

## Quick Reference Commands

```bash
# View logs
az containerapp logs show --name veritalent-ai-service --resource-group veritalent-rg --tail 100

# Restart app
az containerapp revision restart --name veritalent-ai-service --resource-group veritalent-rg

# Scale manually
az containerapp update --name veritalent-ai-service --resource-group veritalent-rg --min-replicas 2 --max-replicas 20

# View metrics
az monitor metrics list --resource <app-id> --metric "Requests"

# Update environment variables
az containerapp update --name veritalent-ai-service --resource-group veritalent-rg --set-env-vars KEY=VALUE
```

---

## Support & Resources

- **Azure Container Apps Docs**: https://learn.microsoft.com/azure/container-apps/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Azure AI Services**: https://learn.microsoft.com/azure/ai-services/
- **Application Insights**: https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Maintained By**: VeriTalent DevOps Team
