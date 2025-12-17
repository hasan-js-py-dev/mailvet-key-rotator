const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../models/User');
const admin = require('../config/firebase');
const { authLimiter } = require('../middleware/rateLimit');
const { verifyFirebaseToken, verifyToken, verifyRefreshTokenMiddleware } = require('../middleware/auth');
const { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('../services/email.service');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  generateVerificationToken, 
  generatePasswordResetToken, 
  generateApiToken,
  getRefreshTokenCookieOptions 
} = require('../services/token.service');

// Apply rate limiting to all auth routes
router.use(authLimiter);

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const maskEmail = (email = '') => {
  if (!email || typeof email !== 'string' || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  const safeLocal = local || '';
  const maskedLocal = safeLocal.length <= 2
    ? `${safeLocal.slice(0, 1)}*`
    : `${safeLocal.slice(0, 2)}***`;
  return `${maskedLocal}@${domain}`;
};

/**
 * Helper: Set auth tokens (access in response, refresh in cookie)
 */
const setAuthTokens = async (res, user) => {
  const accessToken = generateAccessToken(user._id);
  const { token: refreshToken, hash, expires } = await generateRefreshToken();
  
  // Store hashed refresh token in database
  user.refreshTokenHash = hash;
  user.refreshTokenExpires = expires;
  await user.save();
  
  // Set refresh token as HttpOnly cookie
  res.cookie('refresh_token', refreshToken, getRefreshTokenCookieOptions());
  
  return accessToken;
};

/**
 * Helper: Clear auth tokens
 */
const clearAuthTokens = async (res, user) => {
  if (user) {
    user.refreshTokenHash = undefined;
    user.refreshTokenExpires = undefined;
    await user.save();
  }
  
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
};

/**
 * POST /auth/signup
 * Register with email/password via Firebase
 * Returns: access token in JSON, refresh token in HttpOnly cookie
 */
router.post('/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').optional().trim().isLength({ max: 100 })
  ],
  validate,
  verifyFirebaseToken,
  async (req, res, next) => {
    try {
      const { email, name } = req.body;
      const { firebaseUid } = req;

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { firebaseUid }] 
      });
      
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Generate verification token
      const verificationToken = generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = new User({
        email,
        name,
        firebaseUid,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        credits: 50,
        plan: 'free'
      });

      await user.save();

      // Send verification email
      await sendVerificationEmail(email, verificationToken, name);

      // Generate tokens
      const accessToken = await setAuthTokens(res, user);

      res.status(201).json({
        message: 'Account created. Please verify your email.',
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          plan: user.plan
        }
      });
    } catch (error) {
      // Handle duplicate key errors
      if (error.code === 11000) {
        return res.status(409).json({ error: 'User already exists' });
      }
      next(error);
    }
  }
);

/**
 * POST /auth/social/google
 * Handle Google OAuth sign-up/login via Firebase
 * Returns: access token in JSON, refresh token in HttpOnly cookie
 */
router.post('/social/google',
  verifyFirebaseToken,
  async (req, res, next) => {
    try {
      const { firebaseUid, firebaseUser } = req;
      const { email, name, picture } = firebaseUser;

      // Check if user exists
      let user = await User.findOne({ firebaseUid });

      if (user) {
        // Existing user - update last login
        user.updatedAt = new Date();
      } else {
        // Check if email exists with different auth method
        const emailUser = await User.findOne({ email });
        if (emailUser) {
          // Link accounts
          emailUser.firebaseUid = firebaseUid;
          emailUser.googleId = firebaseUid;
          emailUser.emailVerified = true; // Google accounts are pre-verified
          user = emailUser;
        } else {
          // New user
          user = new User({
            email,
            name: name || email.split('@')[0],
            firebaseUid,
            googleId: firebaseUid,
            emailVerified: true, // Google accounts are pre-verified
            credits: 50,
            plan: 'free'
          });

          // Send welcome email
          sendWelcomeEmail(email, name);
        }
      }

      // Generate tokens
      const accessToken = await setAuthTokens(res, user);

      res.json({
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          plan: user.plan
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/login
 * Login with email/password via Firebase token
 * Returns: access token in JSON, refresh token in HttpOnly cookie
 */
router.post('/login',
  verifyFirebaseToken,
  async (req, res, next) => {
    try {
      const { firebaseUid, firebaseUser } = req;

      // Find user
      const user = await User.findOne({ firebaseUid });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found. Please sign up first.' });
      }

      // Check if email is verified (for email/password users)
      if (!user.googleId && !user.emailVerified) {
        return res.status(403).json({ 
          error: 'Email not verified',
          message: 'Please verify your email before logging in'
        });
      }

      // Generate tokens
      const accessToken = await setAuthTokens(res, user);

      res.json({
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          plan: user.plan
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/refresh
 * Refresh access token using refresh token from cookie
 * Optionally rotates refresh token for enhanced security
 */
router.post('/refresh',
  verifyRefreshTokenMiddleware,
  async (req, res, next) => {
    try {
      const user = req.user;

      // Rotate refresh token (generate new one)
      const accessToken = await setAuthTokens(res, user);

      res.json({
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          plan: user.plan
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/logout
 * Clear refresh token cookie and invalidate token in database
 */
router.post('/logout',
  async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refresh_token;
      
      if (refreshToken) {
        // Find and invalidate the user's refresh token
        const users = await User.find({
          refreshTokenExpires: { $gt: new Date() }
        }).select('+refreshTokenHash +refreshTokenExpires');

        for (const user of users) {
          if (user.refreshTokenHash) {
            const bcrypt = require('bcryptjs');
            const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
            if (isMatch) {
              await clearAuthTokens(res, user);
              break;
            }
          }
        }
      }
      
      // Clear cookie regardless
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /auth/verify-email
 * Verify email with token from email link
 */
router.get('/verify-email',
  [query('token').notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const { token } = req.query;

      // Find user with this verification token
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() }
      }).select('+emailVerificationToken +emailVerificationExpires');

      if (!user) {
        return res.status(400).json({ 
          error: 'Invalid or expired verification link' 
        });
      }

      // Mark email as verified
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;

      // Send welcome email
      sendWelcomeEmail(user.email, user.name);

      // Generate tokens
      const accessToken = await setAuthTokens(res, user);

      res.json({ 
        message: 'Email verified successfully',
        redirectUrl: `${process.env.DASHBOARD_URL}`,
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          credits: user.credits,
          plan: user.plan
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/resend-verification
 * Resend verification email (requires authenticated Firebase session)
 */
router.post('/resend-verification',
  verifyFirebaseToken,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ firebaseUid: req.firebaseUid })
        .select('+emailVerificationToken +emailVerificationExpires');

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: 'If an account exists, a verification email has been sent' });
      }

      if (user.emailVerified) {
        return res.json({ message: 'Email already verified. You can login now.' });
      }

      // Rate limit: don't send if last token was generated less than 60 seconds ago
      if (user.emailVerificationExpires) {
        const tokenAge = (24 * 60 * 60 * 1000) - (user.emailVerificationExpires - Date.now());
        if (tokenAge < 60 * 1000) { // Less than 60 seconds since last send
          return res.status(429).json({ 
            error: 'Please wait before requesting another verification email' 
          });
        }
      }

      // Generate new token
      const verificationToken = generateVerificationToken();
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();

      // Send email
      await sendVerificationEmail(user.email, verificationToken, user.name);

      res.json({ message: 'Verification email sent' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/password-reset
 * Request password reset
 */
router.post('/password-reset',
  [body('email').isEmail().normalizeEmail()],
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body;

      console.info('[auth] password-reset requested', { email: maskEmail(email) });

      const user = await User.findOne({ email });

      // Always return success to prevent email enumeration
      if (!user) {
        console.info('[auth] password-reset no_user', { email: maskEmail(email) });
        return res.json({
          message: 'If an account exists, a reset link has been sent'
        });
      }

      // Google accounts don't have a password to reset in this flow
      if (user.googleId) {
        console.info('[auth] password-reset google_account', { email: maskEmail(email) });
        return res.json({
          message: 'If an account exists, a reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = generatePasswordResetToken();
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      // Send email
      await sendPasswordResetEmail(email, resetToken, user.name);

      console.info('[auth] password-reset email_sent', { email: maskEmail(email) });

      res.json({
        message: 'If an account exists, a reset link has been sent'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/reset-password
 * Set new password using reset token
 */
router.post('/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 })
  ],
  validate,
  async (req, res, next) => {
    try {
      const { token, password } = req.body;

      // Find user with valid reset token
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
      }).select('+passwordResetToken +passwordResetExpires +passwordHash');

      if (!user) {
        return res.status(400).json({ 
          error: 'Invalid or expired reset link' 
        });
      }

      // Update password in Firebase
      await admin.auth().updateUser(user.firebaseUid, {
        password: password
      });

      // Clear reset token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.json({ 
        message: 'Password reset successfully',
        redirectUrl: `${process.env.FRONTEND_URL}/access?page=login`
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/regenerate-api-token
 * Regenerate API token (for Enterprise users)
 */
router.post('/regenerate-api-token',
  verifyToken,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.plan !== 'enterprise') {
        return res.status(403).json({ 
          error: 'API tokens are only available for Enterprise plans' 
        });
      }

      // Generate new API token
      const { token, hash } = await generateApiToken();
      user.apiToken = token; // Store plain token temporarily for display
      user.apiTokenHash = hash;
      await user.save();

      res.json({ 
        message: 'API token regenerated',
        apiToken: token // Only shown once
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
