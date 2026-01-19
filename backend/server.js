require('dotenv').config();
const express = require('express');
const path = require('path');
const initializeServices = require('./config/services');
const chatRoutes = require('./routes/chat');
const healthRoutes = require('./routes/health');
const corsHandler = require('./middleware/corsHandler');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize all services
const services = initializeServices();

// Middleware
app.use(corsHandler());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger(services.logger));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/chat', chatRoutes(services.chatController));
app.use('/api/health', healthRoutes(services.healthChecker));

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Claude Chat API',
    version: '1.0.0',
    endpoints: {
      chat: '/api/chat',
      health: '/api/health',
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler(services.logger));

// Start server
app.listen(PORT, () => {
  services.logger.info(`Server running on port ${PORT}`);
  console.log(`
🚀 Server is running!

   Frontend: http://localhost:${PORT}
   API:      http://localhost:${PORT}/api
   Health:   http://localhost:${PORT}/api/health

   Make sure to set ANTHROPIC_API_KEY in your .env file
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  services.logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  services.logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});
