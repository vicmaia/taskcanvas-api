# TaskCanvas API

This is the lightweight backend for the **TaskCanvas** project, built with **Node.js**, **Express**, and **MongoDB Atlas**. It exposes a simple REST API to manage tasks across different status categories — `todo`, `doing`, and `done`.

---

## How to Run

```bash
cd taskcanvas-api
npm install
npm start
```

The API will be available at: `http://localhost:4000`

---

## Endpoints

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

## Notes

- All data is persisted to MongoDB Atlas — no data loss on restart.
- See the frontend app in taskcanvas for the full experience.

## Author

Built by Victoria Maia.
