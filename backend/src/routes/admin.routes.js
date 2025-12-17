const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');
const emailLogger = require('../services/emailLogger');

const maskEmail = (email = '') => {
  if (!email || typeof email !== 'string' || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  const safeLocal = local || '';
  const maskedLocal = safeLocal.length <= 2
    ? `${safeLocal.slice(0, 1)}*`
    : `${safeLocal.slice(0, 2)}***`;
  return `${maskedLocal}@${domain}`;
};

const normalizeEmailForLookup = (email = '') => {
  return String(email ?? '').trim().toLowerCase();
};

const escapeRegExp = (value = '') => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Admin middleware - checks if user is admin
 */
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // For now, admin access is based on a server-side allowlist
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    const isAdmin = adminEmails.includes(String(user.email || '').toLowerCase());

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

/**
 * GET /admin/users/lookup?email=
 * Safe admin lookup to verify a user exists in the current database.
 */
router.get('/users/lookup',
  verifyToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const rawEmail = req.query.email;
      if (!rawEmail || typeof rawEmail !== 'string') {
        return res.status(400).json({ error: 'Query param "email" is required' });
      }

      const normalizedEmail = normalizeEmailForLookup(rawEmail);
      let user = await User.findOne({ email: normalizedEmail });
      let foundBy = user ? 'normalized' : null;

      if (!user && normalizedEmail) {
        const regex = new RegExp(`^${escapeRegExp(normalizedEmail)}$`, 'i');
        user = await User.findOne({ email: { $regex: regex } });
        if (user) {
          foundBy = 'case_insensitive';
          if (user.email !== normalizedEmail) {
            user.email = normalizedEmail;
            await user.save();
          }
        }
      }

      res.json({
        exists: !!user,
        foundBy,
        query: {
          normalizedEmail: maskEmail(normalizedEmail),
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || 'development',
          mongoDb: mongoose.connection?.name || null,
        },
        user: user ? {
          id: user._id,
          email: maskEmail(user.email),
          emailVerified: user.emailVerified,
          authMethod: user.googleId ? 'google' : 'password',
          createdAt: user.createdAt,
        } : null,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
