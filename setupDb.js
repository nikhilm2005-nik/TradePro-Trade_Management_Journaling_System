// setupDb.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for cloud databases like Neon
});

async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS trades (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ticker VARCHAR(50) NOT NULL,
      direction VARCHAR(10) NOT NULL,
      entry_date TIMESTAMP NOT NULL,
      exit_date TIMESTAMP,
      entry_price DECIMAL NOT NULL,
      exit_price DECIMAL,
      size DECIMAL NOT NULL,
      fees DECIMAL DEFAULT 0.0,
      net_pnl DECIMAL,
      setup VARCHAR(100),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(query);
    console.log("✅ Database table 'trades' created successfully!");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  } finally {
    pool.end();
  }
}

createTable();