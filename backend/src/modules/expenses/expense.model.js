const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
