class ChatController {
  constructor(services) {
    this.claudeClient = services.claudeClient;
    this.conversationManager = services.conversationManager;
    this.streamHandler = services.streamHandler;
    this.streamManager = services.streamManager;
    this.messageValidator = services.messageValidator;
    this.conversationFormatter = services.conversationFormatter;
    this.logger = services.logger;
  }

  async sendMessage(req, res) {
    try {
      const { message, sessionId } = req.body;

      // Validate message
      const validation = this.messageValidator.validate({
        role: 'user',
        content: message,
      });

      if (!validation.valid) {
        return res.status(400).json({
          error: true,
          message: validation.errors.join(', '),
        });
      }

      // Get or create conversation
      let conversation = this.conversationManager.getConversation(sessionId);
      if (!conversation) {
        conversation = this.conversationManager.createConversation(sessionId);
      }

      // Add user message
      this.conversationManager.addMessage(sessionId, 'user', message);

      // Set up streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      this.streamManager.createStream(sessionId);

      // Get messages for Claude
      const messages = this.conversationFormatter.formatForClaude(
        this.conversationManager.getMessages(sessionId)
      );

      // Stream response from Claude
      const stream = await this.claudeClient.streamMessage(messages);

      await this.streamHandler.handleStream(stream, sessionId, res);

      // Save assistant response
      const assistantMessage = this.streamManager.getBuffer(sessionId);
      this.conversationManager.addMessage(sessionId, 'assistant', assistantMessage);

      this.streamManager.cleanup(sessionId);
    } catch (error) {
      this.logger.error('Error in sendMessage', { error: error.message });
      if (!res.headersSent) {
        res.status(500).json({
          error: true,
          message: error.message,
        });
      }
    }
  }

  async getConversation(req, res) {
    try {
      const { sessionId } = req.params;

      const conversation = this.conversationManager.getConversation(sessionId);

      if (!conversation) {
        return res.status(404).json({
          error: true,
          message: 'Conversation not found',
        });
      }

      res.json(this.conversationFormatter.formatForClient(conversation));
    } catch (error) {
      this.logger.error('Error in getConversation', { error: error.message });
      res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }

  async clearConversation(req, res) {
    try {
      const { sessionId } = req.params;

      this.conversationManager.clearConversation(sessionId);

      res.json({
        success: true,
        message: 'Conversation cleared',
      });
    } catch (error) {
      this.logger.error('Error in clearConversation', { error: error.message });
      res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }
}

module.exports = ChatController;
