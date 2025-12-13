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

// All routes require authentication
router.use(verifyToken);

/**
 * GET /account
 * Get current user profile
 */
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if monthly validations should reset
    user.checkMonthlyReset();
    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      credits: user.credits,
      plan: user.plan,
      totalValidations: user.totalValidations,
      monthlyValidations: user.monthlyValidations,
      billingStatus: user.billingStatus,
      renewalDate: user.renewalDate,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /account
 * Update user profile
 */
router.patch('/',
  [
    body('name').optional().trim().isLength({ min: 1, max: 100 })
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name } = req.body;
      
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update allowed fields
      if (name !== undefined) {
        user.name = name;
      }

      await user.save();

      res.json({
        message: 'Profile updated',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          plan: user.plan
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /account/usage
 * Get detailed usage statistics
 */
router.get('/usage', requireVerifiedEmail, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if monthly validations should reset
    user.checkMonthlyReset();
    await user.save();

    // Get validation stats
    const ValidationResult = require('../models/ValidationResult');
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentValidations = await ValidationResult.aggregate([
      { 
        $match: { 
          userId: user._id,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          valid: { $sum: { $cond: [{ $eq: ['$code', 'ok'] }, 1, 0] } },
          invalid: { $sum: { $cond: [{ $eq: ['$code', 'ko'] }, 1, 0] } },
          catchAll: { $sum: { $cond: ['$catchAll', 1, 0] } }
        }
      }
    ]);

    const stats = recentValidations[0] || { total: 0, valid: 0, invalid: 0, catchAll: 0 };

    res.json({
      credits: user.credits,
      plan: user.plan,
      totalValidations: user.totalValidations,
      monthlyValidations: user.monthlyValidations,
      last30Days: {
        total: stats.total,
        valid: stats.valid,
        invalid: stats.invalid,
        catchAll: stats.catchAll
      },
      renewalDate: user.renewalDate,
      billingStatus: user.billingStatus
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /account/api-token
 * Get API token info (Enterprise only)
 */
router.get('/api-token', requireVerifiedEmail, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('+apiToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.plan !== 'enterprise') {
      return res.status(403).json({ 
        error: 'API tokens are only available for Enterprise plans' 
      });
    }

    res.json({
      hasApiToken: !!user.apiToken,
      // Only show masked version
      apiTokenPreview: user.apiToken 
        ? `${user.apiToken.substring(0, 10)}...${user.apiToken.substring(user.apiToken.length - 4)}`
        : null
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
