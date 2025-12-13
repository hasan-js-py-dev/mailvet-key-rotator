const express = require('express');
const router = express.Router();

/**
 * GET /plans
 * List available subscription plans
 */
router.get('/', (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: null,
      features: {
        credits: 50,
        singleEmailValidation: true,
        csvUpload: false,
        apiAccess: false,
        rateLimit: '1 email/second',
        maxRowsPerFile: 0,
        concurrentFiles: 0,
        prioritySupport: false
      },
      description: 'Perfect for trying out MailVet'
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 29.99,
      originalPrice: 299,
      currency: 'USD',
      interval: 'month',
      discount: '90% OFF',
      popular: true,
      features: {
        validations: 'Unlimited',
        singleEmailValidation: true,
        csvUpload: true,
        apiAccess: false,
        rateLimit: '3 emails/second',
        maxRowsPerFile: 10000,
        concurrentFiles: 2,
        detailedAnalytics: true,
        prioritySupport: true
      },
      description: 'Best for growing businesses'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: null,
      currency: 'USD',
      interval: null,
      priceLabel: 'Contact Sales',
      features: {
        validations: 'Unlimited',
        singleEmailValidation: true,
        csvUpload: true,
        apiAccess: true,
        rateLimit: '10+ emails/second',
        maxRowsPerFile: 'Unlimited',
        concurrentFiles: 'Unlimited',
        detailedAnalytics: true,
        prioritySupport: true,
        dedicatedAccountManager: true,
        customIntegrations: true,
        sla: true
      },
      description: 'For large-scale operations'
    }
  ];

  res.json({ plans });
});

/**
 * GET /plans/:planId
 * Get specific plan details
 */
router.get('/:planId', (req, res) => {
  const { planId } = req.params;

  const planDetails = {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      credits: 50,
      rateLimit: { requests: 1, windowMs: 1000 },
      features: ['50 email validations', 'Single email validation', 'Basic results']
    },
    ultimate: {
      id: 'ultimate',
      name: 'Ultimate',
      price: 29.99,
      validations: 'unlimited',
      rateLimit: { requests: 3, windowMs: 1000 },
      features: [
        'Unlimited validations',
        'CSV bulk upload (10K rows)',
        '3 emails/second rate limit',
        'Up to 2 concurrent files',
        'Detailed analytics',
        'Priority support'
      ]
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      price: null,
      validations: 'unlimited',
      rateLimit: { requests: 10, windowMs: 1000 },
      features: [
        'Everything in Ultimate',
        'Full API access',
        '10+ emails/second rate limit',
        'Unlimited concurrent files',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee'
      ]
    }
  };

  const plan = planDetails[planId];
  
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  res.json(plan);
});

module.exports = router;
