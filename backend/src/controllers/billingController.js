const User = require('../models/User');
const WebhookEvent = require('../models/WebhookEvent');
const { sendPurchaseConfirmationEmail } = require('../services/emailService');
const { getDodoClient } = require('../services/dodoClient');
const { Webhook } = require('standardwebhooks');

const PAID_PLAN_KEY = 'ultimate';

const getDashboardUrl = () => {
  return (
    process.env.DASHBOARD_URL ||
    process.env.FRONTEND_URL ||
    // dev fallback
    'http://localhost:5173'
  );
};

const toDateOrUndefined = (value) => {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d;
};

const mapSubscriptionStatusToBillingStatus = (status) => {
  switch (status) {
    case 'active':
    case 'pending':
      return 'active';
    case 'cancelled':
      return 'cancelled';
    case 'failed':
    case 'expired':
      return 'past_due';
    case 'on_hold':
      return 'past_due';
    default:
      return undefined;
  }
};

const inferPlanForSubscription = (subscription) => {
  const metadataPlan = subscription?.metadata?.plan;
  if (metadataPlan === 'ultimate') return 'ultimate';
  if (metadataPlan === 'free') return 'free';

  const paidProductId = process.env.DODO_PRODUCT_ID_ULTIMATE;
  if (paidProductId && subscription?.product_id === paidProductId) {
    return 'ultimate';
  }

  return undefined;
};

const findUserForEvent = async (data) => {
  const metadata = data?.metadata || {};
  const userId = metadata.userId;
  if (userId) {
    return User.findById(userId);
  }

  const email = data?.customer?.email || metadata.email;
  if (email) {
    return User.findOne({ email: String(email).toLowerCase().trim() });
  }

  return null;
};

const checkout = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (plan !== PAID_PLAN_KEY) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    if (user.plan === plan && user.billingStatus === 'active') {
      return res.status(400).json({ error: 'Already on this plan' });
    }

    const productId = process.env.DODO_PRODUCT_ID_ULTIMATE;
    if (!productId) {
      return res.status(500).json({ error: 'Missing DODO_PRODUCT_ID_ULTIMATE' });
    }

    const client = await getDodoClient();

    const returnUrl = `${getDashboardUrl()}/dashboard/settings?tab=billing`;

    const checkoutSession = await client.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      allowed_payment_method_types: ['credit', 'debit'],
      customer: {
        email: user.email,
        name: user.name || undefined,
      },
      metadata: {
        userId: String(user._id),
        plan: PAID_PLAN_KEY,
      },
      return_url: returnUrl,
    });

    if (!checkoutSession?.checkout_url) {
      return res.status(502).json({ error: 'Failed to create checkout session' });
    }

    return res.json({
      checkoutUrl: checkoutSession.checkout_url,
      plan,
      message: 'Redirect to payment provider',
    });
  } catch (error) {
    return next(error);
  }
};

const cancel = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.plan === 'free') {
      return res.status(400).json({ error: 'No active paid plan to cancel' });
    }

    if (!user.dodoSubscriptionId) {
      return res.status(400).json({ error: 'No subscription id found for this account' });
    }

    const client = await getDodoClient();

    const updatedSubscription = await client.subscriptions.update(user.dodoSubscriptionId, {
      cancel_at_next_billing_date: true,
      metadata: {
        userId: String(user._id),
        plan: user.plan,
      },
    });

    user.dodoCancelAtNextBillingDate = Boolean(updatedSubscription?.cancel_at_next_billing_date);
    user.renewalDate =
      toDateOrUndefined(updatedSubscription?.next_billing_date) ||
      toDateOrUndefined(user.renewalDate);
    user.planUpdatedAt = new Date();
    await user.save();

    return res.json({
      message: 'Cancellation scheduled for end of billing period.',
      plan: user.plan,
      billingStatus: user.billingStatus,
      renewalDate: user.renewalDate,
      planUpdatedAt: user.planUpdatedAt,
      cancelAtNextBillingDate: user.dodoCancelAtNextBillingDate,
    });
  } catch (error) {
    return next(error);
  }
};

const webhook = async (req, res) => {
  try {
    const secret = process.env.DODO_WEBHOOK_SECRET;
    const shouldVerify =
      Boolean(secret) &&
      (process.env.NODE_ENV === 'production' || Boolean(req.header('webhook-signature')));

    if (shouldVerify && !req.rawBody) {
      return res.status(400).json({ error: 'Missing raw body for verification' });
    }

    const event = shouldVerify
      ? new Webhook(secret).verify(req.rawBody, {
          'webhook-id': req.header('webhook-id') || '',
          'webhook-timestamp': req.header('webhook-timestamp') || '',
          'webhook-signature': req.header('webhook-signature') || '',
        })
      : req.body;

    const webhookId = req.header('webhook-id');
    if (webhookId) {
      try {
        await WebhookEvent.create({ webhookId });
      } catch (error) {
        if (error && error.code === 11000) {
          return res.json({ received: true, deduped: true });
        }
        throw error;
      }
    }

    console.log('Billing webhook received:', event?.type);

    switch (event?.type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data);
        break;
      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data);
        break;
      case 'subscription.renewed':
        await handleSubscriptionRenewed(event.data);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.data);
        break;
      default:
        console.log('Unhandled webhook event:', event?.type);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ error: 'Webhook processing failed' });
  }
};

async function handlePaymentSucceeded(data) {
  const user = await findUserForEvent(data);
  if (!user) return;

  const nextPlan = data?.metadata?.plan || user.plan;
  if (nextPlan) {
    user.plan = nextPlan;
  }

  user.billingStatus = 'active';
  user.planUpdatedAt = new Date();
  await user.save();

  console.log(`Payment succeeded for user ${user._id}`);
}

async function handleSubscriptionCreated(data) {
  const user = await findUserForEvent(data);
  if (!user) return;

  const nextPlan = inferPlanForSubscription(data) || data?.metadata?.plan;
  if (nextPlan) {
    user.plan = nextPlan;
  }

  user.billingStatus = mapSubscriptionStatusToBillingStatus(data?.status) || 'active';
  user.renewalDate =
    toDateOrUndefined(data?.next_billing_date) ||
    toDateOrUndefined(data?.currentPeriodEnd) ||
    toDateOrUndefined(data?.current_period_end);

  user.dodoCustomerId = data?.customer?.customer_id || user.dodoCustomerId;
  user.dodoSubscriptionId = data?.subscription_id || user.dodoSubscriptionId;
  user.dodoProductId = data?.product_id || user.dodoProductId;
  user.dodoCancelAtNextBillingDate = Boolean(data?.cancel_at_next_billing_date);

  user.planUpdatedAt = new Date();
  await user.save();

  await sendPurchaseConfirmationEmail({
    email: user.email,
    name: user.name,
    plan: user.plan,
    kind: 'purchase',
    renewalDate: user.renewalDate,
  });

  console.log(`Subscription created for user ${user._id}`);
}

async function handleSubscriptionCancelled(data) {
  const user = await findUserForEvent(data);
  if (!user) return;

  user.billingStatus = 'cancelled';
  user.plan = 'free';
  user.credits = 100;
  user.renewalDate = undefined;
  user.dodoCancelAtNextBillingDate = false;
  user.planUpdatedAt = new Date();
  await user.save();

  console.log(`Subscription cancelled for user ${user._id}`);
}

async function handleSubscriptionRenewed(data) {
  const user = await findUserForEvent(data);
  if (!user) return;

  user.billingStatus = mapSubscriptionStatusToBillingStatus(data?.status) || 'active';
  user.renewalDate =
    toDateOrUndefined(data?.next_billing_date) ||
    toDateOrUndefined(data?.currentPeriodEnd) ||
    toDateOrUndefined(data?.current_period_end);
  user.dodoCustomerId = data?.customer?.customer_id || user.dodoCustomerId;
  user.dodoSubscriptionId = data?.subscription_id || user.dodoSubscriptionId;
  user.dodoProductId = data?.product_id || user.dodoProductId;
  user.dodoCancelAtNextBillingDate = Boolean(data?.cancel_at_next_billing_date);
  user.planUpdatedAt = new Date();
  await user.save();

  await sendPurchaseConfirmationEmail({
    email: user.email,
    name: user.name,
    plan: user.plan,
    kind: 'renewal',
    renewalDate: user.renewalDate,
  });

  console.log(`Subscription renewed for user ${user._id}`);
}

async function handlePaymentFailed(data) {
  const user = await findUserForEvent(data);
  if (!user) return;

  user.billingStatus = 'past_due';
  user.planUpdatedAt = new Date();
  await user.save();

  console.log(`Payment failed for user ${user._id}`);
}

const status = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.planUpdatedAt) {
      user.planUpdatedAt = user.createdAt || new Date();
      await user.save();
    }

    return res.json({
      plan: user.plan,
      billingStatus: user.billingStatus,
      renewalDate: user.renewalDate,
      planUpdatedAt: user.planUpdatedAt,
      cancelAtNextBillingDate: user.dodoCancelAtNextBillingDate,
      canUpgrade: user.plan === 'free',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  checkout,
  cancel,
  webhook,
  status,
};
