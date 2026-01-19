const express = require('express');
const router = express.Router();

module.exports = (healthChecker) => {
  router.get('/', async (req, res) => {
    const health = await healthChecker.getHealth();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  });

  return router;
};
