import { createApp } from "./app.js";

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`DecodeLabs Project 2 API running at http://127.0.0.1:${PORT}`);
  console.log("Endpoints: GET /api/users | GET /api/users/:id | POST /api/users");
});