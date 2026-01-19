class ConversationManager {
  constructor(store, validator) {
    this.store = store;
    this.validator = validator;
  }

  createConversation(sessionId) {
    if (this.store.exists(sessionId)) {
      return this.store.get(sessionId);
    }

    const conversation = {
      sessionId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.store.save(sessionId, conversation);
    return conversation;
  }

  addMessage(sessionId, role, content) {
    const conversation = this.store.get(sessionId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const message = {
      role,
      content,
      timestamp: new Date(),
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    this.store.save(sessionId, conversation);

    return message;
  }

  getConversation(sessionId) {
    return this.store.get(sessionId);
  }

  getMessages(sessionId) {
    const conversation = this.store.get(sessionId);
    return conversation ? conversation.messages : [];
  }

  clearConversation(sessionId) {
    this.store.delete(sessionId);
  }

  getAllConversations() {
    return this.store.getAll();
  }
}

module.exports = ConversationManager;
