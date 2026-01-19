class ConversationHistory {
  constructor(tokenManager) {
    this.tokenManager = tokenManager;
  }

  getRecentMessages(messages, maxMessages = 50) {
    return messages.slice(-maxMessages);
  }

  getMessagesWithinTokenLimit(messages, maxTokens = 150000) {
    const result = [];
    let tokenCount = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const msgTokens = this.tokenManager.estimateTokens(msg.content);

      if (tokenCount + msgTokens > maxTokens) {
        break;
      }

      result.unshift(msg);
      tokenCount += msgTokens;
    }

    return result;
  }

  summarizeOldMessages(messages, keepRecent = 10) {
    if (messages.length <= keepRecent) {
      return messages;
    }

    const recentMessages = messages.slice(-keepRecent);
    const oldCount = messages.length - keepRecent;

    return [
      {
        role: 'assistant',
        content: `[Previous conversation with ${oldCount} messages summarized]`,
        timestamp: messages[0].timestamp,
      },
      ...recentMessages,
    ];
  }

  getMessageStats(messages) {
    return {
      total: messages.length,
      userMessages: messages.filter(m => m.role === 'user').length,
      assistantMessages: messages.filter(m => m.role === 'assistant').length,
      estimatedTokens: this.tokenManager.estimateMessagesTokens(messages),
    };
  }
}

module.exports = ConversationHistory;
