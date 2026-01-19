class ClaudeTokenManager {
  constructor() {
    this.approximateTokenRatio = 4; // roughly 4 chars per token
  }

  estimateTokens(text) {
    return Math.ceil(text.length / this.approximateTokenRatio);
  }

  estimateMessagesTokens(messages) {
    let total = 0;
    for (const message of messages) {
      total += this.estimateTokens(
        typeof message.content === 'string'
          ? message.content
          : JSON.stringify(message.content)
      );
    }
    return total;
  }

  canFitInContext(messages, maxTokens = 200000) {
    const estimated = this.estimateMessagesTokens(messages);
    return estimated < maxTokens * 0.8; // leave 20% buffer
  }

  getRecommendedMaxTokens(inputTokens) {
    const maxContext = 200000;
    const available = maxContext - inputTokens;
    return Math.min(8192, Math.floor(available * 0.9));
  }
}

module.exports = ClaudeTokenManager;
