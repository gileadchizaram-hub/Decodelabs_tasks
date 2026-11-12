const app = require("./app");
const { initializeDatabase } = require("./database");

const PORT = Number(process.env.PORT) || 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`DecodeLabs Project 3 running at http://localhost:${PORT}`);
      console.log("Database: SQLite | API: /api/students");
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
