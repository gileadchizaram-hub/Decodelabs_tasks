const fs = require("node:fs");
const path = require("node:path");
const initSqlJs = require("sql.js");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "students.sqlite");

let db;

async function initializeDatabase() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const SQL = await initSqlJs({
    locateFile: (file) => path.join(__dirname, "..", "node_modules", "sql.js", "dist", file)
  });

  if (fs.existsSync(DB_FILE)) {
    const bytes = fs.readFileSync(DB_FILE);
    db = new SQL.Database(new Uint8Array(bytes));
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      matric_no TEXT NOT NULL UNIQUE,
      department TEXT NOT NULL,
      level TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDatabase();
  return db;
}

function saveDatabase() {
  if (!db) throw new Error("Database has not been initialized.");
  const data = db.export();
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

function getDatabase() {
  if (!db) throw new Error("Database has not been initialized.");
  return db;
}

module.exports = { initializeDatabase, getDatabase, saveDatabase };
