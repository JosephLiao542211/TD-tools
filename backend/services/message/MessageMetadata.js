class MessageMetadata {
  addMetadata(message, metadata) {
    return {
      ...message,
      metadata: {
        ...message.metadata,
        ...metadata,
      },
    };
  }

  getMetadata(message, key) {
    return message.metadata?.[key];
  }

  removeMetadata(message, key) {
    if (!message.metadata) return message;

    const { [key]: removed, ...rest } = message.metadata;
    return {
      ...message,
      metadata: rest,
    };
  }

  enrichWithTimestamp(message) {
    return this.addMetadata(message, {
      timestamp: new Date().toISOString(),
    });
  }

  enrichWithSource(message, source) {
    return this.addMetadata(message, { source });
  }

  enrichWithModel(message, model) {
    return this.addMetadata(message, { model });
  }

  enrichWithTokenCount(message, tokens) {
    return this.addMetadata(message, { tokens });
  }

  extractAllMetadata(message) {
    return message.metadata || {};
  }

  clearMetadata(message) {
    const { metadata, ...rest } = message;
    return rest;
  }
}

module.exports = MessageMetadata;
