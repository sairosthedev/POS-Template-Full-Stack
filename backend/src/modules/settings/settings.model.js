const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'Miccs POS' },
  currency: { type: String, default: 'USD' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  taxRate: { type: Number, default: 0 },
  theme: { type: String, default: 'light' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
