const express = require('express');
const router = express.Router();

module.exports = (confluenceController) => {
  // Fill/complete a checklist using Claude — server fetches Confluence directly
  router.post('/fill', (req, res) => confluenceController.fill(req, res));

  // Preview parsed page structure (no Claude) — server fetches Confluence directly
  router.post('/preview', (req, res) => confluenceController.preview(req, res));
  router.get('/preview', (req, res) => confluenceController.preview(req, res));

  return router;
};
