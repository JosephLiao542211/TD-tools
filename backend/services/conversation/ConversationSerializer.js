class ConversationSerializer {
  serialize(conversation) {
    return JSON.stringify({
      sessionId: conversation.sessionId,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  }

  deserialize(data) {
    try {
      const parsed = JSON.parse(data);
      return {
        sessionId: parsed.sessionId,
        messages: parsed.messages || [],
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    } catch (error) {
      throw new Error('Failed to deserialize conversation: ' + error.message);
    }
  }

  exportToJSON(conversation) {
    return JSON.stringify(conversation, null, 2);
  }

  importFromJSON(jsonString) {
    return this.deserialize(jsonString);
  }

  toArray(conversation) {
    return conversation.messages.map(msg => [msg.role, msg.content, msg.timestamp]);
  }

  fromArray(sessionId, messagesArray) {
    return {
      sessionId,
      messages: messagesArray.map(([role, content, timestamp]) => ({
        role,
        content,
        timestamp: new Date(timestamp),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

module.exports = ConversationSerializer;
