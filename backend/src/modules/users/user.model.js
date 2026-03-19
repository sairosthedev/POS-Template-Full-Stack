const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  pinHash: { type: String, select: false },
  role: { type: String, enum: ['Admin', 'Manager', 'Cashier'], default: 'Cashier' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Hash PIN (stored separately from password)
UserSchema.pre('save', async function() {
  if (!this.isModified('pinHash')) return;
  if (!this.pinHash) return;
  // If pinHash contains a plain PIN temporarily, hash it here.
  this.pinHash = await bcrypt.hash(this.pinHash, 10);
});

// Method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.comparePin = async function(candidatePin) {
  if (!this.pinHash) return false;
  return await bcrypt.compare(candidatePin, this.pinHash);
};

module.exports = mongoose.model('User', UserSchema);
