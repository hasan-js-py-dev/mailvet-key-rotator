const mongoose = require('mongoose');
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
  return String(value).replace(/[.*+?^${}()|[\[\]\\]/g, '\\$&');
};

const getEmailLogs = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
  const logs = emailLogger.getLogs(limit);
  return res.json({ logs, total: logs.length });
};

const clearEmailLogs = async (req, res) => {
  emailLogger.clearLogs();
  return res.json({ message: 'Email logs cleared' });
};

const lookupUserByEmail = async (req, res, next) => {
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

    return res.json({
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
    return next(error);
  }
};

module.exports = {
  getEmailLogs,
  clearEmailLogs,
  lookupUserByEmail,
};
