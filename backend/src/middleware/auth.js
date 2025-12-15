const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const User = require('../models/User');
const { verifyAccessToken, verifyRefreshToken } = require('../services/token.service');

/**
 * Verify access token from Authorization header
 * Returns 401 if token is missing, invalid, or expired
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify access token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      // Handle specific JWT errors
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
      }
      throw err;
    }
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Verify refresh token from cookie
 * Used for /auth/refresh endpoint
 */
const verifyRefreshTokenMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided', code: 'NO_REFRESH_TOKEN' });
    }

    // Find users with refresh tokens (we need to check hash)
    const users = await User.find({
      refreshTokenExpires: { $gt: new Date() }
    }).select('+refreshTokenHash +refreshTokenExpires');

    let matchedUser = null;
    for (const user of users) {
      if (user.refreshTokenHash && await verifyRefreshToken(refreshToken, user.refreshTokenHash)) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(403).json({ error: 'Invalid or expired refresh token', code: 'INVALID_REFRESH_TOKEN' });
    }

    req.user = matchedUser;
    req.userId = matchedUser._id;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// Verify Firebase ID token (for initial auth from frontend)
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No Firebase token provided' });
    }

    const idToken = authHeader.split(' ')[1];
    
    // Verify with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    req.firebaseUser = decodedToken;
    req.firebaseUid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Firebase auth error:', error);
    return res.status(401).json({ error: 'Invalid Firebase token' });
  }
};

// Verify API token for programmatic access (Enterprise only)
const verifyApiToken = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    
    if (!apiKey) {
      return res.status(401).json({ error: 'No API key provided' });
    }

    // Find user by API token hash
    const bcrypt = require('bcryptjs');
    const users = await User.find({ plan: 'enterprise' }).select('+apiTokenHash');
    
    let matchedUser = null;
    for (const user of users) {
      if (user.apiTokenHash && await bcrypt.compare(apiKey, user.apiTokenHash)) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    req.user = matchedUser;
    req.userId = matchedUser._id;
    next();
  } catch (error) {
    console.error('API token auth error:', error);
    return res.status(401).json({ error: 'Invalid API key' });
  }
};

// Check if user has required plan
const requirePlan = (...allowedPlans) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedPlans.includes(req.user.plan)) {
      return res.status(403).json({ 
        error: 'Plan upgrade required',
        requiredPlans: allowedPlans,
        currentPlan: req.user.plan
      });
    }

    next();
  };
};

// Check if user's email is verified
const requireVerifiedEmail = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({ error: 'Email verification required' });
  }

  next();
};

module.exports = {
  verifyToken,
  verifyRefreshTokenMiddleware,
  verifyFirebaseToken,
  verifyApiToken,
  requirePlan,
  requireVerifiedEmail
};
