const express = require('express');

const router = express.Router();

const { verifyToken } = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const adminController = require('../controllers/adminController');

router.get('/email-logs', verifyToken, requireAdmin, adminController.getEmailLogs);
router.delete('/email-logs', verifyToken, requireAdmin, adminController.clearEmailLogs);
router.get('/users/lookup', verifyToken, requireAdmin, adminController.lookupUserByEmail);

module.exports = router;
