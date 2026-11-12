import express from "express";
import { validateUser } from "./validation.js";

export function createApp() {
  const app = express();
  const users = [];
  let nextId = 1;

  app.disable("x-powered-by");
  app.use(express.json({ limit: "20kb" }));

  app.get("/", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "DecodeLabs Project 2 - User Management API",
      documentation: {
        listUsers: "GET /api/users",
        getUser: "GET /api/users/:id",
        createUser: "POST /api/users"
      }
    });
  });

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, status: "ok", project: "DecodeLabs Project 2" });
  });

  // GET: retrieve all users
  app.get("/api/users", (_req, res) => {
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  });

  // GET: retrieve one user by numeric ID
  app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ success: false, message: "User ID must be a positive integer." });
    }

    const user = users.find((item) => item.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, data: user });
  });

  // POST: validate and create a user
  app.post("/api/users", (req, res) => {
    const result = validateUser(req.body);
    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: result.errors
      });
    }

    const duplicate = users.some((user) => user.email === result.data.email);
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists."
      });
    }

    const user = {
      id: nextId++,
      ...result.data,
      createdAt: new Date().toISOString()
    };
    users.push(user);

    return res
      .status(201)
      .location(`/api/users/${user.id}`)
      .json({
        success: true,
        message: "User created successfully.",
        data: user
      });
  });

  // Consistent response for unknown routes
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "API route not found." });
  });

  // JSON parsing and unexpected server errors
  app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError && "body" in err) {
      return res.status(400).json({ success: false, message: "Request body contains invalid JSON." });
    }
    if (err?.type === "entity.too.large") {
      return res.status(413).json({ success: false, message: "Request body is too large." });
    }
    return res.status(500).json({ success: false, message: "Internal server error." });
  });

  return app;
}