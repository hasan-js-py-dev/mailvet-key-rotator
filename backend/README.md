# MailVet Backend API

Node.js/Express backend for MailVet authentication, account management, billing, and admin diagnostics.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Firebase Admin SDK
- **Email**: Resend
- **Security**: Helmet, CORS, Rate Limiting

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `MONGODB_URI` | MongoDB connection string (use `/mailvet` as the database name) |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key |
| `RESEND_API_KEY` | Resend API key for emails |
| `EMAIL_FROM` | From email address |
| `JWT_SECRET` | Secret key for JWT signing |
| `FRONTEND_URL` | Frontend URL for CORS & email links |
| `DASHBOARD_URL` | Dashboard URL |

### 3. Firebase Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Copy `project_id`, `client_email`, and `private_key` to `.env`

### 4. Resend Setup

1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain
3. Create API key and add to `.env`

### 5. Run Development Server

```bash
npm run dev
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/auth/signup` | Register with email/password |
| POST | `/v1/auth/social/google` | Google OAuth login |
| POST | `/v1/auth/login` | Login with Firebase token |
| GET | `/v1/auth/verify-email` | Verify email with token |
| POST | `/v1/auth/password-reset` | Request password reset |
| POST | `/v1/auth/reset-password` | Set new password |
| POST | `/v1/auth/refresh-token` | Regenerate API token |

### Account

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/account` | Get user profile |
| PATCH | `/v1/account` | Update profile |
| GET | `/v1/account/usage` | Get usage stats |

### Validation

Validation and bulk jobs have been removed. This backend now focuses on authentication, account management, billing, and admin diagnostics.

### Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/billing/checkout` | Initiate checkout |
| POST | `/v1/billing/webhook` | Payment webhooks |
| GET | `/v1/billing/status` | Get billing status |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/admin/email-logs` | Fetch recent email logs |
| DELETE | `/v1/admin/email-logs` | Clear email logs |
| GET | `/v1/admin/users/lookup?email=` | Lookup user by email |

## Authentication Flow

### Email/Password Signup

1. Frontend creates user in Firebase Auth
2. Frontend sends Firebase ID token to `/v1/auth/signup`
3. Backend verifies token, creates MongoDB user, sends verification email
4. User clicks email link → `/v1/auth/verify-email`
5. Backend marks email as verified

### Google OAuth

1. Frontend triggers Google sign-in via Firebase
2. Frontend sends Firebase ID token to `/v1/auth/social/google`
3. Backend verifies token, creates/updates MongoDB user
4. Returns session JWT

### Session Management

- All authenticated requests use JWT in `Authorization: Bearer <token>` header
- JWTs expire (configurable)

## MongoDB Collections

- **users** - User accounts, credits, plans

## Security

- Helmet.js for HTTP security headers
- CORS restricted to configured origins
- Rate limiting on all endpoints
- Password hashing with bcrypt
- JWT for session management

## License

Proprietary - MailVet
