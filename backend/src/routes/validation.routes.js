const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../models/User');
const ValidationResult = require('../models/ValidationResult');
const { verifyToken, verifyApiToken, requirePlan, requireVerifiedEmail } = require('../middleware/auth');
const { validationLimiter } = require('../middleware/rateLimit');
const dns = require('dns');
const whois = require('whois');
const disposableDomains = require('disposable-email-domains');

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

const getEmailParts = (email) => {
  const normalized = String(email || '').trim().toLowerCase();
  const atIndex = normalized.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === normalized.length - 1) {
    return { normalized, local: '', domain: '' };
  }
  return {
    normalized,
    local: normalized.slice(0, atIndex),
    domain: normalized.slice(atIndex + 1)
  };
};

const roleBasedPrefixes = new Set([
  'admin',
  'administrator',
  'billing',
  'contact',
  'help',
  'hello',
  'info',
  'inquiries',
  'jobs',
  'marketing',
  'office',
  'privacy',
  'sales',
  'security',
  'support',
  'team',
  'webmaster'
]);

const isRoleBasedLocalPart = (localPart) => {
  const token = String(localPart || '').split(/[+._-]/)[0];
  return roleBasedPrefixes.has(token);
};

const withTimeout = async (promise, timeoutMs, fallback) => {
  let timeout;
  try {
    const timer = new Promise((resolve) => {
      timeout = setTimeout(() => resolve(fallback), timeoutMs);
    });
    return await Promise.race([promise, timer]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

const resolveMxRecords = async (domain) => {
  try {
    const records = await withTimeout(dns.promises.resolveMx(domain), 4000, []);
    if (!Array.isArray(records) || records.length === 0) {
      return { found: false, records: [] };
    }
    const normalized = records
      .map((r) => ({ exchange: r.exchange, priority: r.priority }))
      .sort((a, b) => a.priority - b.priority);
    return { found: true, records: normalized };
  } catch {
    return { found: false, records: [] };
  }
};

const whoisLookup = (domain) => {
  return new Promise((resolve) => {
    whois.lookup(domain, { follow: 1, timeout: 4000 }, (err, data) => {
      if (err) return resolve(null);
      resolve(typeof data === 'string' ? data : null);
    });
  });
};

const extractDomainProvider = (whoisText) => {
  if (!whoisText) return null;
  const lines = whoisText.split(/\r?\n/);
  const candidates = [
    /^Registrar:\s*(.+)$/i,
    /^Sponsoring Registrar:\s*(.+)$/i,
    /^Registrar Organization:\s*(.+)$/i,
    /^OrgName:\s*(.+)$/i,
    /^Organization:\s*(.+)$/i
  ];
  for (const line of lines) {
    for (const rx of candidates) {
      const match = line.match(rx);
      if (match && match[1]) {
        const value = match[1].trim();
        if (value) return value;
      }
    }
  }
  return null;
};

const mapResultLabel = ({ code, catchAll, mxFound, timedOut }) => {
  if (timedOut) return 'timeout';
  if (!mxFound) return 'no-mx records';
  if (catchAll) return 'catch-all';
  if (code === 'ok') return 'valid';
  return 'invalid';
};

// Call key-manager and MailTester
const performValidation = async (email) => {
  try {
    const { normalized, local, domain } = getEmailParts(email);
    const mxInfo = await resolveMxRecords(domain);

    if (!mxInfo.found) {
      return {
        email: normalized,
        valid: false,
        code: 'unknown',
        message: 'No MX records found',
        user: local,
        domain,
        mx: '',
        catchAll: false,
        riskLevel: 'high',
        _meta: { mxInfo, timedOut: false }
      };
    }

    // Step 1: Get available key from key-manager
    const keyResponse = await fetch(`${process.env.KEY_MANAGER_URL}/key/available`);
    
    if (!keyResponse.ok) {
      throw new Error('No available validation keys');
    }
    
    const keyData = await keyResponse.json();
    const { subscriptionId } = keyData;

    // Step 2: Call MailTester API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const validationResponse = await fetch(
      `https://happy.mailtester.ninja/ninja?email=${encodeURIComponent(normalized)}&key=${subscriptionId}`,
      { signal: controller.signal }
    ).finally(() => clearTimeout(timeout));
    
    if (!validationResponse.ok) {
      throw new Error('Validation service unavailable');
    }

    const result = await validationResponse.json();
    
    return {
      email: normalized,
      valid: result.code === 'ok',
      code: result.code || 'unknown',
      message: result.message || '',
      user: result.user || local,
      domain: result.domain || domain,
      mx: result.mx || '',
      catchAll: result.catch_all || false,
      riskLevel: determineRiskLevel(result),
      _meta: { mxInfo, timedOut: false }
    };
  } catch (error) {
    const message = String(error?.message || 'Validation error');
    const timedOut = message.toLowerCase().includes('aborted') || message.toLowerCase().includes('timeout');
    if (timedOut) {
      const { normalized, local, domain } = getEmailParts(email);
      const mxInfo = await resolveMxRecords(domain);
      return {
        email: normalized,
        valid: false,
        code: 'unknown',
        message: 'Validation timed out',
        user: local,
        domain,
        mx: '',
        catchAll: false,
        riskLevel: 'unknown',
        _meta: { mxInfo, timedOut: true }
      };
    }

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

      const { local, domain } = getEmailParts(result.email);
      const mxInfo = result._meta?.mxInfo || { found: false, records: [] };
      const timedOut = !!result._meta?.timedOut;
      const disposableDomain = disposableDomains.includes(domain);
      const roleBased = isRoleBasedLocalPart(local);
      const resultLabel = mapResultLabel({
        code: result.code,
        catchAll: result.catchAll,
        mxFound: mxInfo.found,
        timedOut
      });
      const mailboxExists = resultLabel === 'valid' || resultLabel === 'catch-all';
      const smtpChecked = resultLabel === 'valid' || resultLabel === 'catch-all' || resultLabel === 'invalid';

      const whoisText = await withTimeout(whoisLookup(domain), 4500, null);
      const domainProvider = extractDomainProvider(whoisText);

      const verifiedAt = new Date().toISOString();

      // Save base result only (schema-compatible)
      const validationResult = new ValidationResult({
        userId: user._id,
        email: result.email,
        valid: result.valid,
        code: result.code,
        message: result.message,
        user: result.user,
        domain: result.domain,
        mx: result.mx,
        catchAll: result.catchAll,
        riskLevel: result.riskLevel
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
        email: result.email,
        result: resultLabel,
        code: result.code,
        message: result.message,
        riskLevel: result.riskLevel,

        addressInfo: {
          canonicalAddress: local,
          roleBased,
          mailboxExists,
          smtpCheck: smtpChecked,
          disposableAddress: disposableDomain
        },

        domainInfo: {
          domain,
          mxRecordsFound: mxInfo.found,
          mxRecords: mxInfo.records,
          domainProvider,
          catchAllDomain: !!result.catchAll,
          disposableDomain
        },

        verifiedAt,
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
