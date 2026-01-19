class ClaudeRequestBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.request = {
      messages: [],
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192,
    };
    return this;
  }

  setModel(model) {
    this.request.model = model;
    return this;
  }

  setMaxTokens(maxTokens) {
    this.request.max_tokens = maxTokens;
    return this;
  }

  addMessage(role, content) {
    this.request.messages.push({ role, content });
    return this;
  }

  setMessages(messages) {
    this.request.messages = messages;
    return this;
  }

  setSystemPrompt(system) {
    this.request.system = system;
    return this;
  }

  setTemperature(temperature) {
    this.request.temperature = temperature;
    return this;
  }

  enableStreaming() {
    this.request.stream = true;
    return this;
  }

  build() {
    const request = { ...this.request };
    this.reset();
    return request;
  }
}

module.exports = ClaudeRequestBuilder;
