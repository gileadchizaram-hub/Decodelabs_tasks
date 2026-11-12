# DecodeLabs Full Stack Project 3
## Student Record Management System

A responsive full-stack application demonstrating database integration and CRUD operations.

### Project requirements covered
- Database schema design using SQLite.
- Create, read, update and delete student records.
- Backend integration through a Node.js + Express REST API.
- Data validation, duplicate matric-number protection, parameterized SQL queries and error handling.
- Persistent database file at `data/students.sqlite`.

### Technology
- Frontend: HTML, CSS and vanilla JavaScript
- Backend: Node.js and Express
- Database: SQLite through `sql.js` (SQLite compiled to WebAssembly)
- Testing: Node.js built-in test runner

### Run on Android with Termux
1. Install Termux from F-Droid or its official GitHub release.
2. Open Termux and run:

```bash
pkg update && pkg upgrade -y
pkg install nodejs-lts unzip -y
```

3. Move the downloaded ZIP into Termux's Downloads-accessible storage, then:

```bash
termux-setup-storage
cd ~/storage/downloads
unzip decodelabs-project-3.zip
cd decodelabs-project-3
npm install
npm test
npm start
```

4. Open `http://127.0.0.1:3000` in Chrome on the same phone.

If the ZIP is saved in a different folder, navigate to that folder before running `unzip`.

### API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server/database status |
| GET | `/api/students` | List all students |
| GET | `/api/students?search=ada` | Search student records |
| GET | `/api/students/:id` | Read one student |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Example POST body

```json
{
  "full_name": "Ada Okafor",
  "matric_no": "2026/001",
  "department": "Computer Science",
  "level": "200",
  "email": "ada@example.com",
  "phone": "+2348012345678"
}
```

### Database schema

`students` table:
- `id`: integer primary key, auto-increment
- `full_name`: required text
- `matric_no`: required unique text
- `department`: required text
- `level`: required text
- `email`: optional text
- `phone`: optional text
- `created_at`: timestamp
- `updated_at`: timestamp

### Important notes
- Do not upload real student personal information to a public repository.
- The database file is created automatically on first start.
- Keep `data/students.sqlite` backed up if you need to preserve records.
- This is a learning/demo project, not a production student information system.
