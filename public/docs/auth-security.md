# MailVet Authentication Security Documentation

## Overview

This document describes the authentication architecture, token management, and security measures implemented in MailVet.

## Token Architecture

### Access Tokens
- **Purpose**: Short-lived tokens for API authentication
- **Lifetime**: 15 minutes (configurable via `ACCESS_TOKEN_EXPIRES` env var)
- **Storage**: In-memory only (JavaScript variable)
- **Format**: JWT signed with HS256
- **Payload**: `{ userId: string, type: 'access' }`

### Refresh Tokens
- **Purpose**: Long-lived tokens for obtaining new access tokens
- **Lifetime**: 7 days (configurable via `REFRESH_TOKEN_EXPIRES` env var)
- **Storage**: 
  - Client: HttpOnly cookie (not accessible via JavaScript)
  - Server: Hashed (bcrypt) in MongoDB `users.refreshTokenHash`
- **Format**: 64-byte random hex string
- **Rotation**: New refresh token issued on each `/auth/refresh` call

## Cookie Configuration

```javascript
{
  httpOnly: true,              // Prevents XSS attacks
  secure: true,                // HTTPS only in production
  sameSite: 'lax',            // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
}
```

## API Endpoints

### POST /auth/signup
- **Auth**: Firebase ID token
- **Response**: `{ accessToken, user }` + refresh token cookie
- **Errors**: 
  - 400: Validation errors
  - 409: User already exists

### POST /auth/login
- **Auth**: Firebase ID token
- **Response**: `{ accessToken, user }` + refresh token cookie
- **Errors**:
  - 403: Email not verified
  - 404: User not found

### POST /auth/social/google
- **Auth**: Firebase ID token (Google OAuth)
- **Response**: `{ accessToken, user }` + refresh token cookie
- **Behavior**: Creates account if not exists, links if email matches

### POST /auth/refresh
- **Auth**: Refresh token cookie
- **Response**: `{ accessToken, user }` + new refresh token cookie
- **Errors**:
  - 401: No refresh token provided
  - 403: Invalid or expired refresh token

### POST /auth/logout
- **Auth**: None required (uses refresh token cookie if present)
- **Response**: `{ message: 'Logged out successfully' }`
- **Behavior**: Clears cookie and invalidates token in database

## MongoDB Schema

```javascript
// User model additions for refresh tokens
{
  refreshTokenHash: {
    type: String,
    select: false  // Never returned in queries by default
  },
  refreshTokenExpires: {
    type: Date,
    select: false
  }
}
```

## Frontend Implementation

### Token Management (`src/lib/auth.ts`)

```typescript
// Access token stored in memory only
let accessToken: string | null = null;

// Automatic token refresh on API calls
const authenticatedFetch = async (url, options) => {
  let response = await makeRequest(accessToken);
  
  if (response.status === 401 && errorCode === 'TOKEN_EXPIRED') {
    accessToken = await refreshAccessToken();
    response = await makeRequest(accessToken);
  }
  
  return response;
};
```

### Route Protection (`src/components/ProtectedRoute.tsx`)

- **ProtectedRoute**: Redirects to `/access?page=login` if not authenticated
- **GuestOnlyRoute**: Redirects to `/dashboard` if already authenticated
- Both show loading spinner while checking auth status

### Auth Context (`src/components/AuthProvider.tsx`)

Provides global auth state:
- `user`: Current user data
- `isLoading`: Auth check in progress
- `isAuthenticated`: Boolean auth status
- `login(accessToken)`: Set token after successful auth
- `logout()`: Clear tokens and redirect
- `refetch()`: Reload user data

## Security Considerations

### XSS Protection
- Access tokens stored in memory, not localStorage
- Refresh tokens in HttpOnly cookies (inaccessible to JavaScript)

### CSRF Protection
- SameSite=Lax cookie attribute
- Origin validation on sensitive endpoints

### Token Theft Mitigation
- Short access token lifetime (15 min)
- Refresh token rotation on each use
- Server-side token invalidation on logout

### Brute Force Protection
- Rate limiting on auth endpoints
- Account lockout after failed attempts (Firebase)

## Environment Variables

```bash
# Token Configuration
JWT_SECRET=your-jwt-secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# Cookie Security (auto-detected from NODE_ENV)
NODE_ENV=production  # Enables secure cookies
```

## Migration Notes

### From localStorage Tokens

The previous implementation stored JWT session tokens in localStorage:
```typescript
// OLD - Do not use
localStorage.setItem('mailvet_session', token);
```

This has been replaced with:
1. Access token in memory (cleared on page refresh)
2. Refresh token in HttpOnly cookie (persists across sessions)

Users will be logged out once and need to re-authenticate after this update.
