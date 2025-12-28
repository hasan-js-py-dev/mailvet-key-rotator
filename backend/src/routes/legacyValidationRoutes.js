const express = require('express');
const { validationResult } = require('express-validator');

const { verifyToken, requireVerifiedEmail } = require('../middleware/auth');
const validationController = require('../controllers/validationController');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

// Backwards-compatible endpoint for older frontend bundles.
router.post(
  '/verify-email',
  verifyToken,
  requireVerifiedEmail,
  validationController.validateVerifyEmail,
  validate,
  validationController.verifyEmail
);

module.exports = router;
