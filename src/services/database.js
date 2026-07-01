import * as SQLite from 'expo-sqlite';

let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('weather.db');
  }
  return dbPromise;
}

export async function initDatabase() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT NOT NULL UNIQUE,
      createdAt INTEGER NOT NULL
    );
  `);
}

export async function addToHistory(city) {
  const db = await getDb();
  await db.runAsync('INSERT INTO history (city, createdAt) VALUES (?, ?)', [city, Date.now()]);
}

export async function getHistory(limit = 20) {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM history ORDER BY createdAt DESC LIMIT ?', [limit]);
}

export async function addFavorite(city) {
  const db = await getDb();
  await db.runAsync(
    'INSERT OR IGNORE INTO favorites (city, createdAt) VALUES (?, ?)',
    [city, Date.now()]
  );
}

export async function getFavorites() {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM favorites ORDER BY createdAt DESC');
}

export async function removeFavorite(city) {
  const db = await getDb();
  await db.runAsync('DELETE FROM favorites WHERE city = ?', [city]);
}
