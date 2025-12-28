# Dodo Payments integration (subscriptions) — MailVet (step-by-step)

This is the **essential** guide to integrate Dodo Payments subscriptions into MailVet.

Your current webhook endpoint:

- `https://api.mailvet.app/v1/billing/webhook`

Your subscribed events:

- `payment.failed`
- `payment.succeeded`
- `subscription.cancelled`
- `subscription.renewed`
- `subscription.created`

Goals:

- Automatically handle new subscriptions, upgrades, downgrades, cancellations
- Use Dodo proration rules (no manual math in your app)
- Handle dunning (failed payments) and keep access in sync
- Update MongoDB + UI correctly

---

## 1) Decide your policies (do this first)

Recommended default SaaS policies:

- **Upgrade**: immediate + proration ON
- **Downgrade**: apply at period end
- **Cancel**: cancel at period end
- **Dunning**: set subscription to `past_due` on payment failure; require user to update payment method

> If you choose different policies, only the “when to change access” rules below change.

---

## 2) Database updates (MongoDB)

Store a **subscription snapshot** on each user (fast access checks).

### 2.1 Required fields on User

- `dodoCustomerId`: string | null
- `dodoSubscriptionId`: string | null
- `dodoProductId`: string | null
- `dodoCancelAtNextBillingDate`: boolean
- `plan`: `'free' | 'ultimate'`
- `billingStatus`: `'none' | 'active' | 'past_due' | 'cancelled'`
- `renewalDate`: Date | null

Optional (recommended):

- Webhook idempotency table keyed by `webhook-id` (implemented as `WebhookEvent`)

### 2.2 Defaults

- New user: `plan='free'`, `billingStatus='none'`, `credits=100`
- Paid user: `plan!='free'`, `billingStatus='active'`

In MailVet today:

- Free user: `plan='free'`, `billingStatus='none'`, `credits=100`
- Paid user: `plan='ultimate'`, `billingStatus='active'`, credits treated as **unlimited**

### 2.3 “Unlimited access” rule

Do NOT store “Infinity credits”.

Instead:

- Treat the user as **unlimited** when:
   - `billingStatus === 'active'` and `plan !== 'free'`

---

## 2.4 Required environment variables

- `DODO_PAYMENTS_API_KEY` (server-to-server API)
- `DODO_WEBHOOK_SECRET` (Standard Webhooks signing secret; starts with `whsec_...`)
- `DODO_PRODUCT_ID_ULTIMATE` (Dodo product id for the paid plan)

---

## 3) UI updates (Billing screen)

### 3.1 What to display

- Current plan name
- Status badge (Active / Past due / Cancelled)
- Renewal date (from `renewalDate`)

### 3.2 What buttons to show

- If `plan==='free'`: **Subscribe**
- If `plan!=='free'`: **Cancel** (cancels at end of billing period)
- If `billingStatus==='past_due'`:
   - Banner: “Payment failed — update your payment method”
   - Button: **Update payment method** (if you add a portal flow)

### 3.3 After returning from Dodo

- Show “Finishing setup…”
- Poll your backend account endpoint until it shows `billingStatus='active'` (or timeout).

---

## 4) Webhook processing (how to update DB from your events)

### 4.1 Critical prerequisites

1) **Signature verification**
- Verify that the request really came from Dodo.

MailVet uses Standard Webhooks verification via `standardwebhooks` and requires:

- `webhook-id`
- `webhook-timestamp`
- `webhook-signature`

2) **Idempotency**
- Dodo can deliver the same event multiple times.
- Store processed `webhook-id` values and ignore duplicates.

3) **User mapping**

To update the right user, you must reliably map the webhook payload to a user using ONE approach:

- Recommended: find user by `dodoCustomerId`
- Best if supported: metadata includes internal user id
- Fallback: email match (least reliable)

### 4.2 General DB update rule

From every webhook payload, update these fields when present:

- `dodoCustomerId`
- `dodoSubscriptionId`
- `dodoProductId`
- `plan` (map Dodo plan/price ID → your plan key)
- `dodoCancelAtNextBillingDate`
- `renewalDate`

Then update `billingStatus` and access using the event-specific rules below.

### 4.3 Event → DB updates (your exact events)

Use this mapping:

- `subscription.created`
   - set `plan` from `metadata.plan` (expected: `ultimate`)
   - set `billingStatus` from `data.status` (or default to `active`)
   - set `renewalDate` from `next_billing_date`
   - store `dodoCustomerId`, `dodoSubscriptionId`, `dodoProductId`

- `subscription.renewed`
   - keep `billingStatus='active'`
   - update `renewalDate`

- `subscription.cancelled`
   - set `billingStatus='cancelled'`
   - set `plan='free'` and `credits=100`

- `payment.succeeded`
   - set `billingStatus='active'`

- `payment.failed`
   - set `billingStatus='past_due'`

---

## 5) Lifecycle flows (what happens in DB + UI)

### A) New subscription

1) User pays in Dodo.
2) Webhook: `subscription.created` (and/or `payment.succeeded`).
3) DB:
- `plan=<paid>`
- `billingStatus='active'`
- `renewalDate=<from Dodo>`
4) UI:
- Unlock unlimited features.

### D) Cancel (recommended: cancel at period end)

1) User cancels from the app.
2) Backend calls Dodo: PATCH `/subscriptions/{subscription_id}` with `cancel_at_next_billing_date=true`.
3) User stays paid until `renewalDate`.
4) At period end: webhook `subscription.cancelled`.
5) DB switches to Free (`plan='free'`, `credits=100`).

### E) Payment fail → dunning

1) Webhook: `payment.failed`.
2) DB:
- `billingStatus='past_due'`
3) UI:
- Banner + “Update payment method” button.
4) Recovery: `payment.succeeded`.
5) DB:
- `billingStatus='active'`
6) UI:
- Remove banner and restore unlimited.

---

## 6) Testing checklist

- New subscription → becomes `active` via `subscription.created`
- Cancel at period end → `cancel_at_next_billing_date=true` then `subscription.cancelled`
- Payment failed → `past_due`
- Payment recovered → back to `active`

---

## 6.1) Customer emails (how to confirm purchase)

There are two separate email categories:

### A) Invoice emails (billing provider)

- Dodo can generate invoices for successful payments and email them to the customer.
- Customers can also be re-sent an invoice from the Dodo dashboard **Invoices** section.

### B) “Your purchase is confirmed” emails (your product)

MailVet sends a product confirmation email via Resend when subscription events arrive.

**Where it’s implemented**

- Webhook endpoint: `POST /v1/billing/webhook`
- Triggers:
   - `subscription.created` → sends “Purchase confirmed / plan active”
   - `subscription.renewed` → sends “Subscription renewed”

**Code locations**

- Backend webhook handler: [backend/src/controllers/billingController.js](../../backend/src/controllers/billingController.js)
- Email sender (Resend): [backend/src/services/emailService.js](../../backend/src/services/emailService.js)

**Required environment variables**

- `RESEND_API_KEY` (required to actually send)
- `EMAIL_FROM` (optional, default: `MailVet <send@mailvet.app>`)
- `DASHBOARD_URL` (recommended; button destination)
- `FRONTEND_URL` (fallback for dashboard link)

---

## 6.2) Quick test (send yourself a confirmation email)

1) Ensure your user exists in MongoDB and note the `userId`.
2) Send a test webhook event to your backend:

PowerShell example:

```powershell
$body = @{ 
   type = 'subscription.created'
   data = @{ 
      metadata = @{ userId = 'REPLACE_USER_ID'; plan = 'ultimate' }
      next_billing_date = (Get-Date).AddDays(30).ToString('o')
      status = 'active'
      subscription_id = 'sub_test_123'
      product_id = 'prod_test_ultimate'
      customer = @{ customer_id = 'cus_test_123'; email = 'test@example.com'; name = 'Test User' }
   }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Method Post -Uri 'https://api.mailvet.app/v1/billing/webhook' -ContentType 'application/json' -Body $body
```

3) Check backend logs for an email send success/failure entry.

Note: If you haven’t configured `RESEND_API_KEY`, the webhook will still process DB updates, but the confirmation email will fail to send.

---

## 7) What you must confirm from Dodo (so the mapping is perfect)

To make the DB updates precise, confirm from Dodo payloads:

- What fields contain: `subscription_id`, `product_id`, and `customer.customer_id`
- Where the subscription object lives in the payload
- Exact names for: `next_billing_date`, `cancel_at_next_billing_date`, and `status`
- Standard Webhooks headers present: `webhook-id`, `webhook-timestamp`, `webhook-signature`

If you paste one sample webhook JSON for `subscription.created` and `payment.failed`, you can lock the mapping 1:1.
