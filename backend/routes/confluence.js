const express = require('express');
const router = express.Router();

module.exports = (confluenceController) => {
  // Fill/complete a checklist using Claude
  router.post('/fill', (req, res) => confluenceController.fill(req, res));

  // Preview parsed page content (no Claude call)
  router.get('/preview', (req, res) => confluenceController.preview(req, res));

  return router;
};
