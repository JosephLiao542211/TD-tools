const Anthropic = require('@anthropic-ai/sdk');

class ClaudeAPIClient {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async createMessage(messages, options = {}) {
    return await this.client.messages.create({
      model: options.model || 'claude-sonnet-4-5-20250929',
      max_tokens: options.maxTokens || 8192,
      messages,
      stream: options.stream || false,
      ...options
    });
  }

  async streamMessage(messages, options = {}) {
    return this.client.messages.stream({
      model: options.model || 'claude-sonnet-4-5-20250929',
      max_tokens: options.maxTokens || 8192,
      messages,
      ...options
    });
  }

  getClient() {
    return this.client;
  }
}

module.exports = ClaudeAPIClient;
