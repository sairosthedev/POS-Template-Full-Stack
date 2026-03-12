const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  contactNumber: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);
