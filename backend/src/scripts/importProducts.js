/**
 * Imports products from a CSV export (id,name,product_code,product_barcode,...).
 *
 * Usage:
 *   node src/scripts/importProducts.js <path-to-csv> [--with-stock]
 *
 * - Upserts by product name (re-running is safe).
 * - Duplicate names: the row with a real (non-zero) price wins.
 * - Stock starts at 0 unless --with-stock is passed (the source system's
 *   quantity column is usually unreliable); set real stock with a stock take.
 * - Creates any missing categories.
 */
require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const { connectMongo } = require('../config/db');
const Product = require('../modules/products/product.model');
const Category = require('../modules/products/category.model');

const CATEGORY_FIXES = { Toiltries: 'Toiletries' };

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    header.forEach((key, i) => { row[key] = (cells[i] ?? '').trim(); });
    return row;
  });
}

async function main() {
  const csvPath = process.argv[2];
  const withStock = process.argv.includes('--with-stock');
  if (!csvPath || !fs.existsSync(csvPath)) {
    console.error('Usage: node src/scripts/importProducts.js <path-to-csv> [--with-stock]');
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  console.log(`Parsed ${rows.length} rows from ${csvPath}`);

  await connectMongo(process.env.MONGO_URI);

  let created = 0;
  let updated = 0;
  let skippedDuplicates = 0;
  let zeroPrice = 0;
  const categories = new Set();

  for (const row of rows) {
    const name = row.name;
    if (!name) continue;

    const category = CATEGORY_FIXES[row.category] || row.category || 'General';
    categories.add(category);

    const price = Number(row.product_price) || 0;
    const cost = Number(row.product_cost) || 0;
    const alertRaw = Number(row.stock_alert) || 0;
    const doc = {
      name,
      category,
      unit: row.unit || 'Unit',
      price,
      cost,
      // The source system's alert values are often junk (e.g. 10000); only
      // accept plausible ones.
      stockAlert: alertRaw > 0 && alertRaw <= 1000 ? alertRaw : 5,
      ...(row.product_barcode ? { barcode: row.product_barcode } : {}),
      ...(withStock ? { stock: Number(row.total_quantity) || 0 } : {}),
    };
    if (price === 0) zeroPrice += 1;

    const existing = await Product.findOne({ name });
    if (!existing) {
      await Product.create({ ...doc, stock: doc.stock ?? 0 });
      created += 1;
    } else if (price > 0 && Number(existing.price) === 0) {
      // Duplicate name where this row has the real price — take it.
      Object.assign(existing, doc);
      await existing.save();
      updated += 1;
    } else if (price === 0 && Number(existing.price) > 0) {
      skippedDuplicates += 1; // keep the priced copy
    } else {
      // Same name again (re-run or plain duplicate): refresh fields.
      Object.assign(existing, doc);
      await existing.save();
      updated += 1;
    }
  }

  for (const name of categories) {
    await Category.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
  }

  const total = await Product.countDocuments({});
  console.log(`Done. Created ${created}, updated ${updated}, skipped ${skippedDuplicates} zero-price duplicates.`);
  console.log(`${zeroPrice} rows had price 0.00 — set their prices in the dashboard before selling them.`);
  console.log(`Categories ensured: ${[...categories].join(', ')}`);
  console.log(`Products now in database: ${total}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
