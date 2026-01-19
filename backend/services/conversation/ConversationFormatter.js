class ConversationFormatter {
  formatForClaude(messages) {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  formatForClient(conversation) {
    return {
      sessionId: conversation.sessionId,
      messages: conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  formatMessage(role, content, metadata = {}) {
    return {
      role,
      content,
      timestamp: new Date(),
      ...metadata,
    };
  }

  formatError(error) {
    return {
      error: true,
      message: error.message || 'An error occurred',
      timestamp: new Date(),
    };
  }
}

module.exports = ConversationFormatter;
