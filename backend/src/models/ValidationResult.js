const mongoose = require('mongoose');

const validationResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  valid: {
    type: Boolean
  },
  code: {
    type: String,
    enum: ['ok', 'ko', 'mb', 'unknown'],
    default: 'unknown'
  },
  message: {
    type: String
  },
  user: {
    type: String
  },
  domain: {
    type: String
  },
  mx: {
    type: String
  },
  catchAll: {
    type: Boolean,
    default: false
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'unknown'],
    default: 'unknown'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
validationResultSchema.index({ userId: 1, createdAt: -1 });
validationResultSchema.index({ jobId: 1 });
validationResultSchema.index({ email: 1, userId: 1 });

module.exports = mongoose.model('ValidationResult', validationResultSchema);
