# MailVet Documentation

> Alhamdulillah SaaS Email Validator – available at mailvet.app.

This document outlines the architecture, processes and design choices for **MailVet**, a SaaS platform for email‑address validation. It combines a micro‑service for rotating MailTester API keys, a user‑facing backend, a modern front‑end, and a simple pricing model. The goal is to guide development and ensure consistent implementation across the stack.

---

## 1. Understanding the middle‑layer (MailTester API rotation micro‑service)

- The MailTester key‑manager micro‑service maintains a pool of MailTester subscription keys. It enforces per‑30‑second and daily rate limits and returns an available key via the `GET /key/available` endpoint. Each key record stores the plan type (e.g., **pro** or **ultimate**) and tracks the next time the key may be used.
- To validate an email, your backend first calls `/key/available` to receive a free key. It then calls `https://happy.mailtester.ninja/ninja?email=<email>&key=<subscriptionId>` to perform the actual validation.
- The micro‑service only handles key rotation and rate limiting; it does not manage users or update your SaaS dashboard. It is a private component that your backend calls, acting as a proxy between your service and the MailTester API.

**Key takeaway:** each validation requires two outbound calls — one to the micro‑service for an available key, and a second to MailTester with that key.

---

## 2. High‑level architecture

### Backend layers

1. **User‑facing API** – The core of MailVet, built with **Node.js and the Express framework**, exposes REST endpoints for sign‑up, login, email validation, job management, billing and subscription management.
2. **Key‑rotation micro‑service** – A separately deployed server that manages MailTester subscription keys and enforces usage quotas.
3. **Third‑party API** – MailTester's REST endpoint (`/ninja`).

### Frontend layers

1. **Public website** – `https://mailvet.app` hosts marketing content explaining the value proposition, features and pricing.
2. **Application UI** – `https://dashboard.mailvet.app` is the authenticated interface where users register, log in, upload lists, view progress, and manage their accounts.

### Data stores

- **MongoDB** – Primary data store for users, jobs, results and credit balances. User documents contain fields such as `email`, `passwordHash`, `googleId` (for social login), `emailVerified`, `credits`, `plan`, `apiToken` and `createdAt`. Job documents track uploaded lists, progress, and results.
- **Redis** – Used by the micro‑service for background queues and rate‑limit counters.
- **Billing provider** – Dodo Payments or a similar Merchant of Record handles subscriptions and charges.

### Subdomains

- `mailvet.app` – Marketing pages and documentation.
- `dashboard.mailvet.app` – Authenticated dashboard. After sign‑up or login, users are redirected here.
- `api.mailvet.app/v1` – Hosts your REST API endpoints. It validates API tokens, checks user credits and plans, enqueues validation jobs, and returns results.
- *(Optional)* `internal-key-manager` – Private endpoint for the micro‑service. Not exposed to users.

---

## 3. Deploying and securing the micro‑service

1. **Deployment** – Follow the repository instructions to run the key‑manager on your server or container platform. Supply environment variables for MongoDB and Redis connections, plus your MailTester keys.
2. **Network isolation** – Restrict access so only your backend can call the micro‑service. Deploy it behind a private network or firewall. Do not expose it on the public internet.
3. **Monitoring** – Implement logging and alerts for failures or exhausted keys. The micro‑service should report when a key's quota is close to its daily or 30‑second limit.

---

## 4. User registration & authentication

### 4.1 Dual sign‑up models

MailVet supports two authentication methods:

1. **Google OAuth sign‑up (Gmail)** – For convenience and security. Use an identity provider with a generous free tier.
    - *Recommended providers*:
        - **Clerk**: A hosted auth platform offering pre‑built components and social logins (Google, GitHub, Facebook). Its free plan includes **10,000 Monthly Active Users (MAUs)** and no cost for users who sign up but never return.
        - **Firebase Authentication**: Google's auth service. It's free for the first **50,000 MAUs** and supports email/password and social logins like Google.
        - **LoginRadius**: Their Free Forever plan includes **25,000 MAUs for B2C** or **10,000 MAUs for B2B** applications.
    - During the OAuth flow, the provider returns the user's verified Gmail address and a unique provider ID. Store these along with a generated API token and default credit balance.
2. **Custom email/password sign‑up** – For users who prefer not to use social login.
    - Accept an email and password. Hash the password using a secure algorithm (e.g., bcrypt). Set `emailVerified=false` and generate a verification token.
    - Send a verification email via **Resend** with a link containing the token. When the user clicks, mark `emailVerified=true`.

### 4.2 Session management

- Use short‑lived JWTs or secure cookies for authentication to the dashboard. Refresh tokens can be stored in Redis for revocation.

### 4.3 Password reset

- Provide a "Forgot password?" link on the login page. When triggered, generate a time‑limited reset token, send it via Resend, and allow the user to set a new password. Update the stored hash and invalidate existing sessions.

### 4.4 Credits on sign‑up

- Each new account (regardless of sign‑up method) starts with **50 credits** on the free plan. Decrement the `credits` field by one for each single email validation. When credits reach zero, deny further validations until the user upgrades or purchases more credits.

---

## 5. API token generation and usage

1. **Creation** – Upon account creation, generate a random API token (e.g., UUID or cryptographically secure string). Store a hashed version in the user document.
2. **Regeneration** – Expose an endpoint on `api.mailvet.app/v1/auth/refresh-token` so users can rotate their token via the dashboard.
3. **Usage** – Require the token in requests to `/validate` or `/batch`. Authenticate the token, verify the user's plan and credits, and check rate limits. If valid, proceed with validation and deduct credits if necessary.

---

## 6. Email validation workflow

1. **Single validation (`POST /validate`)**
    - Validate the request body (email syntax). If invalid, return an error without charging credits.
    - Call the micro‑service `/key/available` to obtain a MailTester key.
    - Use the key to query MailTester: `https://happy.mailtester.ninja/ninja?email=<email>&key=<subscriptionId>`.
    - Record the response fields (`code`, `message`, `user`, `domain`, `mx`, etc.) in a result document. Deduct one credit (free plan) or log usage for paid plans.
    - Return the result to the client.
2. **Batch validation (`POST /batch`)**
    - Accept a CSV or plain text file from paid users. Use presigned URLs (e.g., AWS S3) or direct upload to your server. Validate file size and type.
    - Parse and deduplicate email addresses server‑side. Create a job document with status `pending`, list length and initial progress.
    - Enqueue tasks in a worker queue (e.g., RabbitMQ, BullMQ). Each worker repeats the single‑validation steps for each email. Workers must respect the micro‑service's rate limits and wait if all keys are cooling down.
    - Update job status and progress counts. When complete, write results to a CSV file and store its location in the job document. Notify the user via email or in‑app notification.
3. **Job status endpoint (`GET /jobs/{jobId}`)**
    - Return the job's current progress, total emails, valid/invalid counts, and a download link if complete.
    - Optionally, allow users to register a webhook to receive status updates.

---

## 7. Frontend design

### 7.1 Dashboard

- **Upload panel** – Let users paste a single email or upload a CSV (paid only). Show progress bars and status updates in real time using WebSockets or polling.
- **Results table** – Display columns for `email`, `validity code` (`ok`, `ko`, `mb`), `message`, `user`, and `domain`. Provide filtering (e.g., show only valid emails) and an export button for completed jobs.
- **Usage & credits** – Show remaining credits and a summary of validations performed. For paid plans, show usage metrics (emails processed this billing period).
- **Account management** – Allow users to regenerate API tokens, view subscription status, and see invoices from Dodo Payments.
- **Billing & plans** – Display available subscription tiers. Trigger the Dodo Payments checkout when the user upgrades.

### 7.2 Public site

- Include a landing page with clear messaging, features, pricing, and documentation. Link to sign‑up and login pages under `dashboard.mailvet.app`.
- Host your API documentation under `https://mailvet.app/docs`, describing each endpoint, parameters, response format and error codes.

---

## 8. Pricing and feature gating

### 8.1 Free Plan
| Feature | Details |
| --- | --- |
| **Price** | $0 |
| **Email Credits** | 50 credits (one-time) |
| **Single Email Validation** | ✅ Yes |
| **Rate Limit** | 1 request/second |
| **CSV Bulk Upload** | ❌ No |
| **API Access** | ❌ No |
| **Priority Support** | ❌ No |

### 8.2 Ultimate Plan (Most Popular)
| Feature | Details |
| --- | --- |
| **Price** | **$29.99/month** (90% OFF from $299/month - Limited Time!) |
| **Email Validations** | ✅ **Unlimited** verifications per month |
| **CSV Bulk Upload** | ✅ Yes - Max 10,000 rows per file |
| **Rate Limit** | 3 emails/second |
| **Concurrent Files** | Max 2 concurrent file uploads |
| **Detailed Analytics** | ✅ Yes |
| **Priority Support** | ✅ Yes |
| **API Access** | ❌ No (Dashboard only) |

### 8.3 Enterprise Plan
| Feature | Details |
| --- | --- |
| **Price** | Custom (Contact Sales) |
| **Email Validations** | ✅ **Unlimited** |
| **Everything in Ultimate** | ✅ All Ultimate features included |
| **Full API Access** | ✅ Yes - Programmatic access |
| **Processing Speed** | Super fast processing |
| **Concurrent Files** | Unlimited concurrent file uploads |
| **Dedicated Account Manager** | ✅ Yes |
| **Custom Integrations & SLA** | ✅ Yes |

### 8.4 Subscription management
- Integrate Dodo Payments' checkout for seamless subscription purchases. Dodo acts as the Merchant of Record and handles VAT, currency conversion and compliance. Customers pay via credit card or local wallets.
- Store plan information in the user document (`plan`, `creditsRemaining`, `renewalDate`). Use webhooks from Dodo to update plan status on successful payment or cancellation.

---

## 9. Billing & compliance

- All payment and tax handling is delegated to Dodo Payments. Dodo supports payments in 150+ countries, 100+ currencies and integrates local payment methods like mobile wallets. It collects and remits VAT/GST on your behalf, allowing MailVet to operate globally without a foreign entity.
- Use HTTPS for all endpoints and store sensitive data (password hashes, API tokens) securely. Employ environment variables for secrets.
- Implement rate limiting on your own API to prevent abuse.
- Provide a privacy policy and terms of service explaining data handling practices, retention periods, and user rights.

---

## 10. Recommendations for hosted authentication providers

- **Clerk** – Free for up to **10,000 monthly active users**, supports Google, GitHub and email/password logins, and includes pre‑built UI components.
- **Firebase Authentication** – Free for the first **50,000 MAUs** with standard providers (email/password, Google, Facebook, etc.). After 50k users, you upgrade to Identity Platform and pay per MAU. Phone/SMS authentication is not free.
- **LoginRadius** – Free Forever plan includes **25,000 MAUs** for B2C or **10,000 MAUs** for B2B and unlimited social logins.

These platforms satisfy the requirement of handling at least 10,000 free users for Google authentication. Choose one based on integration ease, pricing after the free tier, and available features.

---

## 11. Additional best practices

- **Documentation** – Maintain clear API and user guides. Provide sample code using **Node.js with Express** (and optionally other languages like Python or PHP) demonstrating how to call `/validate` and `/batch` with the API token.
- **Security** – Implement input sanitization, CORS policies, CSRF protection, and store data encrypted at rest. Use secure cookies and ensure JWTs are signed with strong keys.
- **Observability** – Collect metrics on API response times, error rates, and job throughput. Use logs to identify misuse or unusual patterns.
- **Scalability** – Design your system with horizontal scaling in mind. Use container orchestration or serverless functions to handle bursts of validation requests.
- **Support** – Provide email or chat support for users, along with a knowledge base and FAQ.

---

## 12. API endpoints and front‑end routes

MailVet exposes a structured set of REST endpoints under the `https://api.mailvet.app/v1/` base path. These endpoints are organized by function (authentication, user management, validation, jobs and billing) and, for rate‑limited access, by subscription tier. Your front‑end routes mirror this hierarchy so that navigation between sign‑up, login, dashboard and bulk upload is clear and intuitive.

### 12.1 Authentication and user management endpoints

| Method & Path | Description |
| --- | --- |
| `POST /auth/signup` | Register a new account using email/password. Accepts a JSON body with `email` and `password`, hashes the password, creates the user record, sets `emailVerified=false` and sends a verification email via Resend. |
| `POST /auth/social/google` | Handles Google OAuth sign‑ups and logins. Exchanges the authorization code for user info from the OAuth provider, creates or updates a user document with the provider ID and email, and returns a session token. |
| `POST /auth/login` | Log in with email/password. Returns a session token on success. Rejects unverified accounts. |
| `GET /auth/verify-email` | Accepts a `token` query parameter from the Resend verification link and sets `emailVerified=true` for the matching user. |
| `POST /auth/password-reset` | Request a password reset. Accepts `email` in the body and sends a reset link to the user. |
| `POST /auth/reset-password` | Set a new password using a `token` from the reset link and a new password in the body. |
| `POST /auth/refresh-token` | Generate a new API token for the authenticated user. Updates the hashed token in the database. |
| `GET /account` | Return the current user's profile, plan name, remaining credits and usage statistics. |
| `PATCH /account` | Update mutable profile fields such as name or contact information. |

### 12.2 Validation and job endpoints

MailVet provides dedicated paths per subscription tier to simplify rate limiting and pricing. All endpoints require a valid API token (sent via header or query parameter) and enforce the user's current plan and credit balance.

| Plan | Endpoint | Rate Limit | Price | Features |
| --- | --- | --- | --- | --- |
| **Free** | `POST /free/validate` | 1 email/second | $0 | Single email only, 50 credits |
| **Ultimate** | `POST /ultimate/validate` | 3 emails/second | $29.99/month | Unlimited validations, CSV upload (10K rows max), 2 concurrent files |
| **Enterprise** | `POST /enterprise/validate` | 10+ emails/second | Custom | Full API access, unlimited concurrent files, custom SLA |

Additional endpoints common to all paid plans:

| Method & Path | Description |
| --- | --- |
| `POST /{tier}/batch` | Upload a CSV or text file for bulk validation. Only available to paid tiers (`ultimate` and `enterprise`). Validates each email via the micro‑service, respecting per‑tier rate limits, and stores results. Returns a job ID. |
| `GET /jobs/{jobId}` | Retrieve status and statistics for a specific job. Returns counts of processed emails, current state (`pending`, `in‑progress`, `complete`), and a download link for the results if finished. |
| `GET /plans` | Return a list of available subscription plans, including `free`, `ultimate` and `enterprise`, along with rate limits and pricing. |

In addition to these tier‑specific paths, MailVet exposes **simplified validation endpoints** that abstract away plan details:

- **`POST /verify-email`** – Validate a single email address. This endpoint automatically routes the request to the correct tier‑specific path (`/free/validate`, `/ultimate/validate` or `/enterprise/validate`), applies the user's rate limit and deducts one credit (for free plan).
- **`POST /verify-list`** – Validate a list of email addresses from a CSV or plain text file. Only available to paid tiers (`ultimate` and `enterprise`), it automatically calls the appropriate batch endpoint and returns a job identifier.

Use these simplified endpoints if you prefer not to reference tier‑specific paths directly.

### 12.3 Billing and payment endpoints

Billing is handled through Dodo Payments' hosted checkout and webhooks. MailVet's API includes lightweight endpoints to initiate a checkout session and handle asynchronous updates:

| Method & Path | Description |
| --- | --- |
| `POST /billing/checkout` | Initiate a new subscription purchase or plan upgrade. Accepts a `plan` in the body (`ultimate` or `enterprise`) and returns a redirect URL to Dodo Payments' hosted checkout. |
| `POST /billing/webhook` | Receive webhooks from Dodo Payments for events such as successful payments, subscription renewals, cancellations or failed charges. Updates the user's `plan`, `credits`, `renewalDate` and `billingStatus` fields accordingly. |

### 12.4 Front‑end routes

MailVet uses parameterised URLs to direct users to different screens on the marketing domain (`mailvet.app`) and the authenticated dashboard (`dashboard.mailvet.app`). Each front‑end route is tied to one or more API endpoints described above:

| Route | Location | Purpose |
| --- | --- | --- |
| `/access?page=signup` | `mailvet.app` | Sign‑up page with options for Google OAuth and email/password registration. Internally calls `POST /auth/signup` or initiates the Google OAuth flow. |
| `/access?page=login` | `mailvet.app` | Login page for existing users. Calls `POST /auth/login`. |
| `/access?page=forgot-password` | `mailvet.app` | Request a password reset. Calls `POST /auth/password-reset`. |
| `/access?page=reset-password` | `mailvet.app` | Form for setting a new password using the reset token. Calls `POST /auth/reset-password`. |
| `/access?page=verify-email` | `mailvet.app` | Landing page users reach after clicking the Resend verification link. Calls `GET /auth/verify-email`. |
| `/dashboard` | `dashboard.mailvet.app` | Main overview showing credit balance, usage statistics and recent jobs. Loads data from `GET /account`. |
| `/?page=verify-email` | `dashboard.mailvet.app` | Single email validation view inside the dashboard. Submits to `POST /verify-email` and displays the result in a table. |
| `/?page=verify-list` | `dashboard.mailvet.app` | Bulk list validation view (available to Ultimate and Enterprise users). Allows CSV upload and submits to `POST /verify-list`. |
| `/?page=verify-reports` | `dashboard.mailvet.app` | Validation reports page showing the history of previous jobs. Fetches job details via `GET /jobs/{jobId}` and `GET /account`. |
| `/dashboard/plan` | `dashboard.mailvet.app` | Plan management screen. Lists current plan and available upgrades. Calls `GET /plans` and triggers `POST /billing/checkout` when the user upgrades. |
| `/api-token` | `dashboard.mailvet.app` | Shows the user's API token with an option to regenerate via `POST /auth/refresh-token`. |
| `/docs` | `mailvet.app` | Links to the API documentation hosted at `https://mailvet.app/docs`, which describes how to consume these endpoints with code examples. |

---

## 13. Quick reference: endpoints and routes

To simplify integration, this section summarizes all of the key backend API endpoints and front‑end routes described above.

### 13.1 Backend API endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/auth/signup` | **POST** | Register a new user with email/password. Sends a verification email via Resend. |
| `/auth/social/google` | **POST** | Handle Google OAuth sign‑up and sign‑in flows. |
| `/auth/login` | **POST** | Authenticate a user via email/password and issue an access/refresh token pair. |
| `/auth/verify-email` | **GET** | Mark a user's email as verified using a token from the verification link. |
| `/auth/password-reset` | **POST** | Initiate a password reset by sending a reset link to the user. |
| `/auth/reset-password` | **POST** | Set a new password using a reset token. |
| `/auth/refresh-token` | **POST** | Regenerate the user's API token or access token. |
| `/account` | **GET** | Retrieve profile information, plan details, credit balance and usage. |
| `/account` | **PATCH** | Update mutable profile fields (name, contact info, etc.). |
| `/free/validate` | **POST** | Validate a single email for Free plan users (rate‑limited to 1 request/second). |
| `/ultimate/validate` | **POST** | Validate a single email for Ultimate plan users (3 requests/second). |
| `/enterprise/validate` | **POST** | Validate a single email for Enterprise plan users (10+ requests/second). |
| `/{tier}/batch` | **POST** | Validate a list of emails for Ultimate and Enterprise users. Accepts CSV or text uploads and returns a job ID. |
| `/jobs/{jobId}` | **GET** | Check the status and progress of a batch validation job. |
| `/plans` | **GET** | List available subscription plans, rate limits and pricing. |
| `/verify-email` | **POST** | Simplified endpoint to validate a single email address, automatically selecting the correct tier path. |
| `/verify-list` | **POST** | Simplified endpoint to validate a list of emails, routing to the appropriate batch handler. |
| `/billing/checkout` | **POST** | Initiate a plan purchase or upgrade via Dodo Payments. |
| `/billing/webhook` | **POST** | Receive payment and subscription events from Dodo Payments. Updates the user's plan and credit balance. |

### 13.2 Front‑end routes

| Route | Location | Purpose |
| --- | --- | --- |
| `/access?page=signup` | `mailvet.app` | Sign‑up page that calls `POST /auth/signup` or triggers the Google OAuth flow. |
| `/access?page=login` | `mailvet.app` | Login page that calls `POST /auth/login`. |
| `/access?page=forgot-password` | `mailvet.app` | Request a password reset by calling `POST /auth/password-reset`. |
| `/access?page=reset-password` | `mailvet.app` | Set a new password using a token; calls `POST /auth/reset-password`. |
| `/access?page=verify-email` | `mailvet.app` | Confirms an email address via `GET /auth/verify-email`. |
| `/dashboard` | `dashboard.mailvet.app` | Main application overview; fetches account data from `GET /account`. |
| `/?page=verify-email` | `dashboard.mailvet.app` | Single email validation view; posts to `POST /verify-email` and displays results. |
| `/?page=verify-list` | `dashboard.mailvet.app` | List validation view for Ultimate/Enterprise users; posts to `POST /verify-list`. |
| `/?page=verify-reports` | `dashboard.mailvet.app` | History of past validations; queries jobs via `GET /jobs/{jobId}`. |
| `/dashboard/plan` | `dashboard.mailvet.app` | Plan management; lists available tiers, checks current plan via `GET /plans`, and initiates upgrades via `POST /billing/checkout`. |
| `/api-token` | `dashboard.mailvet.app` | API token management; allows the user to regenerate their token via `POST /auth/refresh-token`. |
| `/docs` | `mailvet.app` | Static documentation for developers, including code examples for all endpoints. |

---

This quick reference can serve as a checklist while implementing your Node.js/Express backend and front‑end routes, ensuring all necessary functionality is wired up correctly.

With this comprehensive blueprint, you can implement MailVet confidently. It covers architecture, authentication, domains, micro‑service integration, pricing, and compliance. The recommended auth providers ensure you can offer Google and email/password login for at least 10,000 free users, while Dodo Payments handles global billing and compliance. Follow the outlined steps to build a secure, scalable, and user‑friendly email validation SaaS.
