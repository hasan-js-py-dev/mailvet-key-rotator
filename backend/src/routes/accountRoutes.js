const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const { verifyToken, requireVerifiedEmail } = require('../middleware/auth');
const accountController = require('../controllers/accountController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

router.use(verifyToken);

router.get('/', accountController.getProfile);

router.patch(
  '/',
  [
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('companyName').optional().trim().isLength({ max: 100 }),
  ],
  validate,
  accountController.updateProfile
);

router.post('/password-reset', accountController.requestPasswordResetForSelf);

router.delete('/', accountController.deleteAccount);

router.get('/usage', requireVerifiedEmail, accountController.getUsage);

module.exports = router;
