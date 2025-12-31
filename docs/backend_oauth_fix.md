# Backend Google OAuth Configuration Guide

## Problem
Google is redirecting directly to the frontend (`http://localhost:3000/auth/google/callback`) with an authorization code, but the backend's `/auth/google/callback` endpoint is returning 401 "Invalid credentials" when the frontend tries to exchange the code.

## Root Cause
The Google Cloud Console OAuth callback URL is configured to point to the frontend instead of the backend. This breaks the OAuth flow.

## Solution: Two Approaches

### Approach 1: Backend-First Flow (RECOMMENDED)

This is the standard OAuth flow where the backend handles everything.

#### 1. Google Cloud Console Configuration
Set the OAuth redirect URI to:
```
https://veritalent-server.onrender.com/v1/auth/google/callback
```

For local development:
```
http://localhost:YOUR_BACKEND_PORT/v1/auth/google/callback
```

#### 2. Backend Implementation
The backend's `/auth/google/callback` endpoint should:

```javascript
// Example Node.js/Express implementation
app.get('/v1/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    // 1. Exchange code with Google for access token
    const googleTokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BACKEND_URL}/v1/auth/google/callback`,
      grant_type: 'authorization_code',
    });
    
    const googleAccessToken = googleTokenResponse.data.access_token;
    
    // 2. Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });
    
    const { email, name, picture } = userInfoResponse.data;
    
    // 3. Find or create user in your database
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        profilePicture: picture,
        authProvider: 'google',
      });
    }
    
    // 4. Generate your application's JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // 5. Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${jwtToken}`);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?error=${encodeURIComponent(error.message)}`);
  }
});
```

#### 3. Backend Environment Variables
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BACKEND_URL=https://veritalent-server.onrender.com/v1
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

### Approach 2: Frontend Code Exchange (CURRENT ATTEMPT)

If you want to keep the current Google Console configuration pointing to the frontend, the backend needs to accept the code from the frontend.

#### Backend Implementation
Create an endpoint that accepts the code from the frontend:

```javascript
// POST /v1/auth/google/exchange-code
app.post('/v1/auth/google/exchange-code', async (req, res) => {
  try {
    const { code } = req.body;
    
    // 1. Exchange code with Google for access token
    const googleTokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.FRONTEND_URL}/auth/google/callback`, // Frontend URL!
      grant_type: 'authorization_code',
    });
    
    const googleAccessToken = googleTokenResponse.data.access_token;
    
    // 2. Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });
    
    const { email, name, picture } = userInfoResponse.data;
    
    // 3. Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        profilePicture: picture,
        authProvider: 'google',
      });
    }
    
    // 4. Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // 5. Return token
    res.json({
      success: true,
      data: {
        access_token: jwtToken,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          activeRole: user.activeRole || 'talent',
        },
      },
    });
    
  } catch (error) {
    console.error('Code exchange error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
```

Then update the frontend to call this endpoint instead:

```typescript
// In the callback page, change the fetch URL
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/exchange-code`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ code }),
});
```

## Current Issue: 401 Invalid Credentials

The backend is returning 401, which suggests:
1. The `/auth/google/callback` endpoint exists but is protected by authentication middleware
2. The endpoint expects different parameters
3. The endpoint is not properly implemented

**Recommended Fix**: Remove authentication middleware from the OAuth callback endpoint, or implement Approach 1 (recommended) or Approach 2 above.

## Testing

### Test Approach 1
1. Update Google Console redirect URI to backend
2. Click "Login with Google" in the app
3. Google redirects to backend
4. Backend exchanges code with Google
5. Backend redirects to frontend with token
6. Frontend stores token and redirects to dashboard

### Test Approach 2
1. Keep Google Console redirect URI pointing to frontend
2. Create `/auth/google/exchange-code` endpoint on backend
3. Click "Login with Google" in the app
4. Google redirects to frontend with code
5. Frontend sends code to backend
6. Backend exchanges code with Google
7. Backend returns JWT token
8. Frontend stores token and redirects to dashboard

## Security Notes
- Never expose `GOOGLE_CLIENT_SECRET` to the frontend
- Always validate the authorization code server-side
- Use HTTPS in production
- Set appropriate token expiration times
- Implement token refresh mechanism for long-lived sessions
