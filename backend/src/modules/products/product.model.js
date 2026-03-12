const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  barcode: { type: String, unique: true, sparse: true },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  stockAlert: { type: Number, default: 5 },
  unit: { type: String, default: 'Unit' },
  description: { type: String },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
