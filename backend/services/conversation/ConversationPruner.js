class ConversationPruner {
  constructor(tokenManager) {
    this.tokenManager = tokenManager;
    this.maxMessages = 100;
    this.maxTokens = 150000;
  }

  shouldPrune(messages) {
    if (messages.length > this.maxMessages) {
      return { shouldPrune: true, reason: 'message_limit' };
    }

    const tokens = this.tokenManager.estimateMessagesTokens(messages);
    if (tokens > this.maxTokens) {
      return { shouldPrune: true, reason: 'token_limit' };
    }

    return { shouldPrune: false };
  }

  prune(messages) {
    const check = this.shouldPrune(messages);
    if (!check.shouldPrune) {
      return messages;
    }

    if (check.reason === 'message_limit') {
      return this.pruneByMessageCount(messages);
    }

    return this.pruneByTokenCount(messages);
  }

  pruneByMessageCount(messages) {
    const keepCount = Math.floor(this.maxMessages * 0.7);
    return messages.slice(-keepCount);
  }

  pruneByTokenCount(messages) {
    const targetTokens = Math.floor(this.maxTokens * 0.7);
    let tokenCount = 0;
    const result = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const msgTokens = this.tokenManager.estimateTokens(msg.content);

      if (tokenCount + msgTokens > targetTokens) {
        break;
      }

      result.unshift(msg);
      tokenCount += msgTokens;
    }

    return result;
  }
}

module.exports = ConversationPruner;
