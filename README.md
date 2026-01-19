# Claude Chat Application

A full-stack chatbot application powered by Claude AI with 31 service classes for scalable architecture.

## Features

- **31 Service Classes** organized into:
  - 10 Claude API services
  - 7 Conversation management services
  - 7 Message handling services
  - 4 Streaming services
  - 3 Utility services

- **Real-time Streaming**: Continuous streaming responses from Claude
- **In-Memory Conversations**: No database required, conversations stored in memory
- **Beautiful UI**: Modern, responsive chat interface
- **Proper Architecture**: Services, routes, controllers, and middleware

## Project Structure

```
.
├── backend/
│   ├── server.js                 # Main server file
│   ├── package.json              # Dependencies
│   ├── .env.example              # Environment variables template
│   ├── config/
│   │   └── services.js           # Service initialization
│   ├── controllers/
│   │   └── ChatController.js     # Chat logic controller
│   ├── routes/
│   │   ├── chat.js               # Chat routes
│   │   └── health.js             # Health check routes
│   ├── middleware/
│   │   ├── corsHandler.js        # CORS configuration
│   │   ├── errorHandler.js       # Error handling
│   │   └── requestLogger.js      # Request logging
│   └── services/
│       ├── claude/               # Claude API services (10 classes)
│       ├── conversation/         # Conversation services (7 classes)
│       ├── message/              # Message services (7 classes)
│       ├── stream/               # Streaming services (4 classes)
│       └── utils/                # Utility services (3 classes)
└── frontend/
    └── index.html                # Chat UI

```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 4. Open the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## API Endpoints

### Chat Endpoints

- `POST /api/chat/message` - Send a message and get streaming response
  - Body: `{ message: string, sessionId: string }`

- `GET /api/chat/conversation/:sessionId` - Get conversation history

- `DELETE /api/chat/conversation/:sessionId` - Clear conversation

### Health Check

- `GET /api/health` - Server health status

## Service Classes Overview

### Claude Services (10)
1. **ClaudeAPIClient** - Main API client
2. **ClaudeRequestBuilder** - Build API requests
3. **ClaudeResponseParser** - Parse API responses
4. **ClaudeStreamHandler** - Handle streaming responses
5. **ClaudeTokenManager** - Manage token limits
6. **ClaudeModelSelector** - Select Claude models
7. **ClaudeConfigService** - Configuration management
8. **ClaudeErrorHandler** - Error handling
9. **ClaudeRetryService** - Retry logic
10. **ClaudeRateLimiter** - Rate limiting

### Conversation Services (7)
11. **ConversationManager** - Manage conversations
12. **ConversationStore** - Store conversations in memory
13. **ConversationValidator** - Validate conversation data
14. **ConversationFormatter** - Format conversations
15. **ConversationHistory** - Manage conversation history
16. **ConversationPruner** - Prune old messages
17. **ConversationSerializer** - Serialize/deserialize

### Message Services (7)
18. **MessageBuilder** - Build messages
19. **MessageValidator** - Validate messages
20. **MessageFormatter** - Format messages
21. **MessageTransformer** - Transform message formats
22. **MessageSanitizer** - Sanitize message content
23. **MessageCompressor** - Compress messages
24. **MessageMetadata** - Manage message metadata

### Stream Services (4)
25. **StreamManager** - Manage active streams
26. **StreamBuffer** - Buffer streaming data
27. **StreamEventEmitter** - Emit stream events
28. **StreamErrorHandler** - Handle stream errors

### Utility Services (3)
29. **Logger** - Logging service
30. **CacheManager** - Cache management
31. **HealthChecker** - Health checks

## Features

### Continuous Streaming
- Real-time responses from Claude
- Character-by-character streaming
- Typing indicators
- Error handling

### Conversation Management
- In-memory storage (no database needed)
- Multiple concurrent conversations
- Message history maintained
- Automatic cleanup

### Error Handling
- Graceful error recovery
- Retry logic for failed requests
- User-friendly error messages
- Comprehensive logging

## Development

### Adding New Services

1. Create a new service class in the appropriate directory
2. Add it to `config/services.js`
3. Inject it where needed

### Extending the API

1. Add new routes in `routes/`
2. Create controller methods in `controllers/`
3. Use existing services or create new ones

## Environment Variables

- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (error/warn/info/debug)
- `CORS_ORIGIN` - CORS origin (default: *)

## License

MIT
