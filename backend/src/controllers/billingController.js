const User = require('../models/User');

const checkout = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.plan === plan) {
      return res.status(400).json({ error: 'Already on this plan' });
    }

    const checkoutUrl = `https://checkout.dodopayments.com/mailvet/${plan}?userId=${user._id}&email=${encodeURIComponent(user.email)}`;

    return res.json({
      checkoutUrl,
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

    user.plan = 'free';
    user.billingStatus = 'none';
    user.renewalDate = undefined;
    user.planUpdatedAt = new Date();
    await user.save();

    return res.json({
      message: 'Plan cancelled. You are now on the Free plan.',
      plan: user.plan,
      billingStatus: user.billingStatus,
      renewalDate: user.renewalDate,
      planUpdatedAt: user.planUpdatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

const webhook = async (req, res) => {
  try {
    const event = req.body;

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
  const { userId, plan } = data?.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.plan = plan;
  user.billingStatus = 'active';
  user.planUpdatedAt = new Date();
  await user.save();

  console.log(`Payment succeeded for user ${userId}, upgraded to ${plan}`);
}

async function handleSubscriptionCreated(data) {
  const { userId, plan } = data?.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.plan = plan;
  user.billingStatus = 'active';
  user.renewalDate = data?.currentPeriodEnd ? new Date(data.currentPeriodEnd) : undefined;
  user.planUpdatedAt = new Date();
  await user.save();

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionCancelled(data) {
  const { userId } = data?.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.billingStatus = 'cancelled';
  user.planUpdatedAt = new Date();
  await user.save();

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handleSubscriptionRenewed(data) {
  const { userId } = data?.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.billingStatus = 'active';
  user.renewalDate = data?.currentPeriodEnd ? new Date(data.currentPeriodEnd) : undefined;
  user.planUpdatedAt = new Date();
  await user.save();

  console.log(`Subscription renewed for user ${userId}`);
}

async function handlePaymentFailed(data) {
  const { userId } = data?.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.billingStatus = 'past_due';
  user.planUpdatedAt = new Date();
  await user.save();

  console.log(`Payment failed for user ${userId}`);
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
      canUpgrade: user.plan !== 'enterprise',
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
