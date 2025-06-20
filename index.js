import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = 4000;

// Middleware to enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Connect to MongoDB using connection string from .env
mongoose.connect(process.env.MONGO_URI);

// Define Mongoose schema and model for a Task
const taskSchema = new mongoose.Schema({
  text: String, // Task description
  status: { type: String, default: 'todo' } // Task status: todo | doing | done
});

const Task = mongoose.model('Task', taskSchema);

// GET /tasks - Retrieve all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res) => {
  const { text, status } = req.body;
  const newTask = new Task({ text, status: status || 'todo' });
  await newTask.save();
  res.status(201).json(newTask);
});

// PATCH /tasks/:id - Update task status by ID
app.patch('/tasks/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});

// DELETE /tasks/:id - Delete task by ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});

// POST /ai/suggest - AI will suggest which task is priority
app.post('/ai/suggest', async (req, res) => {
  const { tasks } = req.body;
  console.log("AI suggest body:", req.body);

  const todos = tasks.filter(t => t.status === "todo");

  if (todos.length === 0) {
    return res.json({ suggestion: "No pending tasks. You're all caught up!" });
  }

  // Heuristic: pick task with most 'actionable' verb
  const actionVerbs = ["write", "create", "call", "email", "fix", "update", "design", "review"];
  const prioritized = todos.find(t =>
    actionVerbs.some(v => t.text.toLowerCase().startsWith(v))
  );

  const suggestion = prioritized
    ? `Suggested: "${prioritized.text}"`
    : `Maybe start with: "${todos[0].text}"`;

  res.json({ suggestion });
});

// Start server
app.listen(PORT, () => {
  console.log(`TaskCanvas API with MongoDB running at http://localhost:${PORT}`);
});
