const rateLimit = require('express-rate-limit');

// Rate limits per plan
const planLimits = {
  free: {
    windowMs: 1000, // 1 second
    max: 1 // 1 request per second
  },
  ultimate: {
    windowMs: 1000,
    max: 3 // 3 requests per second
  },
  enterprise: {
    windowMs: 1000,
    max: 10 // 10 requests per second
  }
};

// General API rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth endpoints rate limit (stricter)
// NOTE: lowered to 1 minute for testing convenience.
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 attempts per minute
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation rate limit based on user's plan
const validationLimiter = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const limits = planLimits[user.plan] || planLimits.free;
  
  const limiter = rateLimit({
    windowMs: limits.windowMs,
    max: limits.max,
    keyGenerator: () => user._id.toString(),
    message: { 
      error: 'Rate limit exceeded',
      limit: limits.max,
      windowMs: limits.windowMs,
      plan: user.plan
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  limiter(req, res, next);
};

module.exports = {
  generalLimiter,
  authLimiter,
  validationLimiter,
  planLimits
};
