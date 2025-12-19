const bcrypt = require('bcryptjs');
const User = require('../models/User');
const admin = require('../config/firebase');
const {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
  getRefreshTokenCookieOptions,
} = require('../services/tokenService');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} = require('../services/emailService');

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

const setAuthTokens = async (res, user) => {
  const accessToken = generateAccessToken(user._id);
  const { token: refreshToken, hash, expires } = await generateRefreshToken();

  user.refreshTokenHash = hash;
  user.refreshTokenExpires = expires;
  await user.save();

  res.cookie('refresh_token', refreshToken, getRefreshTokenCookieOptions());

  return accessToken;
};

const clearAuthTokens = async (res, user) => {
  if (user) {
    user.refreshTokenHash = undefined;
    user.refreshTokenExpires = undefined;
    await user.save();
  }

  const cookieOptions = getRefreshTokenCookieOptions();
  res.clearCookie('refresh_token', {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    domain: cookieOptions.domain,
    path: cookieOptions.path,
  });
};

const signup = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const { firebaseUid } = req;

    const normalizedEmail = normalizeEmailForLookup(email);

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { firebaseUid }],
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = new User({
      email: normalizedEmail,
      name,
      firebaseUid,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      credits: 100,
      plan: 'free',
    });

    await user.save();

    await sendVerificationEmail(normalizedEmail, verificationToken, name);

    return res.status(201).json({
      message: 'Account created. Please verify your email.',
      requiresVerification: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'User already exists' });
    }
    return next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { firebaseUid, firebaseUser } = req;
    const { email, name } = firebaseUser;

    let user = await User.findOne({ firebaseUid });

    if (user) {
      user.updatedAt = new Date();
    } else {
      const normalizedEmail = normalizeEmailForLookup(email);
      const emailUser = await User.findOne({ email: normalizedEmail });

      if (emailUser) {
        emailUser.firebaseUid = firebaseUid;
        emailUser.googleId = firebaseUid;
        emailUser.emailVerified = true;

        if (emailUser.plan === 'free' && Number(emailUser.credits ?? 0) !== 100) {
          emailUser.credits = 100;
        }

        user = emailUser;
      } else {
        user = new User({
          email: normalizedEmail,
          name: name || normalizedEmail.split('@')[0],
          firebaseUid,
          googleId: firebaseUid,
          emailVerified: true,
          credits: 100,
          plan: 'free',
        });

        sendWelcomeEmail(normalizedEmail, name);
      }
    }

    const accessToken = await setAuthTokens(res, user);

    return res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        credits: user.credits,
        plan: user.plan,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { firebaseUid, firebaseUser } = req;

    let user = await User.findOne({ firebaseUid });

    // If the Firebase account exists but the MongoDB user was deleted,
    // recreate/link the Mongo user so login works again.
    if (!user) {
      const tokenEmail = firebaseUser?.email;
      const normalizedEmail = normalizeEmailForLookup(tokenEmail);

      if (normalizedEmail) {
        const byEmail = await User.findOne({ email: normalizedEmail });
        if (byEmail) {
          byEmail.firebaseUid = firebaseUid;
          if (byEmail.plan === 'free' && Number(byEmail.credits ?? 0) !== 100) {
            byEmail.credits = 100;
          }
          user = byEmail;
        }
      }

      if (!user) {
        // Create a fresh Mongo user for this Firebase identity.
        // We treat Firebase authentication as the source of truth for allowing access.
        user = new User({
          email: normalizeEmailForLookup(tokenEmail),
          name: firebaseUser?.name || (tokenEmail ? tokenEmail.split('@')[0] : 'User'),
          firebaseUid,
          emailVerified: true,
          credits: 100,
          plan: 'free',
        });
      }

      await user.save();
    }

    if (!user.googleId && !user.emailVerified) {
      return res.status(403).json({
        error: 'Email not verified',
        message: 'Please verify your email before logging in',
      });
    }

    const accessToken = await setAuthTokens(res, user);

    return res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        credits: user.credits,
        plan: user.plan,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const user = req.user;

    const accessToken = generateAccessToken(user._id);

    return res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        credits: user.credits,
        plan: user.plan,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      const users = await User.find({
        refreshTokenExpires: { $gt: new Date() },
      }).select('+refreshTokenHash +refreshTokenExpires');

      for (const user of users) {
        if (!user.refreshTokenHash) continue;
        const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (isMatch) {
          await clearAuthTokens(res, user);
          break;
        }
      }
    }

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification link' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    sendWelcomeEmail(user.email, user.name);

    const accessToken = await setAuthTokens(res, user);

    return res.json({
      message: 'Email verified successfully',
      redirectUrl: `${process.env.DASHBOARD_URL}`,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        credits: user.credits,
        plan: user.plan,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const normalizedEmail = normalizeEmailForLookup(req.firebaseUser?.email);

    let user = await User.findOne({ email: normalizedEmail })
      .select('+emailVerificationToken +emailVerificationExpires');

    if (!user && normalizedEmail) {
      const regex = new RegExp(`^${escapeRegExp(normalizedEmail)}$`, 'i');
      user = await User.findOne({ email: { $regex: regex } })
        .select('+emailVerificationToken +emailVerificationExpires');

      if (user && user.email !== normalizedEmail) {
        user.email = normalizedEmail;
        await user.save();
      }
    }

    if (!user) {
      return res.json({ message: 'If an account exists, a verification email has been sent' });
    }

    if (user.emailVerified) {
      return res.json({ message: 'Email already verified. You can login now.' });
    }

    if (user.emailVerificationExpires) {
      const tokenAge = (24 * 60 * 60 * 1000) - (user.emailVerificationExpires - Date.now());
      if (tokenAge < 60 * 1000) {
        return res.status(429).json({ error: 'Please wait before requesting another verification email' });
      }
    }

    const verificationToken = generateVerificationToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, verificationToken, user.name);

    return res.json({ message: 'Verification email sent' });
  } catch (error) {
    return next(error);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const rawEmail = req.body?.email;
    const normalizedEmail = normalizeEmailForLookup(rawEmail);

    console.info('[auth] password-reset requested', { email: maskEmail(normalizedEmail) });

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

    if (!user) {
      console.info('[auth] password-reset no_user', { email: maskEmail(normalizedEmail) });
      return res.json({ message: 'If an account exists, a reset link has been sent' });
    }

    if (user.googleId) {
      console.info('[auth] password-reset google_account', { email: maskEmail(normalizedEmail) });
      return res.json({ message: 'If an account exists, a reset link has been sent' });
    }

    console.info('[auth] password-reset user_found', { email: maskEmail(normalizedEmail), foundBy });

    const resetToken = generatePasswordResetToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken, user.name);

    console.info('[auth] password-reset email_sent', { email: maskEmail(user.email) });

    return res.json({ message: 'If an account exists, a reset link has been sent' });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires +passwordHash +refreshTokenHash +refreshTokenExpires');

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    if (!admin.apps || admin.apps.length === 0) {
      return res.status(500).json({
        error: 'Firebase Admin is not configured on the server',
        code: 'FIREBASE_NOT_CONFIGURED'
      });
    }

    await admin.auth().updateUser(user.firebaseUid, { password });

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await clearAuthTokens(res, user);

    return res.json({
      message: 'Password reset successfully',
      redirectUrl: `${process.env.FRONTEND_URL}/access?page=login`,
    });
  } catch (error) {
    return next(error);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.refreshTokenHash = undefined;
    user.refreshTokenExpires = undefined;
    await user.save();

    const cookieOptions = getRefreshTokenCookieOptions();
    res.clearCookie('refresh_token', {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      domain: cookieOptions.domain,
      path: cookieOptions.path,
    });

    return res.json({ message: 'Successfully logged out from all sessions', requiresLogin: true });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signup,
  googleAuth,
  login,
  refresh,
  logout,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  resetPassword,
  logoutAll,
};
