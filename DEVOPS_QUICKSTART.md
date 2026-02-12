# VeriTalent AI - Quick Deployment Guide for DevOps

Quick reference for deploying the VeriTalent AI microservice.

## TL;DR - Deploy in 5 Minutes

```bash
# 1. Clone repository
git clone https://github.com/VeriTalent-Organization/VeriTalent.git
cd VeriTalent

# 2. Configure environment
# Edit .env.local with your Azure AI and Cosmos DB credentials
nano .env.local

# 3. Deploy with Docker
docker-compose up -d

# 4. Verify
curl http://localhost:8080/health
```

**Done!** Service is running on port 8080.

---

## Environment Setup

### ⚠️ Important: Environment File Location

This project uses `.env.local` in the **project root** (NOT in the ai/ directory).

```
VeriTalent/
├── .env.local          ← Edit this file with your credentials
├── ai/
│   ├── .env.example    ← Reference template only (DO NOT EDIT)
│   ├── .env.docker     ← Docker-specific template (optional)
```

### Required Credentials

You need to provide:

1. **Azure AI Endpoint** - Grok model via Azure OpenAI-compatible API
   ```
   AZURE_AI_ENDPOINT=https://verdiaq-ai-resource.services.ai.azure.com/...
   AZURE_AI_API_KEY=your-key-here
   ```

2. **Azure Cosmos DB** - MongoDB vCore for vector storage
   ```
   COSMOS_CONNECTION_STRING=mongodb://...
   ```

3. **API Key** - For backend authentication
   ```
   AI_API_KEY=your-secure-api-key
   ```

---

## Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f veritalent-ai

# Scale horizontally
docker-compose up -d --scale veritalent-ai=3

# Stop
docker-compose down
```

### Option 2: Standalone Docker

```bash
# Build
docker build -t veritalent-ai:latest ./ai

# Run
docker run -d \
  --name veritalent-ai \
  -p 8080:8080 \
  --env-file .env.local \
  -v veritalent-ai-data:/app/data \
  --restart unless-stopped \
  veritalent-ai:latest

# Logs
docker logs -f veritalent-ai
```

### Option 3: Cloud Platforms

#### Azure Container Instances

```bash
# Build and push to ACR
az acr build --registry yourregistry --image veritalent-ai:latest ./ai

# Deploy
az container create \
  --resource-group veritalent-rg \
  --name veritalent-ai \
  --image yourregistry.azurecr.io/veritalent-ai:latest \
  --cpu 2 --memory 4 \
  --ports 8080 \
  --environment-variables \
    AZURE_AI_ENDPOINT=$AZURE_AI_ENDPOINT \
    AZURE_AI_API_KEY=$AZURE_AI_API_KEY \
  --restart-policy Always
```

#### AWS ECS

```bash
# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com
docker tag veritalent-ai:latest $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/veritalent-ai:latest
docker push $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/veritalent-ai:latest

# Then create ECS task definition and service via AWS Console or Terraform
```

#### Google Cloud Run

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/$PROJECT_ID/veritalent-ai ./ai
gcloud run deploy veritalent-ai \
  --image gcr.io/$PROJECT_ID/veritalent-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Health Checks & Monitoring

### Health Endpoint

```bash
# Basic health check
curl http://localhost:8080/health

# Expected response
{
  "status": "healthy",
  "services": {
    "api": "up",
    "llm": "connected",
    "vector_db": "connected"
  }
}
```

### Resource Monitoring

```bash
# Docker stats
docker stats veritalent-ai

# Container logs
docker logs --tail 100 -f veritalent-ai

# Health check from inside container
docker exec veritalent-ai curl http://localhost:8080/health
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs for errors
docker-compose logs veritalent-ai

# Verify environment variables
docker-compose config

# Test Azure AI connection
docker exec -it veritalent-ai python -c "
import os
print('Endpoint:', os.environ.get('AZURE_AI_ENDPOINT'))
print('API Key:', 'SET' if os.environ.get('AZURE_AI_API_KEY') else 'NOT SET')
"
```

### Connection Issues

```bash
# Test from inside container
docker exec -it veritalent-ai curl http://localhost:8080/health

# Check network
docker network inspect veritalent-network

# Verify DNS
docker exec -it veritalent-ai ping verdiaq-ai-resource.services.ai.azure.com
```

### Performance Issues

```bash
# Increase resources in docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: '8G'
```

---

## Scaling

### Horizontal Scaling with Docker Compose

```bash
# Scale to 3 replicas
docker-compose up -d --scale veritalent-ai=3

# Add nginx load balancer
# See DEPLOYMENT.md for nginx configuration
```

### Cloud Auto-Scaling

- **Azure**: Use Azure Container Apps with auto-scaling rules
- **AWS**: Configure ECS Service auto-scaling
- **GCP**: Cloud Run auto-scales automatically

---

## Security

### Before Production

1. **Change default secrets:**
   ```bash
   SECRET_KEY=$(openssl rand -hex 32)
   AI_API_KEY=$(openssl rand -hex 32)
   ```

2. **Use secrets management:**
   - Azure: Azure Key Vault
   - AWS: AWS Secrets Manager
   - GCP: Secret Manager

3. **Enable HTTPS:**
   - Use reverse proxy (nginx/Caddy)
   - Cloud platform SSL certificates

4. **Network security:**
   - Configure firewall rules
   - Use private networks
   - Enable VPC peering if needed

---

## Backup & Restore

### Vector Database (Cosmos DB)

Cosmos DB auto-backups enabled by default:
- Point-in-time restore available
- Geo-redundancy for production

### Application Data

```bash
# Backup data volume
docker run --rm -v veritalent-ai-data:/data -v $(pwd):/backup alpine tar czf /backup/ai-data-backup.tar.gz /data

# Restore
docker run --rm -v veritalent-ai-data:/data -v $(pwd):/backup alpine tar xzf /backup/ai-data-backup.tar.gz -C /
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy AI Service

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push
        run: |
          docker build -t veritalent-ai:latest ./ai
          docker push ${{ secrets.REGISTRY }}/veritalent-ai:latest
      
      - name: Deploy
        run: |
          # Deploy to your platform
```

### GitLab CI

```yaml
build:
  stage: build
  script:
    - docker build -t veritalent-ai:latest ./ai
    - docker push $CI_REGISTRY_IMAGE:latest
```

---

## Support

- **Full Documentation:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Architecture:** [ai/ARCHITECTURE.md](ai/ARCHITECTURE.md)
- **API Docs:** http://localhost:8080/docs (when running)
- **Issues:** GitHub Issues

---

**Quick Links:**

- Health Check: `http://localhost:8080/health`
- API Docs: `http://localhost:8080/docs`
- ReDoc: `http://localhost:8080/redoc`

**Container Info:**

- Base Image: `python:3.11-slim`
- Port: `8080`
- Data Volume: `/app/data`
- Logs: `/app/logs`
