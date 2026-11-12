# DecodeLabs Project 2 — Backend API Development

## Project overview
A small REST-style User Management API built with Node.js and Express. It demonstrates GET and POST endpoints, JSON request/response handling, server-side validation, and meaningful HTTP status codes.

**Important:** This project uses temporary in-memory storage. It is intentionally separate from Project 3, which demonstrates database integration. Users created through the API are cleared when the server restarts.

## Requirements
- Node.js 18 or newer
- npm

## Install and run
```bash
npm install
npm test
npm start
```
Open `http://127.0.0.1:3000` in a browser on the same device.

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API welcome and endpoint overview |
| GET | `/api/health` | Health check |
| GET | `/api/users` | Retrieve all users |
| GET | `/api/users/:id` | Retrieve one user |
| POST | `/api/users` | Create a user |

## Create a user
Send a POST request to `/api/users` with JSON:
```json
{
  "fullName": "Ada Okafor",
  "email": "ada@example.com",
  "age": 20
}
```

Example with curl:
```bash
curl -X POST http://127.0.0.1:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Ada Okafor","email":"ada@example.com","age":20}'
```

Retrieve all users:
```bash
curl http://127.0.0.1:3000/api/users
```

Retrieve one user:
```bash
curl http://127.0.0.1:3000/api/users/1
```

## Validation rules
- `fullName` is required and must contain 2–80 characters.
- `email` is required and must have a basic valid email format.
- `age` is required and must be a whole number from 13 to 120.
- Email addresses are trimmed and converted to lowercase.
- Duplicate email addresses are rejected.

## HTTP status codes used
- `200 OK`: successful GET request.
- `201 Created`: user successfully created.
- `400 Bad Request`: invalid input, invalid ID, or malformed JSON.
- `404 Not Found`: user or route does not exist.
- `409 Conflict`: duplicate email address.
- `413 Content Too Large`: request body exceeds the limit.
- `500 Internal Server Error`: unexpected server error.

## Design notes
- Resource-based REST naming: `/api/users`.
- JSON is used for request and response bodies.
- The server validates input; it does not rely on browser/client validation.
- Errors use a consistent JSON response structure.
- The API does not include a database; persistence is the focus of Project 3.

## Project structure
```text
decodelabs-project-2/
├── src/
│   ├── app.js
│   ├── server.js
│   └── validation.js
├── tests/
│   └── api.test.js
├── package.json
└── README.md
```
