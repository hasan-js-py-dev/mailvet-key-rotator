const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');
const emailLogger = require('../services/emailLogger');

/**
 * Admin middleware - checks if user is admin
 */
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // Check if user is admin (you can customize this logic)
    // For now, we check for a specific email or an isAdmin flag
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    const isAdmin = user.isAdmin === true || adminEmails.includes(user.email.toLowerCase());
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.adminUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * GET /admin/email-logs
 * Fetch recent email send logs for diagnostics
 */
router.get('/email-logs',
  verifyToken,
  requireAdmin,
  async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const logs = emailLogger.getLogs(limit);
    res.json({ logs, total: logs.length });
  }
);

/**
 * DELETE /admin/email-logs
 * Clear email logs
 */
router.delete('/email-logs',
  verifyToken,
  requireAdmin,
  async (req, res) => {
    emailLogger.clearLogs();
    res.json({ message: 'Email logs cleared' });
  }
);

module.exports = router;
