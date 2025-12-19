const { generatePasswordResetToken } = require('../services/tokenService');
const { sendPasswordResetEmail } = require('../services/emailService');
const User = require('../models/User');
const firebaseAdmin = require('../config/firebase');

const deleteFirebaseUserIfPossible = async (firebaseUid) => {
  if (!firebaseUid) return { deleted: false, reason: 'missing_firebase_uid' };

  try {
    if (typeof firebaseAdmin._ensureInitialized === 'function') {
      firebaseAdmin._ensureInitialized();
    }

    if (!firebaseAdmin.apps || firebaseAdmin.apps.length === 0) {
      return { deleted: false, reason: 'firebase_not_configured' };
    }

    await firebaseAdmin.auth().deleteUser(firebaseUid);
    return { deleted: true };
  } catch (error) {
    return { deleted: false, reason: 'firebase_delete_failed', error };
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let needsSave = false;

    if (user.plan === 'free' && Number(user.credits ?? 0) !== 100) {
      user.credits = 100;
      needsSave = true;
    }

    if (!user.planUpdatedAt) {
      user.planUpdatedAt = user.createdAt || new Date();
      needsSave = true;
    }

    if (needsSave) {
      await user.save();
    }

    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      companyName: user.companyName,
      emailVerified: user.emailVerified,
      credits: user.credits,
      plan: user.plan,
      planUpdatedAt: user.planUpdatedAt,
      billingStatus: user.billingStatus,
      renewalDate: user.renewalDate,
      createdAt: user.createdAt,
      authMethod: user.googleId ? 'google' : 'password',
    });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, companyName } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (companyName !== undefined) {
      user.companyName = companyName;
    }

    await user.save();

    return res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        companyName: user.companyName,
        emailVerified: user.emailVerified,
        credits: user.credits,
        plan: user.plan,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const requestPasswordResetForSelf = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.googleId) {
      return res.status(400).json({ error: 'Google accounts do not support password reset in this flow' });
    }

    const resetToken = generatePasswordResetToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken, user.name);

    return res.json({ message: 'Password reset email sent' });
  } catch (error) {
    return next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const firebaseResult = await deleteFirebaseUserIfPossible(user.firebaseUid);
    if (!firebaseResult.deleted) {
      if (firebaseResult.reason === 'firebase_delete_failed') {
        console.error('[account] Failed to delete Firebase user:', firebaseResult.error);
      }

      return res.status(500).json({
        error:
          'Failed to fully delete your account (auth record not removed). Please contact support or try again later.',
      });
    }

    await User.findByIdAndDelete(req.userId);

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return res.json({ message: 'Account deleted' });
  } catch (error) {
    return next(error);
  }
};

const getUsage = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      credits: user.credits,
      plan: user.plan,
      renewalDate: user.renewalDate,
      billingStatus: user.billingStatus,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  requestPasswordResetForSelf,
  deleteAccount,
  getUsage,
};
