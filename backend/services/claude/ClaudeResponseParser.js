class ClaudeResponseParser {
  parseResponse(response) {
    if (!response || !response.content) {
      throw new Error('Invalid response format');
    }

    return {
      id: response.id,
      type: response.type,
      role: response.role,
      content: this.extractTextContent(response.content),
      model: response.model,
      stopReason: response.stop_reason,
      usage: response.usage,
    };
  }

  extractTextContent(content) {
    if (Array.isArray(content)) {
      return content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('');
    }
    return content;
  }

  parseStreamChunk(chunk) {
    return {
      type: chunk.type,
      index: chunk.index,
      delta: chunk.delta,
    };
  }

  extractError(error) {
    return {
      type: error.type || 'unknown_error',
      message: error.message || 'An unknown error occurred',
      status: error.status,
    };
  }
}

module.exports = ClaudeResponseParser;
