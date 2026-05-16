const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

if (!global.dbInstance) {
  global.dbInstance = null;
}

async function getDb() {
  if (global.dbInstance) return global.dbInstance;

  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    // Connect to Supabase (PostgreSQL)
    const pool = new Pool({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false } // Required for Supabase/Render
    });

    // Wrapper to make PG act like SQLite for basic queries
    global.dbInstance = {
      all: async (sql, params = []) => {
        const res = await pool.query(sql.replace(/\?/g, (_, i) => `$${i + 1}`), params);
        return res.rows;
      },
      get: async (sql, params = []) => {
        const res = await pool.query(sql.replace(/\?/g, (_, i) => `$${i + 1}`), params);
        return res.rows[0];
      },
      run: async (sql, params = []) => {
        return await pool.query(sql.replace(/\?/g, (_, i) => `$${i + 1}`), params);
      },
      isPostgres: true
    };
    console.log('Connected to Supabase (PostgreSQL)');
  } else {
    // Fallback to local SQLite
    const dbPath = path.resolve(process.cwd(), 'db/skillbridge.db');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Auto-migrate SQLite
    await db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'").catch(() => {});
    await db.run("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP").catch(() => {});
    await db.run("ALTER TABLE services ADD COLUMN status TEXT DEFAULT 'pending'").catch(() => {});

    global.dbInstance = db;
    console.log('Connected to local SQLite');
  }

  return global.dbInstance;
}

module.exports = getDb;
