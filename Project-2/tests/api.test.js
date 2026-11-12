import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

let server;
let baseUrl;

beforeEach(async () => {
  server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterEach(async () => {
  if (server) await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
});

test("GET /api/users returns an empty JSON list", async () => {
  const response = await fetch(`${baseUrl}/api/users`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.deepEqual(body.data, []);
});

test("POST /api/users creates a valid user with status 201", async () => {
  const response = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fullName: "Ada Okafor", email: "ADA@example.com", age: 20 })
  });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.equal(body.data.fullName, "Ada Okafor");
  assert.equal(body.data.email, "ada@example.com");
  assert.equal(response.headers.get("location"), "/api/users/1");
});

test("POST /api/users rejects missing and invalid fields with status 400", async () => {
  const response = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fullName: "", email: "not-an-email", age: 10 })
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.ok(body.errors.length >= 3);
});

test("GET /api/users/:id returns 404 when the user does not exist", async () => {
  const response = await fetch(`${baseUrl}/api/users/99`);
  assert.equal(response.status, 404);
});

test("duplicate email returns status 409", async () => {
  const payload = { fullName: "Ada Okafor", email: "ada@example.com", age: 20 };
  await fetch(`${baseUrl}/api/users`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload)
  });
  const response = await fetch(`${baseUrl}/api/users`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload)
  });
  assert.equal(response.status, 409);
});

test("malformed JSON returns status 400", async () => {
  const response = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{bad json"
  });
  assert.equal(response.status, 400);
});