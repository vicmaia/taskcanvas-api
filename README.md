# 🛠️ TaskCanvas API

This is the lightweight backend for the TaskCanvas project, built with Node.js and Express. It provides a minimal REST API for task management.

---

## 🚀 How to Run

```bash
cd taskcanvas-api
npm install
npm start
```

The API will be available at: `http://localhost:4000`

---

## 📦 Endpoints

### `GET /tasks`
Returns all tasks.

### `POST /tasks`
Create a new task.  
**Body:**
```json
{
  "text": "New task",
  "status": "todo"
}
```

### `PATCH /tasks/:id`
Update the status of a task.  
**Body:**
```json
{
  "status": "done"
}
```

### `DELETE /tasks/:id`
Delete a task by its ID.

---

## 🧠 Notes

- This API uses in-memory storage, so all tasks reset on restart.
- Easily extendable to use file storage or connect to a database like MongoDB or PostgreSQL.
