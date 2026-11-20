# Smart Task Manager (React + Node.js + Express + MySQL)

A beginner-friendly full-stack CRUD project. The React frontend calls REST APIs on the Express server; Express reads/writes tasks in MySQL.

## Requirements
- Node.js 18+ (LTS recommended)
- MySQL Server 8+ and MySQL Workbench (optional, but helpful)
- VS Code

## 1. Create the database
Open MySQL Workbench (or MySQL command line) and run the contents of `database/schema.sql`.

This creates:
- Database: `smart_task_manager`
- Table: `tasks`

## 2. Configure the backend
Open a terminal in the `backend` folder:

```bash
npm install
```

Copy `.env.example` to `.env` and update the MySQL username/password:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smart_task_manager
```

Start the backend:

```bash
npm run dev
```

You should see:
- `MySQL connected`
- `Server running at http://localhost:5000`

Test the API in a browser:
- `http://localhost:5000/api/health`
- `http://localhost:5000/api/tasks`

Keep this terminal running.

## 3. Configure and start the frontend
Open a SECOND terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

## 4. How frontend, API and database connect

1. React renders the task manager in the browser.
2. When you add/update/delete a task, React sends an HTTP request using `fetch()`.
3. The request goes to Express at `http://localhost:5000/api/tasks`.
4. Express validates the request and runs a parameterized SQL query using `mysql2`.
5. MySQL stores or returns the task.
6. Express sends JSON back; React updates the screen.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server |
| GET | `/api/tasks` | Get all tasks; optional `?search=word&status=pending` |
| POST | `/api/tasks` | Create task: `{ "title": "Study DSA", "description": "Arrays", "status": "pending" }` |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Common problems
- **Access denied for MySQL user:** Check `DB_USER` and `DB_PASSWORD` in `backend/.env`.
- **Unknown database:** Run `database/schema.sql` in MySQL.
- **ECONNREFUSED / API unavailable:** Start backend first; confirm it is on port 5000.
- **Port 5000 already in use:** Change `PORT` in `.env`, then update `VITE_API_URL` in `frontend/.env` to match.
- **CORS error:** Keep frontend on Vite's `http://localhost:5173` and backend on `http://localhost:5000`, or update the CORS origin in `backend/server.js`.

## Resume entry (use only after you have built and tested it)
**Smart Task Manager – Full Stack Web Application**

Developed a responsive task management application to help users organize, track, and manage daily activities efficiently.

- Designed an interactive and responsive user interface using React.js, HTML, CSS, and Bootstrap.
- Developed RESTful APIs using Node.js and Express.js to handle CRUD operations (Create, Read, Update, Delete).
- Integrated MySQL database to store, retrieve, and manage task information efficiently.
- Implemented task searching, status filtering, and completion tracking using JavaScript.

**Technologies Used:** HTML, CSS, Bootstrap, JavaScript, React.js, Node.js, Express.js, MySQL.
