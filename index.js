import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from "dotenv";

// Activate dotenv so we can use process.env.MONGO_URI
dotenv.config();

// Create an instance of an Express application
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB using the connection string in .env file
mongoose.connect(process.env.MONGO_URI);

// Define the structure of a task in MongoDB
const taskSchema = new mongoose.Schema({
  text: String, // Task description
  status: { type: String, default: 'todo' } // Status: 'todo', 'doing', or 'done'
});

const Task = mongoose.model('Task', taskSchema); // Create a Task model based on the schema

// GET all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find(); // Fetch all tasks from the DB
  res.json(tasks); // Return them as JSON
});

// POST a new task
app.post('/tasks', async (req, res) => {
  const { text, status } = req.body;
  const newTask = new Task({ text, status: status || 'todo' }); // Default status: 'todo'
  await newTask.save(); // Save to DB
  res.status(201).json(newTask); // Return the new task
});

// PATCH: Update task status
app.patch('/tasks/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated task
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});

// DELETE a task by ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});

// POST: Suggest which task to do next
app.post('/ai/suggest', async (req, res) => {
  const { tasks } = req.body;
  console.log("AI suggest body:", req.body);

  const todos = tasks.filter(t => t.status === "todo");

  if (todos.length === 0) {
    return res.json({ suggestion: "No pending tasks. You're all caught up!" });
  }

  // Suggest tasks that start with action verbs
  const actionVerbs = ["write", "create", "call", "email", "fix", "update", "design", "review"];
  const prioritized = todos.find(t =>
    actionVerbs.some(v => t.text.toLowerCase().startsWith(v))
  );

  const suggestion = prioritized
    ? `Suggested: "${prioritized.text}"`
    : `Maybe start with: "${todos[0].text}"`;

  res.json({ suggestion });
});

app.listen(PORT, () => {
  console.log(`TaskCanvas API with MongoDB running at http://localhost:${PORT}`);
});

export default app;