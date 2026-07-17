/**
 * Creates (or resets) the initial Admin account.
 *
 * Usage:
 *   npm run seed:admin -- admin@example.com StrongPassword123 "Store Owner" 1234
 *   (the 4th argument — the POS PIN — is optional)
 * or via env vars:
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... ADMIN_PIN=... npm run seed:admin
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { connectMongo } = require('../config/db');
const User = require('../modules/users/user.model');

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || process.env.ADMIN_NAME || 'Administrator';
  const pin = process.argv[5] || process.env.ADMIN_PIN || '';

  if (!email || !password) {
    console.error('Usage: npm run seed:admin -- <email> <password> [name]');
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  await connectMongo(process.env.MONGO_URI);

  if (pin && !/^\d{4,6}$/.test(pin)) {
    console.error('PIN must be 4-6 digits.');
    process.exit(1);
  }

  let user = await User.findOne({ email }).select('+pinHash');
  if (user) {
    user.name = name;
    user.password = password; // re-hashed by the pre-save hook
    user.role = 'Admin';
    if (pin) user.pinHash = pin; // hashed by the pre-save hook
    await user.save();
    console.log(`Existing user ${email} updated: role set to Admin, password reset${pin ? ', PIN set' : ''}.`);
  } else {
    user = new User({ name, email, password, role: 'Admin', ...(pin ? { pinHash: pin } : {}) });
    await user.save();
    console.log(`Admin account created for ${email}${pin ? ' (PIN set)' : ''}.`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
