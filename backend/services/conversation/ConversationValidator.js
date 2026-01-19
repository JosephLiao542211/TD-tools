class ConversationValidator {
  validateMessage(message) {
    const errors = [];

    if (!message.role) {
      errors.push('Message role is required');
    }

    if (!['user', 'assistant'].includes(message.role)) {
      errors.push('Message role must be "user" or "assistant"');
    }

    if (!message.content || typeof message.content !== 'string') {
      errors.push('Message content must be a non-empty string');
    }

    if (message.content && message.content.length > 100000) {
      errors.push('Message content exceeds maximum length');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateConversation(conversation) {
    if (!conversation.messages || !Array.isArray(conversation.messages)) {
      return { valid: false, errors: ['Conversation must have messages array'] };
    }

    const errors = [];
    conversation.messages.forEach((msg, index) => {
      const validation = this.validateMessage(msg);
      if (!validation.valid) {
        errors.push(`Message ${index}: ${validation.errors.join(', ')}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateSessionId(sessionId) {
    if (!sessionId || typeof sessionId !== 'string') {
      return { valid: false, error: 'Invalid session ID' };
    }
    return { valid: true };
  }
}

module.exports = ConversationValidator;
