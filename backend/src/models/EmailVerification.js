const mongoose = require('mongoose');

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    domain: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    provider: {
      type: String,
      default: 'mailtester',
      index: true,
    },
    mailtesterSubscriptionId: {
      type: String,
      trim: true,
      index: true,
    },
    mailtesterSubscriptionIdHash: {
      type: String,
      trim: true,
      index: true,
    },
    mailtesterPlan: {
      type: String,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    mx: {
      type: String,
      trim: true,
    },
    catchAll: {
      type: Boolean,
      default: false,
    },
    disposable: {
      type: Boolean,
      default: false,
    },
    roleBased: {
      type: Boolean,
      default: false,
    },
    mxRecords: {
      type: Boolean,
      default: true,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    creditsConsumed: {
      type: Number,
      default: 1,
    },
    latencyMs: {
      type: Number,
      default: null,
    },
    raw: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

emailVerificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);
