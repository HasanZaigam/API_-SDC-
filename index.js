const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb://localhost/todoapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a ToDo schema and model
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

app.use(bodyParser.json());

// CRUD Operations

// Create a new ToDo
app.post('/todos', (req, res) => {
  const { title, description, completed } = req.body;
  const todo = new Todo({ title, description, completed });
  
  todo.save((err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json(result);
    }
  });
});

// Read all ToDos
app.get('/todos', (req, res) => {
  Todo.find({}, (err, todos) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(todos);
    }
  });
});

// Read a single ToDo by ID
app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!todo) {
      res.status(404).json({ error: 'ToDo not found' });
    } else {
      res.status(200).json(todo);
    }
  });
});

// Update a ToDo by ID
app.put('/todos/:id', (req, res) => {
  const { title, description, completed } = req.body;
  const updateData = { title, description, completed };
  
  Todo.findByIdAndUpdate(req.params.id, updateData, { new: true }, (err, todo) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!todo) {
      res.status(404).json({ error: 'ToDo not found' });
    } else {
      res.status(200).json(todo);
    }
  });
});

// Delete a ToDo by ID
app.delete('/todos/:id', (req, res) => {
  Todo.findByIdAndRemove(req.params.id, (err, todo) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!todo) {
      res.status(404).json({ error: 'ToDo not found' });
    } else {
      res.status(204).send();
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
