const express = require('express');
const router = express.Router();

module.exports = (chatController) => {
  // Send a message and get streaming response
  router.post('/message', (req, res) => chatController.sendMessage(req, res));

  // Get conversation history
  router.get('/conversation/:sessionId', (req, res) =>
    chatController.getConversation(req, res)
  );

  // Clear conversation
  router.delete('/conversation/:sessionId', (req, res) =>
    chatController.clearConversation(req, res)
  );

  return router;
};
