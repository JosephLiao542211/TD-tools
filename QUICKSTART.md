# Quick Start Guide

## Setup in 3 Steps

### 1. Add Your API Key

Edit `backend/.env` and replace `your_api_key_here` with your actual Anthropic API key:

```bash
cd backend
nano .env  # or use your preferred editor
```

Get your API key from: https://console.anthropic.com/

### 2. Start the Server

```bash
cd backend
npm start
```

You should see:
```
🚀 Server is running!

   Frontend: http://localhost:3000
   API:      http://localhost:3000/api
   Health:   http://localhost:3000/api/health
```

### 3. Open the Chat

Open your browser and go to:
```
http://localhost:3000
```

## What You Built

✅ **31 Service Classes** organized in proper architecture:
- 10 Claude API services
- 7 Conversation management services
- 7 Message handling services
- 4 Streaming services
- 3 Utility services

✅ **Streaming Chat Interface** with real-time responses

✅ **In-Memory Conversations** - no database needed

✅ **Proper Backend Structure**:
- Services (business logic)
- Controllers (request handling)
- Routes (API endpoints)
- Middleware (CORS, logging, error handling)

## Architecture Overview

```
Request Flow:
1. Frontend (index.html) → sends message
2. Route (/api/chat/message) → receives request
3. Controller (ChatController) → processes request
4. Services (31 classes) → handle business logic
5. Claude API → streams response
6. Frontend → displays response in real-time
```

## Key Features

- **Continuous Streaming**: Messages stream character-by-character
- **Conversation History**: All messages stored in memory per session
- **Error Handling**: Graceful error recovery with user-friendly messages
- **Multiple Sessions**: Each browser tab gets its own session
- **Clear Chat**: Button to clear conversation and start fresh

## Testing

### Check Health
```bash
curl http://localhost:3000/api/health
```

### Test API Directly
```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "sessionId": "test123"}'
```

## Troubleshooting

### Port Already in Use
If port 3000 is taken, change it in `backend/.env`:
```
PORT=3001
```

### Missing API Key Error
Make sure you set `ANTHROPIC_API_KEY` in `backend/.env`

### Dependencies Not Found
Run `npm install` in the backend directory:
```bash
cd backend
npm install
```

## Development Mode

For auto-reload during development:
```bash
cd backend
npm run dev
```

## Next Steps

- Explore the 31 service classes in `backend/services/`
- Customize the frontend UI in `frontend/index.html`
- Add new routes in `backend/routes/`
- Extend functionality by creating new services
- Add authentication for production use
- Deploy to a cloud platform

Enjoy your Claude chatbot! 🚀
