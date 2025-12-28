const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const { verifyToken, requireVerifiedEmail } = require('../middleware/auth');
const billingController = require('../controllers/billingController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

router.post(
  '/checkout',
  verifyToken,
  requireVerifiedEmail,
  [body('plan').isIn(['ultimate'])],
  validate,
  billingController.checkout
);

router.post('/cancel', verifyToken, requireVerifiedEmail, billingController.cancel);

// NOTE: payment provider integration pending; signature verification should be added.
router.post('/webhook', billingController.webhook);

router.get('/status', verifyToken, billingController.status);

module.exports = router;
