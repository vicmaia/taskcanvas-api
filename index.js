import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: "1", text: "Login", status: "todo" },
  { id: "2", text: "Create design", status: "todo" }
];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { text, status } = req.body;
  const newTask = {
    id: Date.now().toString(),
    text,
    status: status || "todo"
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Not found" });
  task.status = status;
  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).end();
});


app.listen(PORT, () => {
  console.log(`🚀 TaskCanvas API running at http://localhost:${PORT}`);
});
