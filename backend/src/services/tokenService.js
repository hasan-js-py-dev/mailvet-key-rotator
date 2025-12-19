const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Token Configuration
 * - Access Token: Short-lived (~15 minutes), sent in JSON response
 * - Refresh Token: Long-lived (~7 days), stored as HttpOnly cookie and hashed in MongoDB
 */
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString(), type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
};

const generateRefreshToken = async () => {
  const token = crypto.randomBytes(64).toString('hex');
  const hash = await bcrypt.hash(token, 10);
  const expires = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);
  return { token, hash, expires };
};

const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.type !== 'access') {
    throw new Error('Invalid token type');
  }
  return decoded;
};

const verifyRefreshToken = async (token, storedHash) => {
  if (!token || !storedHash) return false;
  return bcrypt.compare(token, storedHash);
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const getRefreshTokenCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true' || isProduction,
    sameSite: process.env.COOKIE_SAMESITE || (isProduction ? 'strict' : 'lax'),
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: REFRESH_TOKEN_EXPIRES_MS,
    path: '/',
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
  getRefreshTokenCookieOptions,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES_MS,
};
