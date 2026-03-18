import * as SQLite from 'expo-sqlite';

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('miccs-pos.db');
  }
  return dbPromise;
}

export async function initDb() {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS products (
      _id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      barcode TEXT,
      category TEXT,
      price REAL NOT NULL,
      cost REAL,
      stock REAL,
      unit TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS inventory (
      productId TEXT NOT NULL,
      branchId TEXT NOT NULL,
      quantity REAL NOT NULL,
      updatedAt TEXT,
      PRIMARY KEY (productId, branchId)
    );

    CREATE TABLE IF NOT EXISTS sales (
      _id TEXT PRIMARY KEY NOT NULL,
      cashierId TEXT,
      branchId TEXT,
      total REAL NOT NULL,
      paymentMethod TEXT,
      createdAt TEXT NOT NULL,
      syncStatus TEXT NOT NULL DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS sale_items (
      _id TEXT PRIMARY KEY NOT NULL,
      saleId TEXT NOT NULL,
      productId TEXT NOT NULL,
      quantity REAL NOT NULL,
      price REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      _id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}

export async function upsertProducts(products = []) {
  if (!Array.isArray(products) || products.length === 0) return;
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    for (const p of products) {
      if (!p?._id || !p?.name) continue;
      await db.runAsync(
        `INSERT INTO products (_id, name, barcode, category, price, cost, stock, unit, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(_id) DO UPDATE SET
           name=excluded.name,
           barcode=excluded.barcode,
           category=excluded.category,
           price=excluded.price,
           cost=excluded.cost,
           stock=excluded.stock,
           unit=excluded.unit,
           updatedAt=excluded.updatedAt
        `,
        [
          String(p._id),
          String(p.name),
          p.barcode ? String(p.barcode) : null,
          p.category ? String(p.category) : null,
          Number(p.price ?? 0),
          p.cost == null ? null : Number(p.cost),
          p.stock == null ? null : Number(p.stock),
          p.unit ? String(p.unit) : null,
          new Date().toISOString(),
        ],
      );
    }
  });
}

export async function getProducts({ limit = 100 } = {}) {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT * FROM products ORDER BY name ASC LIMIT ?`,
    [Number(limit)],
  );
}

export async function getProductByBarcode(barcode) {
  if (!barcode) return null;
  const db = await getDb();
  const rows = await db.getAllAsync(`SELECT * FROM products WHERE barcode = ? LIMIT 1`, [
    String(barcode),
  ]);
  return rows?.[0] || null;
}

export async function enqueueSync(type, payload) {
  const db = await getDb();
  const id =
    global.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await db.runAsync(
    `INSERT INTO sync_queue (_id, type, payload, createdAt) VALUES (?, ?, ?, ?)`,
    [id, String(type), JSON.stringify(payload ?? {}), new Date().toISOString()],
  );
  return id;
}

export async function getSyncQueue({ limit = 20 } = {}) {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT * FROM sync_queue ORDER BY createdAt ASC LIMIT ?`,
    [Number(limit)],
  );
}

export async function deleteSyncQueueItem(id) {
  const db = await getDb();
  await db.runAsync(`DELETE FROM sync_queue WHERE _id = ?`, [String(id)]);
}

