const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  totalEmails: {
    type: Number,
    default: 0
  },
  processedEmails: {
    type: Number,
    default: 0
  },
  validCount: {
    type: Number,
    default: 0
  },
  invalidCount: {
    type: Number,
    default: 0
  },
  catchAllCount: {
    type: Number,
    default: 0
  },
  resultFileUrl: {
    type: String
  },
  errorMessage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Virtual for progress percentage
jobSchema.virtual('progress').get(function() {
  if (this.totalEmails === 0) return 0;
  return Math.round((this.processedEmails / this.totalEmails) * 100);
});

// Ensure virtuals are included in JSON
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
