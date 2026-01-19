class StreamErrorHandler {
  handleError(error, res) {
    console.error('[Stream Error]', error);

    if (res && !res.headersSent) {
      res.status(500).json({
        error: true,
        message: error.message || 'Stream error occurred',
        type: 'stream_error',
      });
    } else if (res && res.writable) {
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: error.message,
      })}\n\n`);
      res.end();
    }
  }

  handleTimeout(sessionId, res) {
    const error = {
      type: 'timeout',
      message: 'Stream timeout exceeded',
      sessionId,
    };

    if (res && res.writable) {
      res.write(`data: ${JSON.stringify(error)}\n\n`);
      res.end();
    }
  }

  handleDisconnect(sessionId) {
    console.log(`[Stream] Client disconnected: ${sessionId}`);
  }

  isRecoverableError(error) {
    const recoverableCodes = ['ECONNRESET', 'EPIPE', 'ETIMEDOUT'];
    return recoverableCodes.includes(error.code);
  }

  logStreamError(error, context = {}) {
    console.error('[Stream Error]', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = StreamErrorHandler;
