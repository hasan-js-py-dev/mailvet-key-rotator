const { body, validationResult } = require('express-validator');
const disposableEmailDomains = require('disposable-email-domains');

const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const { verifyEmailWithMailtester } = require('../services/mailtesterClient');
const { getAvailableMailtesterKey } = require('../services/mailtesterRotatorClient');

const ROLE_BASED_PREFIXES = new Set([
  'admin',
  'billing',
  'contact',
  'hello',
  'help',
  'info',
  'inquiries',
  'legal',
  'mail',
  'marketing',
  'office',
  'postmaster',
  'privacy',
  'sales',
  'security',
  'service',
  'support',
  'team',
  'webmaster',
]);

const validateVerifyEmail = [body('email').isEmail().normalizeEmail()];

const validate = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Invalid input');
    err.statusCode = 400;
    err.details = errors.array();
    throw err;
  }
};

const inferFlags = ({ email, domain, apiResult }) => {
  const localPart = String(email).split('@')[0]?.toLowerCase() || '';
  const normalizedDomain = String(domain || '').toLowerCase();

  const disposable = disposableEmailDomains.includes(normalizedDomain);
  const roleBased = ROLE_BASED_PREFIXES.has(localPart);

  const message = String(apiResult?.message || '');
  const code = String(apiResult?.code || '').toLowerCase();

  const catchAll = /catch\s*-?\s*all/i.test(message);

  const mxValue = apiResult?.mx;
  const mxRecords = Boolean(mxValue) && !/no\s*mx/i.test(message) && !/mx\s*error/i.test(message);

  let riskLevel = 'low';
  if (disposable || code === 'ko') riskLevel = 'high';
  else if (catchAll || roleBased || code === 'mb') riskLevel = 'medium';

  return { disposable, roleBased, catchAll, mxRecords, riskLevel };
};

const reserveCreditIfNeeded = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  if (user.plan !== 'free') {
    return { reserved: false, user };
  }

  const updated = await User.findOneAndUpdate(
    { _id: userId, credits: { $gt: 0 } },
    { $inc: { credits: -1 } },
    { new: true }
  );

  if (!updated) {
    const err = new Error('No credits remaining');
    err.statusCode = 403;
    throw err;
  }

  return { reserved: true, user: updated };
};

const refundCreditIfNeeded = async (userId, reserved) => {
  if (!reserved) return;
  await User.updateOne({ _id: userId }, { $inc: { credits: 1 } });
};

const verifyEmail = async (req, res, next) => {
  const start = Date.now();
  try {
    validate(req);
    const email = String(req.body.email).toLowerCase().trim();
    const domain = email.split('@')[1] || '';

    const { reserved } = await reserveCreditIfNeeded(req.userId);

    let keyReservation;
    try {
      keyReservation = await getAvailableMailtesterKey();
    } catch (error) {
      await refundCreditIfNeeded(req.userId, reserved);

      // If the rotator signals "wait"/429, forward it as-is.
      if (error?.statusCode === 429) {
        const retryAfterMs = Number(error?.details?.retryAfterMs || error?.details?.nextRequestInMs);
        return res.status(429).json({
          status: 'wait',
          error: error?.message || 'All keys are busy. Please retry.',
          ...(Number.isFinite(retryAfterMs) ? { retryAfterMs } : {}),
        });
      }

      return next(error);
    }

    let apiResult;
    try {
      apiResult = await verifyEmailWithMailtester(email, keyReservation.apiKey);
    } catch (error) {
      await refundCreditIfNeeded(req.userId, reserved);
      return next(error);
    }

    const flags = inferFlags({ email, domain, apiResult });

    await EmailVerification.create({
      userId: req.userId,
      email,
      domain,
      provider: 'mailtester',
      mailtesterSubscriptionId: keyReservation.subscriptionId,
      mailtesterPlan: keyReservation.plan,
      code: apiResult?.code,
      message: apiResult?.message,
      mx: apiResult?.mx,
      catchAll: flags.catchAll,
      disposable: flags.disposable,
      roleBased: flags.roleBased,
      mxRecords: flags.mxRecords,
      riskLevel: flags.riskLevel,
      creditsConsumed: reserved ? 1 : 0,
      latencyMs: Date.now() - start,
      raw: {
        rotator: keyReservation.raw,
        mailtester: apiResult,
      },
    });

    return res.json({
      email,
      code: apiResult?.code,
      message: apiResult?.message,
      catchAll: flags.catchAll,
      disposable: flags.disposable,
      roleBased: flags.roleBased,
      mxRecords: flags.mxRecords,
      riskLevel: flags.riskLevel,
    });
  } catch (error) {
    return next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const limit = Math.min(Number.parseInt(String(req.query.limit || '50'), 10) || 50, 200);

    const items = await EmailVerification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(
        'email domain provider code message catchAll disposable roleBased mxRecords riskLevel creditsConsumed mailtesterSubscriptionId mailtesterPlan createdAt'
      )
      .lean();

    return res.json({ activity: items });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  validateVerifyEmail,
  verifyEmail,
  getRecentActivity,
};
