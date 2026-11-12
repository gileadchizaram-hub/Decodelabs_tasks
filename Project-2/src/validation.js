export function validateUser(input) {
  const errors = [];

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: ["Request body must be a JSON object."] };
  }

  const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const age = input.age;

  if (!fullName) errors.push("fullName is required.");
  else if (fullName.length < 2 || fullName.length > 80) {
    errors.push("fullName must be between 2 and 80 characters.");
  }

  if (!email) errors.push("email is required.");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("email must be a valid email address.");
  }

  if (age === undefined || age === null || age === "") {
    errors.push("age is required.");
  } else if (!Number.isInteger(Number(age)) || Number(age) < 13 || Number(age) > 120) {
    errors.push("age must be a whole number between 13 and 120.");
  }

  return {
    valid: errors.length === 0,
    errors,
    data: { fullName, email, age: Number(age) }
  };
}