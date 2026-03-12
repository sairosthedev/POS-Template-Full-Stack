const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  changeType: { type: String, enum: ['Restock', 'Sale', 'Adjustment', 'Damage'], required: true },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  note: { type: String },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('InventoryLog', InventoryLogSchema);
