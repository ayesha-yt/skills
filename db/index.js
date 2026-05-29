const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// Manually load env variables if not defined (e.g., when running raw Node.js script)
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      });
      console.log('Manually loaded .env.local variables into process.env.');
    }
  } catch (err) {
    // silent
  }
}

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

    // Auto-create PostgreSQL tables if they do not exist
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255),
          avatar TEXT,
          skills TEXT,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS services (
          id SERIAL PRIMARY KEY,
          seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          platform_fee DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'approved',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
          buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'requested',
          total_amount DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ratings (
          id SERIAL PRIMARY KEY,
          booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          comment TEXT
        );
      `);

      // Auto-migrate PostgreSQL columns if they do not exist
      await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'").catch(() => {});
      await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP").catch(() => {});
      await pool.query("ALTER TABLE services ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10,2) DEFAULT 0.0").catch(() => {});
      await pool.query("ALTER TABLE services ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'approved'").catch(() => {});

      console.log('PostgreSQL tables checked/created/migrated successfully.');
    } catch (err) {
      console.error('Error auto-creating PostgreSQL tables:', err);
    }

    // Wrapper to make PG act like SQLite for basic queries
    global.dbInstance = {
      all: async (sql, ...params) => {
        const actualParams = Array.isArray(params[0]) ? params[0] : params;
        let counter = 1;
        const processedSql = sql.replace(/\?/g, () => `$${counter++}`);
        console.log('PG Query (all):', processedSql, actualParams);
        const res = await pool.query(processedSql, actualParams);
        return res.rows;
      },
      get: async (sql, ...params) => {
        const actualParams = Array.isArray(params[0]) ? params[0] : params;
        let counter = 1;
        const processedSql = sql.replace(/\?/g, () => `$${counter++}`);
        console.log('PG Query (get):', processedSql, actualParams);
        const res = await pool.query(processedSql, actualParams);
        return res.rows[0];
      },
      run: async (sql, ...params) => {
        const actualParams = Array.isArray(params[0]) ? params[0] : params;
        let counter = 1;
        let processedSql = sql.replace(/\?/g, () => `$${counter++}`);
        if (processedSql.trim().toLowerCase().startsWith('insert')) {
          processedSql += ' RETURNING id';
        }
        console.log('PG Query (run):', processedSql, actualParams);
        const res = await pool.query(processedSql, actualParams);
        return { lastID: res.rows[0]?.id, rowsAffected: res.rowCount };
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
