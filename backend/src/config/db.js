const dns = require('node:dns');
const mongoose = require('mongoose');

/**
 * Connect to MongoDB. Some routers/ISP DNS servers refuse the SRV lookups that
 * mongodb+srv:// URIs require (querySrv ECONNREFUSED / ENOTFOUND even though the
 * cluster exists). When that happens, retry once using public resolvers.
 */
async function connectMongo(uri) {
  try {
    return await mongoose.connect(uri);
  } catch (error) {
    if (String(error.message).includes('querySrv')) {
      console.warn('System DNS could not resolve MongoDB SRV records; retrying with public DNS (8.8.8.8)…');
      dns.setServers(['8.8.8.8', '1.1.1.1']);
      return await mongoose.connect(uri);
    }
    throw error;
  }
}

const connectDB = async () => {
  try {
    const conn = await connectMongo(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Sync Product indexes (drops old non-sparse barcode index, recreates sparse)
    const Product = require('../modules/products/product.model');
    await Product.syncIndexes();
    console.log('Product indexes synced (barcode is sparse-unique, allows multiple nulls)');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.connectMongo = connectMongo;
