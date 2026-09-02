const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  subject: { type: String, default: 'General Inquiry', trim: true },
  message: { type: String, required: true },
  sentToEmail: { type: Boolean, default: false },
  status: { type: String, enum: ['received', 'emailed', 'failed'], default: 'received' },
  errorDetails: { type: String, default: null }
}, {
  timestamps: true,
  collection: 'portfolio_messages'
});

module.exports = mongoose.models.PortfolioMessage || mongoose.model('PortfolioMessage', messageSchema, 'portfolio_messages');
