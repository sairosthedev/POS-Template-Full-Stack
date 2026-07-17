// Vercel serverless entry point. All routes are rewritten here (see vercel.json);
// the Express app handles routing exactly as it does locally.
const app = require('../src/app');
const { connectMongo } = require('../src/config/db');

// Reuse the MongoDB connection across invocations of a warm lambda —
// reconnecting per request would exhaust Atlas connection limits.
let connPromise = null;

module.exports = async (req, res) => {
  if (!connPromise) {
    connPromise = connectMongo(process.env.MONGO_URI).catch((err) => {
      connPromise = null; // allow retry on next request
      throw err;
    });
  }
  await connPromise;
  return app(req, res);
};
