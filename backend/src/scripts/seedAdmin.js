/**
 * Creates (or resets) the initial Admin account.
 *
 * Usage:
 *   npm run seed:admin -- admin@example.com StrongPassword123 "Store Owner"
 * or via env vars:
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... npm run seed:admin
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../modules/users/user.model');

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || process.env.ADMIN_NAME || 'Administrator';

  if (!email || !password) {
    console.error('Usage: npm run seed:admin -- <email> <password> [name]');
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  let user = await User.findOne({ email });
  if (user) {
    user.name = name;
    user.password = password; // re-hashed by the pre-save hook
    user.role = 'Admin';
    await user.save();
    console.log(`Existing user ${email} updated: role set to Admin, password reset.`);
  } else {
    user = new User({ name, email, password, role: 'Admin' });
    await user.save();
    console.log(`Admin account created for ${email}.`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
