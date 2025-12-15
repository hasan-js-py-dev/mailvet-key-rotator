const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    select: false // Don't include in queries by default
  },
  googleId: {
    type: String,
    sparse: true
  },
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  credits: {
    type: Number,
    default: 50 // Free plan starts with 50 credits
  },
  plan: {
    type: String,
    enum: ['free', 'ultimate', 'enterprise'],
    default: 'free'
  },
  apiToken: {
    type: String,
    select: false
  },
  apiTokenHash: {
    type: String,
    select: false
  },
  name: {
    type: String,
    trim: true
  },
  totalValidations: {
    type: Number,
    default: 0
  },
  monthlyValidations: {
    type: Number,
    default: 0
  },
  lastValidationReset: {
    type: Date,
    default: Date.now
  },
  billingStatus: {
    type: String,
    enum: ['active', 'cancelled', 'past_due', 'none'],
    default: 'none'
  },
  renewalDate: {
    type: Date
  },
  // Refresh token storage for secure session management
  refreshTokenHash: {
    type: String,
    select: false
  },
  refreshTokenExpires: {
    type: Date,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Hash password before saving
userSchema.methods.setPassword = async function(password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

// Compare password
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Check if monthly validations should reset
userSchema.methods.checkMonthlyReset = function() {
  const now = new Date();
  const lastReset = new Date(this.lastValidationReset);
  
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    this.monthlyValidations = 0;
    this.lastValidationReset = now;
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
