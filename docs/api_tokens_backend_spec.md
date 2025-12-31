# API Tokens Backend Implementation Specification

## Overview
Implement API token-based authentication to allow recruiters and organizations to programmatically access VeriTalent API endpoints. This enables integration with external systems like ATS (Applicant Tracking Systems), custom dashboards, and automation scripts.

---

## 1. Database Schema

### Table: `api_tokens`

```sql
CREATE TABLE api_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_name VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  token_prefix VARCHAR(10) NOT NULL,  -- First 8 chars for identification (e.g., "vt_live_")
  scopes JSON,  -- Optional: ['jobs:read', 'jobs:write', 'applicants:read']
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_token_hash (token_hash),
  INDEX idx_is_active (is_active)
);
```

### Constraints
- Only users with `user_type` = `INDEPENDENT_RECRUITER` or `ORGANISATION` can create tokens
- Maximum 10 active tokens per user
- Token names must be unique per user

---

## 2. API Endpoints

### 2.1 Generate New Token

**Endpoint:** `POST /api/tokens`

**Request Body:**
```json
{
  "name": "ATS Integration",
  "scopes": ["jobs:read", "jobs:write", "applicants:read"],  // Optional
  "expiresInDays": 90  // Optional, default: null (no expiration)
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "API token generated successfully",
  "data": {
    "token": "vt_live_a8f3j2k9d7h4m6n2p5q8r1s4t7v9w2x5y8z1b4c7e0f3g6h9j2k5m8n1p4q7r0s",
    "tokenId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "ATS Integration",
    "createdAt": "2025-12-30T14:30:00.000Z",
    "expiresAt": "2026-03-30T14:30:00.000Z",
    "warning": "Save this token now. You won't be able to see it again."
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Token limit reached. Maximum 10 active tokens allowed.",
  "status": 400
}
```

**Implementation Notes:**
- Generate token using cryptographically secure random bytes (minimum 32 bytes)
- Format: `vt_live_<64_random_alphanumeric_chars>`
- Hash token using SHA-256 before storing in database
- Store first 8 characters as `token_prefix` for identification
- Return plain token ONLY in this response (cannot be retrieved later)

---

### 2.2 List User's Tokens

**Endpoint:** `GET /api/tokens`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "API tokens retrieved",
  "data": {
    "tokens": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "ATS Integration",
        "prefix": "vt_live_a8f3j2k9...",
        "scopes": ["jobs:read", "jobs:write", "applicants:read"],
        "isActive": true,
        "createdAt": "2025-12-30T14:30:00.000Z",
        "lastUsedAt": "2025-12-30T16:45:00.000Z",
        "expiresAt": "2026-03-30T14:30:00.000Z"
      },
      {
        "id": "660f9511-f3ac-52e5-b827-557766551111",
        "name": "Screening API",
        "prefix": "vt_live_b9g4k3l0...",
        "scopes": ["applicants:read"],
        "isActive": true,
        "createdAt": "2025-11-15T10:20:00.000Z",
        "lastUsedAt": "2025-12-29T18:30:00.000Z",
        "expiresAt": null
      }
    ]
  }
}
```

**Implementation Notes:**
- Never return the actual token value
- Show only token prefix for identification
- Include usage statistics

---

### 2.3 Revoke Token

**Endpoint:** `DELETE /api/tokens/:tokenId`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "API token revoked successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Token not found or already revoked",
  "status": 404
}
```

**Implementation Notes:**
- Set `is_active = FALSE` (soft delete)
- Verify user owns the token before revoking

---

### 2.4 Regenerate Token (Optional)

**Endpoint:** `POST /api/tokens/:tokenId/regenerate`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "API token regenerated",
  "data": {
    "token": "vt_live_NEW_TOKEN_HERE",
    "tokenId": "550e8400-e29b-41d4-a716-446655440000",
    "warning": "Old token is now invalid. Save this new token."
  }
}
```

---

## 3. Authentication Middleware

### 3.1 Token Validation Flow

```javascript
// Pseudocode for middleware
async function authenticateToken(req, res, next) {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continue to session auth
  }
  
  const token = authHeader.split(' ')[1];
  
  // 2. Validate token format
  if (!token.startsWith('vt_live_') || token.length < 50) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token format' 
    });
  }
  
  // 3. Hash token and lookup in database
  const tokenHash = sha256(token);
  const tokenRecord = await db.query(
    'SELECT * FROM api_tokens WHERE token_hash = ? AND is_active = TRUE',
    [tokenHash]
  );
  
  if (!tokenRecord) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or revoked token' 
    });
  }
  
  // 4. Check expiration
  if (tokenRecord.expires_at && new Date(tokenRecord.expires_at) < new Date()) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token expired' 
    });
  }
  
  // 5. Update last_used_at (async, don't block request)
  db.query('UPDATE api_tokens SET last_used_at = NOW() WHERE id = ?', [tokenRecord.id]);
  
  // 6. Load user and attach to request
  const user = await db.query('SELECT * FROM users WHERE id = ?', [tokenRecord.user_id]);
  req.user = user;
  req.authMethod = 'token';
  req.tokenScopes = tokenRecord.scopes;
  
  next();
}
```

### 3.2 Scope Validation (Optional)

```javascript
function requireScope(scope) {
  return (req, res, next) => {
    if (req.authMethod === 'token' && req.tokenScopes) {
      if (!req.tokenScopes.includes(scope)) {
        return res.status(403).json({ 
          success: false, 
          message: `Token missing required scope: ${scope}` 
        });
      }
    }
    next();
  };
}

// Usage:
app.get('/api/jobs/my-posted', authenticate, requireScope('jobs:read'), getMyPostedJobs);
```

---

## 4. Security Requirements

### 4.1 Token Generation
- Use `crypto.randomBytes(32)` or equivalent
- Convert to base64/hex and prefix with `vt_live_`
- Total length: minimum 64 characters
- Format: `vt_live_<random_string>`

### 4.2 Token Storage
- **Never store plain tokens in database**
- Use SHA-256 hash: `hash = SHA256(token)`
- Store only: `token_hash`, `token_prefix` (first 8-12 chars)

### 4.3 Rate Limiting
- Implement per-token rate limiting
- Suggested limits:
  - 1000 requests per hour per token
  - 10,000 requests per day per token
- Return `429 Too Many Requests` with headers:
  ```
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 850
  X-RateLimit-Reset: 1640995200
  ```

### 4.4 Token Expiration (Optional)
- Support configurable expiration (default: no expiration)
- Send warning email 7 days before expiration
- Automatically deactivate expired tokens

### 4.5 Logging & Monitoring
- Log all token usage:
  - Token ID (not the token itself)
  - User ID
  - Endpoint accessed
  - Timestamp
  - IP address
  - User agent

---

## 5. Integration with Existing Endpoints

### 5.1 Update All Protected Routes
All existing authenticated endpoints must accept **both**:
1. **Session-based auth** (existing - for web UI)
2. **Token-based auth** (new - for API access)

**Example Authentication Flow:**
```javascript
async function authenticate(req, res, next) {
  // Try token authentication first
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return authenticateToken(req, res, next);
  }
  
  // Fall back to session authentication
  return authenticateSession(req, res, next);
}
```

### 5.2 Endpoints That Should Support Tokens
- ✅ `GET /api/jobs/my-posted`
- ✅ `POST /api/jobs/create`
- ✅ `GET /api/jobs/:id`
- ✅ `GET /api/jobs/:id/applicants`
- ✅ `POST /api/cv-upload/*`
- ✅ `GET /api/screening/*`
- ✅ `POST /api/references/*`
- ✅ `GET /api/users/me` (return user associated with token)

---

## 6. Testing Requirements

### 6.1 Unit Tests
- Token generation produces unique, secure tokens
- Token hashing is consistent
- Token validation catches invalid formats
- Expired tokens are rejected

### 6.2 Integration Tests
- Create token → Use token → Revoke token flow
- Token works across different endpoints
- Rate limiting enforces limits
- Session auth and token auth work independently

### 6.3 Security Tests
- Expired tokens cannot be used
- Revoked tokens cannot be used
- Invalid token formats are rejected
- Token from User A cannot access User B's resources

---

## 7. Error Handling

### Standard Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "status": 401
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Token missing required scope: jobs:write",
  "status": 403
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "message": "Rate limit exceeded. Try again in 1200 seconds.",
  "status": 429,
  "retryAfter": 1200
}
```

---

## 8. API Documentation for End Users

Provide documentation showing recruiters how to use tokens:

```bash
# Example: Get my posted jobs
curl -X GET https://api.veritalent.com/api/jobs/my-posted \
  -H "Authorization: Bearer vt_live_YOUR_TOKEN_HERE"

# Example: Create a job
curl -X POST https://api.veritalent.com/api/jobs/create \
  -H "Authorization: Bearer vt_live_YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "companyName": "Tech Corp",
    "location": "Remote",
    "employmentType": "Full Time"
  }'
```

---

## 9. Migration Plan

### Phase 1: Backend Implementation
1. Create database table
2. Implement token CRUD endpoints
3. Add token authentication middleware
4. Add rate limiting

### Phase 2: Testing
1. Write unit tests
2. Write integration tests
3. Security audit

### Phase 3: Rollout
1. Deploy to staging
2. Internal testing
3. Update API documentation
4. Deploy to production
5. Announce feature to users

---

## 10. Future Enhancements (Optional)

- **Token Scopes**: Fine-grained permissions (read-only vs read-write)
- **Webhooks**: Event notifications using tokens
- **IP Whitelisting**: Restrict tokens to specific IP ranges
- **Token Rotation**: Automatic rotation every 90 days
- **Usage Analytics**: Dashboard showing token usage metrics

---

## Questions?

If you need clarification on any section, please reach out. This implementation should be prioritized for Q1 2026 to support enterprise customers who need programmatic access.
