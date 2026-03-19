const mongoose = require('mongoose');

const SaleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const SaleSchema = new mongoose.Schema({
  cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  items: [SaleItemSchema],
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  amountReceived: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  receiptNo: { type: String, index: true },
  status: { type: String, enum: ['Completed', 'Voided'], default: 'Completed' },
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);
