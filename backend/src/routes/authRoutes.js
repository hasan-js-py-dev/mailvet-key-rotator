const express = require('express');
const { body, query, validationResult } = require('express-validator');

const router = express.Router();

const { authLimiter } = require('../middleware/rateLimit');
const { verifyFirebaseToken, verifyToken, verifyRefreshTokenMiddleware } = require('../middleware/auth');
const authController = require('../controllers/authController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').optional().trim().isLength({ max: 100 }),
  ],
  validate,
  verifyFirebaseToken,
  authController.signup
);

router.post('/social/google', verifyFirebaseToken, authController.googleAuth);

router.post('/login', authLimiter, verifyFirebaseToken, authController.login);

router.post('/refresh', verifyRefreshTokenMiddleware, authController.refresh);

router.post('/logout', authController.logout);

router.get('/verify-email', [query('token').notEmpty()], validate, authController.verifyEmail);

router.post('/resend-verification', verifyFirebaseToken, authController.resendVerification);

router.post(
  '/password-reset',
  authLimiter,
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Invalid email')
      .customSanitizer((v) => String(v ?? '').trim().toLowerCase()),
  ],
  validate,
  authController.requestPasswordReset
);

router.post(
  '/reset-password',
  [body('token').notEmpty(), body('password').isLength({ min: 8 })],
  validate,
  authController.resetPassword
);

router.post('/logout-all', verifyToken, authController.logoutAll);

module.exports = router;
