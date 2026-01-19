class MessageValidator {
  validate(message) {
    const errors = [];

    if (!message) {
      return { valid: false, errors: ['Message is required'] };
    }

    if (!message.role || !['user', 'assistant', 'system'].includes(message.role)) {
      errors.push('Invalid message role');
    }

    if (message.content === undefined || message.content === null) {
      errors.push('Message content is required');
    }

    if (typeof message.content !== 'string') {
      errors.push('Message content must be a string');
    }

    if (message.content && message.content.trim().length === 0) {
      errors.push('Message content cannot be empty');
    }

    if (message.content && message.content.length > 100000) {
      errors.push('Message content exceeds maximum length of 100000 characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateBatch(messages) {
    if (!Array.isArray(messages)) {
      return { valid: false, errors: ['Messages must be an array'] };
    }

    const errors = [];
    messages.forEach((msg, index) => {
      const result = this.validate(msg);
      if (!result.valid) {
        errors.push(`Message ${index}: ${result.errors.join(', ')}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  sanitizeContent(content) {
    if (typeof content !== 'string') {
      return '';
    }
    return content.trim();
  }
}

module.exports = MessageValidator;
