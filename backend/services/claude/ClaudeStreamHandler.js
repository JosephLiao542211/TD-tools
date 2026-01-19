class ClaudeStreamHandler {
  constructor(streamManager) {
    this.streamManager = streamManager;
  }

  async handleStream(claudeStream, sessionId, res) {
    try {
      for await (const chunk of claudeStream) {
        await this.processChunk(chunk, sessionId, res);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      this.handleStreamError(error, res);
    }
  }

  async processChunk(chunk, sessionId, res) {
    if (chunk.type === 'content_block_delta') {
      const text = chunk.delta?.text;
      if (text) {
        this.streamManager.appendToBuffer(sessionId, text);
        res.write(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
      }
    } else if (chunk.type === 'message_start') {
      res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);
    } else if (chunk.type === 'message_stop') {
      res.write(`data: ${JSON.stringify({ type: 'stop' })}\n\n`);
    }
  }

  handleStreamError(error, res) {
    const errorData = {
      type: 'error',
      message: error.message,
    };
    res.write(`data: ${JSON.stringify(errorData)}\n\n`);
    res.end();
  }
}

module.exports = ClaudeStreamHandler;
