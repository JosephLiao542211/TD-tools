class ConversationStore {
  constructor() {
    this.conversations = new Map();
  }

  save(sessionId, conversation) {
    this.conversations.set(sessionId, conversation);
  }

  get(sessionId) {
    return this.conversations.get(sessionId);
  }

  exists(sessionId) {
    return this.conversations.has(sessionId);
  }

  delete(sessionId) {
    return this.conversations.delete(sessionId);
  }

  getAll() {
    return Array.from(this.conversations.values());
  }

  clear() {
    this.conversations.clear();
  }

  size() {
    return this.conversations.size;
  }

  keys() {
    return Array.from(this.conversations.keys());
  }
}

module.exports = ConversationStore;
