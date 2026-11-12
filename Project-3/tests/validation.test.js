const test = require("node:test");
const assert = require("node:assert/strict");
const { validateStudent } = require("../src/validation");

test("accepts a valid student and normalizes matric number", () => {
  const result = validateStudent({
    full_name: "Ada Okafor", matric_no: "2026/001",
    department: "Computer Science", level: "200",
    email: "ada@example.com", phone: "+2348012345678"
  });
  assert.deepEqual(result.errors, []);
  assert.equal(result.student.matric_no, "2026/001");
});

test("rejects missing required fields and invalid level", () => {
  const result = validateStudent({ full_name: "A", matric_no: "?", department: "", level: "900" });
  assert.ok(result.errors.length >= 4);
});

test("rejects malformed email", () => {
  const result = validateStudent({
    full_name: "Ada Okafor", matric_no: "ABC123",
    department: "Veterinary Medicine", level: "200", email: "not-an-email"
  });
  assert.ok(result.errors.some(error => error.includes("email")));
});
