import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('galeria.db');

export function initDatabase() {
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image_uri TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos (created_at DESC);
    `);
    console.log('Banco inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  }
}