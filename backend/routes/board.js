const express = require('express');
const router = express.Router();

// In-memory store: [{ id, name, message, timestamp }]
let messages = [];
let nextId = 1;

// Get all messages
router.get('/', (req, res) => {
  res.json(messages);
});

// Post a message
router.post('/', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'name and message required' });
  const entry = { id: nextId++, name, message, timestamp: new Date().toISOString() };
  messages.push(entry);
  res.status(201).json(entry);
});

// Delete a message by id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  messages = messages.filter(m => m.id !== id);
  res.json({ ok: true });
});

// Clear all messages
router.delete('/', (req, res) => {
  messages = [];
  res.json({ ok: true });
});

module.exports = router;
