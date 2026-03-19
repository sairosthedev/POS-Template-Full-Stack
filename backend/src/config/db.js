const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
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
