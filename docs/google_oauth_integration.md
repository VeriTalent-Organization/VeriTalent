# OAuth Integration (Google, LinkedIn, Microsoft)

## Overview
VeriTalent supports OAuth authentication for Google, LinkedIn, and Microsoft. This document explains how the integration works and what needs to be configured.

## Flow Diagram

```
1. User clicks "Login with [Provider]" button
   └─> Frontend: authService.[provider]Auth() triggered
       └─> Redirects to: {BACKEND_URL}/auth/[provider]

2. Backend handles OAuth with Provider
   └─> User authenticates with OAuth provider
   └─> Backend receives user data from provider
   └─> Backend creates/updates user in database
   └─> Backend generates JWT token

3. Backend redirects back to frontend
   └─> Redirect URL: {FRONTEND_URL}/auth/[provider]/callback?token={jwt_token}
   └─> OR on error: {FRONTEND_URL}/auth/[provider]/callback?error={error_message}

4. Frontend callback page handles response
   └─> Extracts token from URL
   └─> Calls authService.handleGoogleCallback(token)
   └─> Fetches user profile data
   └─> Updates Zustand store
   └─> Redirects to /dashboard
```

## Frontend Implementation

### Files Created
- `app/auth/google/callback/page.tsx` - Handles Google OAuth redirect
- `app/auth/linkedin/callback/page.tsx` - Handles LinkedIn OAuth redirect
- `app/auth/microsoft/callback/page.tsx` - Handles Microsoft OAuth redirect
- `lib/services/authService.ts` - Added OAuth methods:
  - `googleAuth()` - Initiates Google OAuth
  - `linkedInAuth()` - Initiates LinkedIn OAuth
  - `microsoftAuth()` - Initiates Microsoft OAuth
  - `handleGoogleCallback(token)` - Processes OAuth callback (works for all providers)

### Configuration Required
No additional frontend configuration needed. The app uses `NEXT_PUBLIC_API_BASE_URL` from `.env`.

## Backend Requirements

### OAuth Redirect URLs
The backend must redirect to the following URLs after successful authentication:

**Google:**
```
https://your-frontend-domain.com/auth/google/callback?token={jwt_token}
```

**LinkedIn:**
```
https://your-frontend-domain.com/auth/linkedin/callback?token={jwt_token}
```

**Microsoft:**
```
https://your-frontend-domain.com/auth/microsoft/callback?token={jwt_token}
```

For errors (all providers):
```
https://your-frontend-domain.com/auth/[provider]/callback?error={url_encoded_error_message}
```

### Backend Environment Variables
The backend should have these configured:

**Google:**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/v1/auth/google/callback
```

**LinkedIn:**
```
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=https://your-backend-domain.com/v1/auth/linkedin/callback
```

**Microsoft:**
```
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_TENANT_ID=common
MICROSOFT_CALLBACK_URL=https://your-backend-domain.com/v1/auth/microsoft/callback
```

**Common:**
```
FRONTEND_CALLBACK_URL=https://your-frontend-domain.com/auth
```

### Backend Endpoints
- `GET /auth/google` - Initiates Google OAuth flow
- `GET /auth/linkedin` - Initiates LinkedIn OAuth flow
- `GET /auth/microsoft` - Initiates Microsoft OAuth flow

Each endpoint should:
1. Redirect user to OAuth provider for authentication
2. Handle OAuth provider callback
3. Create/update user in database
4. Generate JWT token
5. Redirect to `{FRONTEND_CALLBACK_URL}/[provider]/callback?token={jwt_token}`

## Testing Locally

### Development URLs
- Frontend: `http://localhost:3000`
- Backend redirect should go to: 
  - Google: `http://localhost:3000/auth/google/callback?token={jwt_token}`
  - LinkedIn: `http://localhost:3000/auth/linkedin/callback?token={jwt_token}`
  - Microsoft: `http://localhost:3000/auth/microsoft/callback?token={jwt_token}`

### Test Flow
1. Start the dev server: `npm run dev`
2. Navigate to login page: `http://localhost:3000`
3. Click "Login with [Provider]"
4. Complete OAuth authentication with the provider
5. Should redirect to dashboard after successful auth

## Error Handling

The callback pages handle the following scenarios:
- ✅ Successful authentication with token
- ❌ Missing token parameter
- ❌ Error parameter from backend
- ❌ Failed to fetch user profile
- ❌ Network errors

## User Data Flow

After receiving the token, the frontend:
1. Stores token in Zustand store
2. Sets token in localStorage for persistence
3. Adds Authorization header to API client
4. Calls `/users/me` to get user details
5. Maps `activeRole` to internal `user_type` enum
6. Calls `/profiles/me` to get additional profile data
7. Updates Zustand store with complete user object
8. Redirects to dashboard

## Implementation Details

### Shared Callback Handler
All three OAuth providers use the same callback handler (`handleGoogleCallback`) because:
- The token format is the same (JWT from backend)
- User data retrieval process is identical
- Store updates follow the same pattern

### Login Component
The login page ([login.tsx](c:\Users\HP\Desktop\veritalent\components\layout\onboarding\login.tsx)) displays three OAuth buttons:
- "Login with Google" - Calls `authService.googleAuth()`
- "Login with LinkedIn" - Calls `authService.linkedInAuth()`
- "Login with Microsoft SSO" - Calls `authService.microsoftAuth()`

## Security Considerations

1. **Token Security**: JWT tokens are stored in localStorage and Zustand store
2. **HTTPS Required**: OAuth callbacks must use HTTPS in production
3. **State Parameter**: Backend should implement state parameter for CSRF protection
4. **Token Expiry**: Frontend should handle token expiry and refresh
5. **Scope Limits**: Request minimal scopes from OAuth providers
