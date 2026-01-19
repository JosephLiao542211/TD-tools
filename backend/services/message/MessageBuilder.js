class MessageBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.message = {
      role: 'user',
      content: '',
      timestamp: new Date(),
    };
    return this;
  }

  setRole(role) {
    this.message.role = role;
    return this;
  }

  setContent(content) {
    this.message.content = content;
    return this;
  }

  appendContent(content) {
    this.message.content += content;
    return this;
  }

  setTimestamp(timestamp) {
    this.message.timestamp = timestamp;
    return this;
  }

  addMetadata(key, value) {
    if (!this.message.metadata) {
      this.message.metadata = {};
    }
    this.message.metadata[key] = value;
    return this;
  }

  build() {
    const message = { ...this.message };
    this.reset();
    return message;
  }
}

module.exports = MessageBuilder;
