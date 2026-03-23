const express = require('express');
const multer = require('multer');
const router = express.Router();

// In-memory store: code -> { buffer, filename, mimetype, expiresAt }
const store = new Map();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

function generateCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Clean up expired files every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [code, entry] of store.entries()) {
    if (entry.expiresAt < now) store.delete(code);
  }
}, 10 * 60 * 1000);

// POST /api/storage/upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });

  let code;
  do { code = generateCode(); } while (store.has(code));

  const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
  store.set(code, {
    buffer: req.file.buffer,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    expiresAt: Date.now() + TTL_MS,
  });

  res.json({ code, filename: req.file.originalname, expiresIn: '24 hours' });
});

// GET /api/storage/download/:code
router.get('/download/:code', (req, res) => {
  const entry = store.get(req.params.code.toUpperCase());
  if (!entry) return res.status(404).json({ error: 'File not found or expired' });
  if (entry.expiresAt < Date.now()) {
    store.delete(req.params.code.toUpperCase());
    return res.status(404).json({ error: 'File expired' });
  }

  res.set('Content-Disposition', `attachment; filename="${entry.filename}"`);
  res.set('Content-Type', entry.mimetype || 'application/octet-stream');
  res.send(entry.buffer);
});

module.exports = router;
