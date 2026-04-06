const express = require('express');
const router = express.Router();

module.exports = (confluenceController) => {
  // Expose PAT to browser so it can call Confluence directly (localhost personal tool only)
  router.get('/client-config', (req, res) => confluenceController.clientConfig(req, res));

  // Fill/complete a checklist using Claude (accepts rawHtml from browser-side fetch)
  router.post('/fill', (req, res) => confluenceController.fill(req, res));

  // Preview parsed page content (no Claude call) — POST accepts rawHtml body
  router.post('/preview', (req, res) => confluenceController.preview(req, res));
  router.get('/preview', (req, res) => confluenceController.preview(req, res));

  return router;
};
