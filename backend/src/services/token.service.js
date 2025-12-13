const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Generate JWT for session
const generateSessionToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Verify JWT
const verifySessionToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate email verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate password reset token
const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate API token for Enterprise users
const generateApiToken = async () => {
  const token = `mv_${uuidv4().replace(/-/g, '')}`;
  const hash = await bcrypt.hash(token, 10);
  return { token, hash };
};

module.exports = {
  generateSessionToken,
  verifySessionToken,
  generateVerificationToken,
  generatePasswordResetToken,
  generateApiToken
};
