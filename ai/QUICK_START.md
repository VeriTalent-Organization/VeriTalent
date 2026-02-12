# VeriTalent AI - Quick Start Guide

## For Developers Integrating with This Service

### Service URL
- **Development**: `http://localhost:8080`
- **Production**: `https://veritalent-ai-service.azurecontainerapps.io`

### Authentication
All endpoints (except `/health` and `/`) require the `X-API-Key` header:

```bash
X-API-Key: <your-api-key>
```

**Development Key**: `dev-ai-secret-key-2026`  
**Production Key**: Get from Azure Key Vault

---

## Common Use Cases

### 1. Parse a CV from Text

**Endpoint**: `POST /ai/cv/parse-text`

**Request**:
```typescript
const response = await fetch(`${AI_SERVICE_URL}/ai/cv/parse-text`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.AI_API_KEY
  },
  body: JSON.stringify({
    text: cvText  // Raw CV text
  })
});

const result = await response.json();
```

**Response**:
```json
{
  "success": true,
  "message": "CV parsed successfully",
  "data": {
    "personal_info": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "New York, NY"
    },
    "skills": ["Python", "Django", "FastAPI"],
    "education": [...],
    "work_experience": [...],
    "certifications": [...],
    "projects": [...]
  },
  "metadata": {
    "processing_time_ms": 3245
  }
}
```

---

### 2. Calculate Job Fit Score

**Endpoint**: `POST /api/job/match`

**Request**:
```typescript
const response = await fetch(`${AI_SERVICE_URL}/api/job/match`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.AI_API_KEY
  },
  body: JSON.stringify({
    talent_profile: {
      skills: ["Python", "Django", "PostgreSQL"],
      experience_years: 5,
      education: [...]
    },
    job_details: {
      title: "Senior Backend Developer",
      required_skills: ["Python", "Django", "AWS"],
      experience_required: "3-5 years"
    }
  })
});
```

**Response**:
```json
{
  "success": true,
  "data": {
    "fit_score": 85,
    "skill_match_percentage": 90,
    "experience_match": "Excellent",
    "strengths": ["Strong Python skills", "Django expertise"],
    "gaps": ["AWS cloud experience needed"],
    "recommendation": "Highly recommended candidate"
  }
}
```

---

### 3. Generate Cover Letter

**Endpoint**: `POST /api/cover-letter/generate`

**Request**:
```typescript
const response = await fetch(`${AI_SERVICE_URL}/api/cover-letter/generate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.AI_API_KEY
  },
  body: JSON.stringify({
    job_title: "Software Engineer",
    company_name: "TechCorp",
    job_description: "Looking for a passionate developer...",
    candidate_info: {
      name: "Jane Doe",
      skills: ["Python", "React"],
      experience: "5 years"
    }
  })
});
```

**Response**:
```json
{
  "success": true,
  "data": {
    "cover_letter": "Dear Hiring Manager,\n\nI am writing to express my interest..."
  }
}
```

---

### 4. Enhance Talent Profile

**Endpoint**: `POST /api/profile/enhance`

**Request**:
```typescript
const response = await fetch(`${AI_SERVICE_URL}/api/profile/enhance`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.AI_API_KEY
  },
  body: JSON.stringify({
    cv_text: "John Doe\nSoftware Engineer\n..."
  })
});
```

**Response**:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "Add quantifiable achievements to work experience",
      "Include certifications for Python and AWS",
      "Highlight leadership experience in team projects"
    ]
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Use the data from response |
| 400 | Bad Request | Check request body format |
| 403 | Forbidden | Verify X-API-Key header |
| 422 | Validation Error | Check required fields in request |
| 500 | Server Error | Retry or contact support |
| 503 | Service Unavailable | Azure AI service is down, retry later |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "skills",
      "issue": "Field required"
    }
  }
}
```

### Retry Logic Example

```typescript
async function callAIServiceWithRetry(url: string, data: any, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.AI_API_KEY
        },
        body: JSON.stringify(data),
        timeout: 120000  // 2 minutes
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      if (response.status >= 500) {
        // Server error - retry
        console.log(`Attempt ${attempt} failed, retrying...`);
        await sleep(1000 * attempt);  // Exponential backoff
        continue;
      }
      
      // Client error (4xx) - don't retry
      throw new Error(`AI service error: ${response.status}`);
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`Attempt ${attempt} failed:`, error.message);
      await sleep(1000 * attempt);
    }
  }
}
```

---

## Rate Limits

- **Default**: 100 requests/minute per API key
- **Burst**: Up to 200 requests/minute for short periods
- **Response when exceeded**: 429 Too Many Requests

---

## Timeouts

- **Recommended client timeout**: 120 seconds (2 minutes)
- **Average response time**: 2-5 seconds
- **Maximum response time**: 30-60 seconds (complex operations)

---

## Testing Locally

### Start the service

```bash
cd /home/tife/VeriTalent/ai
uv venv
source .venv/bin/activate.fish
uv sync
uv run uvicorn src.main:app --reload --port 8080
```

### Test with curl

```bash
# Health check
curl http://localhost:8080/health

# Parse CV
curl -X POST http://localhost:8080/ai/cv/parse-text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-ai-secret-key-2026" \
  -d '{
    "text": "John Doe\nSoftware Engineer\njohn@example.com\n\nSkills: Python, Django, FastAPI\n\nExperience:\n- Backend Developer at TechCorp (2020-2024)\n  - Built REST APIs\n  - Improved performance by 40%"
  }'
```

---

## All Available Endpoints

### CV Processing
- `POST /ai/cv/parse` - Parse CV from file upload
- `POST /ai/cv/parse-text` - Parse CV from raw text
- `POST /ai/cv/summarize` - Generate CV summary

### Job Matching
- `POST /api/job/match` - Calculate job fit score
- `POST /api/job/generate-description` - Generate job description
- `POST /api/job/suggest-improvements` - Suggest job posting improvements

### Screening
- `POST /api/screening/score` - Score candidate against criteria
- `POST /api/screening/batch-score` - Batch score multiple candidates

### Profile Enhancement
- `POST /api/profile/enhance` - Get profile improvement suggestions
- `POST /api/profile/competency-signals` - Extract competency signals
- `POST /api/profile/career-insights` - Generate career insights

### Cover Letter
- `POST /api/cover-letter/generate` - Generate personalized cover letter

### Health & Monitoring
- `GET /` - Welcome message
- `GET /health` - Basic health check
- `GET /api/ai/health` - Detailed AI service health

---

## Environment Variables Required

### In Your Backend Service

```env
# AI Service Configuration
AI_SERVICE_URL=https://veritalent-ai-service.azurecontainerapps.io
AI_SERVICE_API_KEY=<get-from-azure-keyvault>
AI_SERVICE_TIMEOUT=120000  # milliseconds

# Optional
AI_SERVICE_MAX_RETRIES=3
AI_SERVICE_RETRY_DELAY=1000  # milliseconds
```

---

## Best Practices

### 1. Always Use Timeouts
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 120000);

try {
  const response = await fetch(url, {
    signal: controller.signal,
    ...
  });
} finally {
  clearTimeout(timeout);
}
```

### 2. Handle Errors Gracefully
```typescript
try {
  const result = await parseCV(cvText);
  return result;
} catch (error) {
  logger.error('AI service failed:', error);
  // Fallback: return basic parsed data or queue for retry
  return fallbackParser(cvText);
}
```

### 3. Validate Responses
```typescript
const result = await response.json();

if (!result.success || !result.data) {
  throw new Error('Invalid AI service response');
}

// Type checking
if (!result.data.personal_info?.name) {
  throw new Error('Missing required field: personal_info.name');
}
```

### 4. Log for Debugging
```typescript
logger.info('Calling AI service', {
  endpoint: '/ai/cv/parse-text',
  cvLength: cvText.length
});

const startTime = Date.now();
const result = await parseCV(cvText);

logger.info('AI service response', {
  endpoint: '/ai/cv/parse-text',
  duration: Date.now() - startTime,
  skillsFound: result.data.skills.length
});
```

---

## Support

**Documentation**:
- Full deployment guide: `AZURE_DEPLOYMENT.md`
- Testing report: `TESTING_REPORT.md`
- This guide: `QUICK_START.md`

**Issues**:
- Check Application Insights logs
- Review service health: `GET /api/ai/health`
- Contact DevOps team

**Monitoring**:
- Azure Application Insights dashboard
- Container Apps logs: `az containerapp logs show --name veritalent-ai-service`

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│ VeriTalent AI Service - Quick Reference             │
├─────────────────────────────────────────────────────┤
│ URL (Prod): https://veritalent-ai-service...io      │
│ Auth: X-API-Key: <your-key>                         │
│ Timeout: 120s recommended                           │
│ Rate Limit: 100 req/min                             │
├─────────────────────────────────────────────────────┤
│ Common Endpoints:                                    │
│ POST /ai/cv/parse-text          - Parse CV          │
│ POST /api/job/match             - Job fit score     │
│ POST /api/cover-letter/generate - Cover letter      │
│ POST /api/profile/enhance       - Profile tips      │
│ GET  /health                    - Health check      │
└─────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2024-01-15  
**Version**: 1.0
