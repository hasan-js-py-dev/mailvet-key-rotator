const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../models/User');
const { verifyToken, requireVerifiedEmail } = require('../middleware/auth');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * POST /billing/checkout
 * Initiate checkout for plan upgrade
 */
router.post('/checkout',
  verifyToken,
  requireVerifiedEmail,
  [body('plan').isIn(['ultimate', 'enterprise'])],
  validate,
  async (req, res, next) => {
    try {
      const { plan } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.plan === plan) {
        return res.status(400).json({ error: 'Already on this plan' });
      }

      // TODO: Integrate with Dodo Payments
      // For now, return placeholder checkout URL
      const checkoutUrl = `https://checkout.dodopayments.com/mailvet/${plan}?userId=${user._id}&email=${encodeURIComponent(user.email)}`;

      res.json({
        checkoutUrl,
        plan,
        message: 'Redirect to payment provider'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /billing/webhook
 * Handle Dodo Payments webhooks
 */
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res, next) => {
    try {
      // TODO: Verify webhook signature from Dodo Payments
      const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      console.log('Billing webhook received:', event.type);

      switch (event.type) {
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
          console.log('Unhandled webhook event:', event.type);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: 'Webhook processing failed' });
    }
  }
);

// Webhook handlers
async function handlePaymentSucceeded(data) {
  const { userId, plan } = data.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.plan = plan;
  user.billingStatus = 'active';
  await user.save();
  
  console.log(`Payment succeeded for user ${userId}, upgraded to ${plan}`);
}

async function handleSubscriptionCreated(data) {
  const { userId, plan } = data.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.plan = plan;
  user.billingStatus = 'active';
  user.renewalDate = new Date(data.currentPeriodEnd);
  await user.save();

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionCancelled(data) {
  const { userId } = data.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.billingStatus = 'cancelled';
  // Keep plan active until renewal date
  await user.save();

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handleSubscriptionRenewed(data) {
  const { userId, plan } = data.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.billingStatus = 'active';
  user.renewalDate = new Date(data.currentPeriodEnd);
  user.monthlyValidations = 0; // Reset monthly counter
  await user.save();

  console.log(`Subscription renewed for user ${userId}`);
}

async function handlePaymentFailed(data) {
  const { userId } = data.metadata || {};
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.billingStatus = 'past_due';
  await user.save();

  console.log(`Payment failed for user ${userId}`);
}

/**
 * GET /billing/status
 * Get current billing status
 */
router.get('/status',
  verifyToken,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        plan: user.plan,
        billingStatus: user.billingStatus,
        renewalDate: user.renewalDate,
        canUpgrade: user.plan !== 'enterprise'
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
