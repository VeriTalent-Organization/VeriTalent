# VeriTalent AI - Deployment Guide

Complete guide for deploying the VeriTalent AI microservice using Docker.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Production Deployment](#production-deployment)
- [Environment Configuration](#environment-configuration)
- [Deployment Platforms](#deployment-platforms)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

- Docker 20.10+ and Docker Compose 2.0+
- Azure AI API credentials (Grok model)
- Azure Cosmos DB connection string (MongoDB vCore)

### Optional

- Domain name with SSL certificate (for production)
- Monitoring tools (Prometheus, Grafana, etc.)

---

## Quick Start with Docker

### 1. Configure Environment Variables

```bash
# Copy environment template
cp .env.local .env

# Edit with your credentials
nano .env
```

### 2. Build and Run

```bash
# Build the Docker image
docker-compose build

# Start the service
docker-compose up -d

# Check logs
docker-compose logs -f veritalent-ai
```

### 3. Verify Deployment

```bash
# Health check
curl http://localhost:8080/health

# API documentation
open http://localhost:8080/docs
```

---

## Production Deployment

### Build for Production

```bash
# Build optimized production image
docker build -t veritalent-ai:production ./ai

# Tag for registry
docker tag veritalent-ai:production your-registry.io/veritalent-ai:latest

# Push to registry
docker push your-registry.io/veritalent-ai:latest
```

### Production Docker Compose

```yaml
version: '3.8'

services:
  veritalent-ai:
    image: your-registry.io/veritalent-ai:latest
    ports:
      - "8080:8080"
    env_file:
      - .env.production
    volumes:
      - ai-data:/app/data
      - ai-logs:/app/logs
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

---

## Environment Configuration

### Required Variables

Create `.env` file in the project root:

```env
# Azure AI (REQUIRED)
AZURE_AI_ENDPOINT=https://your-endpoint.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview
AZURE_AI_API_KEY=your-api-key-here
AZURE_AI_MODEL=grok-4-fast-reasoning

# Cosmos DB (REQUIRED)
COSMOS_CONNECTION_STRING=mongodb://your-connection-string
COSMOS_DATABASE_NAME=veritalent_ai

# Security (REQUIRED in production)
SECRET_KEY=generate-secure-random-string-here
AI_API_KEY=your-api-key-for-backend-auth
ALLOWED_ORIGINS=https://your-domain.com
```

### Optional Variables

```env
# API Configuration
AI_API_DEBUG=false
LOG_LEVEL=INFO

# Backend Integration
BACKEND_API_URL=https://your-backend-api.com/v1

# Limits
MAX_CV_SIZE_MB=10
MAX_TOKENS_PER_REQUEST=4000
```

---

## Deployment Platforms

### Azure Container Instances (ACI)

```bash
# Login to Azure
az login

# Create resource group
az group create --name veritalent-ai-rg --location eastus

# Deploy container
az container create \
  --resource-group veritalent-ai-rg \
  --name veritalent-ai \
  --image your-registry.io/veritalent-ai:latest \
  --cpu 2 --memory 4 \
  --ports 8080 \
  --environment-variables \
    AZURE_AI_ENDPOINT=$AZURE_AI_ENDPOINT \
    AZURE_AI_API_KEY=$AZURE_AI_API_KEY \
  --restart-policy Always
```

### AWS ECS (Elastic Container Service)

```bash
# Create ECR repository
aws ecr create-repository --repository-name veritalent-ai

# Push image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
docker tag veritalent-ai:latest your-account.dkr.ecr.us-east-1.amazonaws.com/veritalent-ai:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/veritalent-ai:latest

# Create ECS task definition and service (use AWS Console or CLI)
```

### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/your-project/veritalent-ai ./ai

# Deploy
gcloud run deploy veritalent-ai \
  --image gcr.io/your-project/veritalent-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars AZURE_AI_ENDPOINT=$AZURE_AI_ENDPOINT,AZURE_AI_API_KEY=$AZURE_AI_API_KEY
```

### Render.com

1. Connect your GitHub repository
2. Create new Web Service
3. Select Docker runtime
4. Set environment variables in dashboard
5. Deploy

### Railway.app

1. Connect repository or deploy from Docker image
2. Set environment variables
3. Railway will auto-deploy on git push

---

## Monitoring & Maintenance

### Health Checks

```bash
# Container health
docker ps --filter name=veritalent-ai

# Service health
curl http://localhost:8080/health

# Detailed metrics
curl http://localhost:8080/metrics  # If metrics endpoint is implemented
```

### Logs

```bash
# View logs
docker-compose logs -f veritalent-ai

# Export logs
docker-compose logs veritalent-ai > ai-service.log

# Check specific time range
docker-compose logs --since="2h" veritalent-ai
```

### Resource Monitoring

```bash
# Resource usage
docker stats veritalent-ai

# Container inspect
docker inspect veritalent-ai
```

### Updates

```bash
# Pull latest image
docker-compose pull

# Recreate containers
docker-compose up -d --force-recreate

# Or rebuild from source
docker-compose build --no-cache
docker-compose up -d
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs veritalent-ai

# Verify environment variables
docker-compose config

# Check if port is already in use
lsof -i :8080
```

### Connection Issues

```bash
# Test from inside container
docker exec -it veritalent-ai curl http://localhost:8080/health

# Check network
docker network inspect veritalent-network

# Verify DNS resolution
docker exec -it veritalent-ai nslookup verdiaq-ai-resource.services.ai.azure.com
```

### Performance Issues

```bash
# Increase resources in docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 8G

# Check resource constraints
docker stats veritalent-ai
```

### Database Connection Issues

```bash
# Test Cosmos DB connection
docker exec -it veritalent-ai python -c "
from pymongo import MongoClient
import os
client = MongoClient(os.environ['COSMOS_CONNECTION_STRING'])
print(client.server_info())
"
```

---

## Security Best Practices

### 1. Use Secrets Management

```bash
# Don't commit .env files
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# Use Docker secrets or cloud provider secret managers
```

### 2. Enable HTTPS

```yaml
# Use reverse proxy (nginx/traefik) with SSL
# Example with nginx:
services:
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```

### 3. Network Security

```yaml
# Limit network exposure
services:
  veritalent-ai:
    networks:
      - internal
    # Only expose through reverse proxy
```

### 4. Regular Updates

```bash
# Update base images regularly
docker pull python:3.11-slim
docker-compose build --no-cache
```

---

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  veritalent-ai:
    deploy:
      replicas: 3
    # Add load balancer
```

### Load Balancing

Use nginx or cloud load balancers:

```nginx
upstream veritalent-ai {
    server ai-1:8080;
    server ai-2:8080;
    server ai-3:8080;
}

server {
    listen 80;
    location / {
        proxy_pass http://veritalent-ai;
    }
}
```

---

## Support

For deployment issues:
- Check logs: `docker-compose logs -f`
- Review [ARCHITECTURE.md](ai/ARCHITECTURE.md)
- Open an issue on GitHub
- Contact DevOps team

---

**Last Updated:** February 2026
