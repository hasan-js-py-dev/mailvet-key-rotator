const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
  webhookId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
