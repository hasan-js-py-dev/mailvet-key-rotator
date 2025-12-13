const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../models/User');
const ValidationResult = require('../models/ValidationResult');
const { verifyToken, verifyApiToken, requirePlan, requireVerifiedEmail } = require('../middleware/auth');
const { validationLimiter } = require('../middleware/rateLimit');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Email validation helper
const validateEmailSyntax = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Call key-manager and MailTester
const performValidation = async (email) => {
  try {
    // Step 1: Get available key from key-manager
    const keyResponse = await fetch(`${process.env.KEY_MANAGER_URL}/key/available`);
    
    if (!keyResponse.ok) {
      throw new Error('No available validation keys');
    }
    
    const keyData = await keyResponse.json();
    const { subscriptionId } = keyData;

    // Step 2: Call MailTester API
    const validationResponse = await fetch(
      `https://happy.mailtester.ninja/ninja?email=${encodeURIComponent(email)}&key=${subscriptionId}`
    );
    
    if (!validationResponse.ok) {
      throw new Error('Validation service unavailable');
    }

    const result = await validationResponse.json();
    
    return {
      email,
      valid: result.code === 'ok',
      code: result.code || 'unknown',
      message: result.message || '',
      user: result.user || email.split('@')[0],
      domain: result.domain || email.split('@')[1],
      mx: result.mx || '',
      catchAll: result.catch_all || false,
      riskLevel: determineRiskLevel(result)
    };
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
};

// Determine risk level based on validation result
const determineRiskLevel = (result) => {
  if (result.code === 'ok' && !result.catch_all) return 'low';
  if (result.code === 'ok' && result.catch_all) return 'medium';
  if (result.code === 'mb') return 'medium';
  if (result.code === 'ko') return 'high';
  return 'unknown';
};

/**
 * POST /verify-email
 * Simplified endpoint - validates single email, auto-routes by plan
 */
router.post('/verify-email',
  verifyToken,
  requireVerifiedEmail,
  validationLimiter,
  [body('email').isEmail().normalizeEmail()],
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check credits for free plan
      if (user.plan === 'free' && user.credits <= 0) {
        return res.status(403).json({ 
          error: 'No credits remaining',
          message: 'Upgrade to Ultimate for unlimited validations'
        });
      }

      // Perform validation
      const result = await performValidation(email);

      // Save result
      const validationResult = new ValidationResult({
        userId: user._id,
        ...result
      });
      await validationResult.save();

      // Update user stats
      user.totalValidations += 1;
      user.monthlyValidations += 1;
      
      if (user.plan === 'free') {
        user.credits -= 1;
      }
      
      await user.save();

      res.json({
        ...result,
        creditsRemaining: user.plan === 'free' ? user.credits : 'unlimited'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /free/validate
 * Single email validation for Free plan
 */
router.post('/free/validate',
  verifyToken,
  requireVerifiedEmail,
  requirePlan('free'),
  validationLimiter,
  [body('email').isEmail().normalizeEmail()],
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findById(req.userId);

      if (user.credits <= 0) {
        return res.status(403).json({ 
          error: 'No credits remaining',
          creditsRemaining: 0
        });
      }

      const result = await performValidation(email);

      // Save result
      const validationResult = new ValidationResult({
        userId: user._id,
        ...result
      });
      await validationResult.save();

      // Deduct credit
      user.credits -= 1;
      user.totalValidations += 1;
      user.monthlyValidations += 1;
      await user.save();

      res.json({
        ...result,
        creditsRemaining: user.credits
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /ultimate/validate
 * Single email validation for Ultimate plan
 */
router.post('/ultimate/validate',
  verifyToken,
  requireVerifiedEmail,
  requirePlan('ultimate', 'enterprise'),
  validationLimiter,
  [body('email').isEmail().normalizeEmail()],
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findById(req.userId);

      const result = await performValidation(email);

      // Save result
      const validationResult = new ValidationResult({
        userId: user._id,
        ...result
      });
      await validationResult.save();

      // Update stats (no credit deduction for paid plans)
      user.totalValidations += 1;
      user.monthlyValidations += 1;
      await user.save();

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /enterprise/validate
 * Single email validation for Enterprise plan (API access)
 */
router.post('/enterprise/validate',
  verifyApiToken,
  validationLimiter,
  [body('email').isEmail().normalizeEmail()],
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = req.user;

      const result = await performValidation(email);

      // Save result
      const validationResult = new ValidationResult({
        userId: user._id,
        ...result
      });
      await validationResult.save();

      // Update stats
      user.totalValidations += 1;
      user.monthlyValidations += 1;
      await user.save();

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
