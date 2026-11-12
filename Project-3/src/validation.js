function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateStudent(input) {
  const student = {
    full_name: clean(input.full_name),
    matric_no: clean(input.matric_no).toUpperCase(),
    department: clean(input.department),
    level: clean(input.level),
    email: clean(input.email),
    phone: clean(input.phone)
  };

  const errors = [];
  if (student.full_name.length < 2) errors.push("Full name must contain at least 2 characters.");
  if (!/^[A-Z0-9/-]{3,30}$/.test(student.matric_no)) {
    errors.push("Matric number must be 3–30 characters and use letters, numbers, / or -.");
  }
  if (student.department.length < 2) errors.push("Department is required.");
  if (!["100", "200", "300", "400", "500", "600"].includes(student.level)) {
    errors.push("Select a valid level.");
  }
  if (student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    errors.push("Enter a valid email address.");
  }
  if (student.phone && !/^[+0-9()\-\s]{7,20}$/.test(student.phone)) {
    errors.push("Enter a valid phone number.");
  }

  return { student, errors };
}

module.exports = { validateStudent };
