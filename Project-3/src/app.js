const express = require("express");
const { getDatabase, saveDatabase } = require("./database");
const { validateStudent } = require("./validation");

const app = express();
app.use(express.json({ limit: "30kb" }));
app.use(express.static("public"));

function rowsFromStatement(statement) {
  const rows = [];
  while (statement.step()) rows.push(statement.getAsObject());
  statement.free();
  return rows;
}

function allStudents(search = "") {
  const db = getDatabase();
  const term = `%${search}%`;
  const statement = db.prepare(`
    SELECT * FROM students
    WHERE full_name LIKE $term OR matric_no LIKE $term OR department LIKE $term
    ORDER BY id DESC
  `);
  statement.bind({ $term: term });
  return rowsFromStatement(statement);
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", project: "DecodeLabs Project 3", database: "SQLite" });
});

app.get("/api/students", (req, res) => {
  try {
    res.json({ success: true, count: allStudents(String(req.query.search || "" )).length,
      data: allStudents(String(req.query.search || "")) });
  } catch {
    res.status(500).json({ success: false, message: "Could not retrieve student records." });
  }
});

app.get("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: "Invalid student ID." });
  }
  const statement = getDatabase().prepare("SELECT * FROM students WHERE id = $id");
  statement.bind({ $id: id });
  const rows = rowsFromStatement(statement);
  if (!rows.length) return res.status(404).json({ success: false, message: "Student not found." });
  res.json({ success: true, data: rows[0] });
});

app.post("/api/students", (req, res) => {
  const { student, errors } = validateStudent(req.body || {});
  if (errors.length) return res.status(400).json({ success: false, errors });
  try {
    const db = getDatabase();
    const statement = db.prepare(`
      INSERT INTO students (full_name, matric_no, department, level, email, phone)
      VALUES ($full_name, $matric_no, $department, $level, $email, $phone)
    `);
    statement.run({
      $full_name: student.full_name, $matric_no: student.matric_no,
      $department: student.department, $level: student.level,
      $email: student.email, $phone: student.phone
    });
    statement.free();
    const id = db.exec("SELECT last_insert_rowid() AS id")[0].values[0][0];
    saveDatabase();
    return res.status(201).json({ success: true, message: "Student added successfully.", data: allStudents().find(x => x.id === id) });
  } catch (error) {
    if (String(error.message).toLowerCase().includes("unique")) {
      return res.status(409).json({ success: false, message: "That matric number already exists." });
    }
    res.status(500).json({ success: false, message: "Could not save student record." });
  }
});

app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: "Invalid student ID." });
  const { student, errors } = validateStudent(req.body || {});
  if (errors.length) return res.status(400).json({ success: false, errors });
  try {
    const db = getDatabase();
    const exists = db.exec("SELECT id FROM students WHERE id = " + id);
    if (!exists.length || !exists[0].values.length) return res.status(404).json({ success: false, message: "Student not found." });
    const statement = db.prepare(`
      UPDATE students SET full_name=$full_name, matric_no=$matric_no,
      department=$department, level=$level, email=$email, phone=$phone,
      updated_at=CURRENT_TIMESTAMP WHERE id=$id
    `);
    statement.run({
      $full_name: student.full_name, $matric_no: student.matric_no,
      $department: student.department, $level: student.level,
      $email: student.email, $phone: student.phone, $id: id
    });
    statement.free();
    saveDatabase();
    const result = db.prepare("SELECT * FROM students WHERE id=$id");
    result.bind({ $id: id });
    res.json({ success: true, message: "Student updated successfully.", data: rowsFromStatement(result)[0] });
  } catch (error) {
    if (String(error.message).toLowerCase().includes("unique")) {
      return res.status(409).json({ success: false, message: "That matric number already exists." });
    }
    res.status(500).json({ success: false, message: "Could not update student record." });
  }
});

app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: "Invalid student ID." });
  const db = getDatabase();
  const statement = db.prepare("DELETE FROM students WHERE id=$id");
  statement.run({ $id: id });
  const changes = db.getRowsModified();
  statement.free();
  if (!changes) return res.status(404).json({ success: false, message: "Student not found." });
  saveDatabase();
  res.json({ success: true, message: "Student deleted successfully." });
});

app.use("/api", (_req, res) => res.status(404).json({ success: false, message: "API route not found." }));

module.exports = app;
