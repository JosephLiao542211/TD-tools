class MessageTransformer {
  transformToClaudeFormat(messages) {
    return messages.map(msg => ({
      role: msg.role === 'system' ? 'user' : msg.role,
      content: msg.content,
    }));
  }

  transformFromClaudeFormat(response) {
    return {
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      metadata: {
        model: response.model,
        usage: response.usage,
      },
    };
  }

  mergeContinuousMessages(messages) {
    const merged = [];
    let current = null;

    for (const msg of messages) {
      if (current && current.role === msg.role) {
        current.content += '\n' + msg.content;
      } else {
        if (current) merged.push(current);
        current = { ...msg };
      }
    }

    if (current) merged.push(current);
    return merged;
  }

  splitLongMessage(message, maxLength = 50000) {
    if (message.content.length <= maxLength) {
      return [message];
    }

    const chunks = [];
    let remaining = message.content;

    while (remaining.length > 0) {
      const chunk = remaining.substring(0, maxLength);
      chunks.push({
        ...message,
        content: chunk,
      });
      remaining = remaining.substring(maxLength);
    }

    return chunks;
  }
}

module.exports = MessageTransformer;
