import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const taskSchema = new mongoose.Schema({
  text: String,
  status: { type: String, default: 'todo' }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { text, status } = req.body;
  const newTask = new Task({ text, status: status || 'todo' });
  await newTask.save();
  res.status(201).json(newTask);
});

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


app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});


app.listen(PORT, () => {
  console.log(`TaskCanvas API with MongoDB running at http://localhost:${PORT}`);
});
