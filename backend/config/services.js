// Claude Services
const ClaudeAPIClient = require('../services/claude/ClaudeAPIClient');
const ClaudeRequestBuilder = require('../services/claude/ClaudeRequestBuilder');
const ClaudeResponseParser = require('../services/claude/ClaudeResponseParser');
const ClaudeStreamHandler = require('../services/claude/ClaudeStreamHandler');
const ClaudeTokenManager = require('../services/claude/ClaudeTokenManager');
const ClaudeModelSelector = require('../services/claude/ClaudeModelSelector');
const ClaudeConfigService = require('../services/claude/ClaudeConfigService');
const ClaudeErrorHandler = require('../services/claude/ClaudeErrorHandler');
const ClaudeRetryService = require('../services/claude/ClaudeRetryService');
const ClaudeRateLimiter = require('../services/claude/ClaudeRateLimiter');

// Conversation Services
const ConversationManager = require('../services/conversation/ConversationManager');
const ConversationStore = require('../services/conversation/ConversationStore');
const ConversationValidator = require('../services/conversation/ConversationValidator');
const ConversationFormatter = require('../services/conversation/ConversationFormatter');
const ConversationHistory = require('../services/conversation/ConversationHistory');
const ConversationPruner = require('../services/conversation/ConversationPruner');
const ConversationSerializer = require('../services/conversation/ConversationSerializer');

// Message Services
const MessageBuilder = require('../services/message/MessageBuilder');
const MessageValidator = require('../services/message/MessageValidator');
const MessageFormatter = require('../services/message/MessageFormatter');
const MessageTransformer = require('../services/message/MessageTransformer');
const MessageSanitizer = require('../services/message/MessageSanitizer');
const MessageCompressor = require('../services/message/MessageCompressor');
const MessageMetadata = require('../services/message/MessageMetadata');

// Stream Services
const StreamManager = require('../services/stream/StreamManager');
const StreamBuffer = require('../services/stream/StreamBuffer');
const StreamEventEmitter = require('../services/stream/StreamEventEmitter');
const StreamErrorHandler = require('../services/stream/StreamErrorHandler');

// Utility Services
const Logger = require('../services/utils/Logger');
const CacheManager = require('../services/utils/CacheManager');
const HealthChecker = require('../services/utils/HealthChecker');

// Controllers
const ChatController = require('../controllers/ChatController');

function initializeServices() {
  // Initialize utility services
  const logger = new Logger();
  const cacheManager = new CacheManager();
  const healthChecker = new HealthChecker();

  // Initialize Claude services
  const claudeClient = new ClaudeAPIClient();
  const claudeRequestBuilder = new ClaudeRequestBuilder();
  const claudeResponseParser = new ClaudeResponseParser();
  const claudeTokenManager = new ClaudeTokenManager();
  const claudeModelSelector = new ClaudeModelSelector();
  const claudeConfigService = new ClaudeConfigService();
  const claudeErrorHandler = new ClaudeErrorHandler();
  const claudeRetryService = new ClaudeRetryService(claudeErrorHandler);
  const claudeRateLimiter = new ClaudeRateLimiter();

  // Initialize stream services
  const streamManager = new StreamManager();
  const streamBuffer = new StreamBuffer();
  const streamEventEmitter = new StreamEventEmitter();
  const streamErrorHandler = new StreamErrorHandler();
  const claudeStreamHandler = new ClaudeStreamHandler(streamManager);

  // Initialize conversation services
  const conversationStore = new ConversationStore();
  const conversationValidator = new ConversationValidator();
  const conversationFormatter = new ConversationFormatter();
  const conversationHistory = new ConversationHistory(claudeTokenManager);
  const conversationPruner = new ConversationPruner(claudeTokenManager);
  const conversationSerializer = new ConversationSerializer();
  const conversationManager = new ConversationManager(conversationStore, conversationValidator);

  // Initialize message services
  const messageBuilder = new MessageBuilder();
  const messageValidator = new MessageValidator();
  const messageFormatter = new MessageFormatter();
  const messageTransformer = new MessageTransformer();
  const messageSanitizer = new MessageSanitizer();
  const messageCompressor = new MessageCompressor();
  const messageMetadata = new MessageMetadata();

  // Register health checks
  healthChecker.registerCheck('api', async () => {
    return { status: 'healthy', message: 'API is running' };
  });

  healthChecker.registerCheck('conversations', async () => {
    const count = conversationStore.size();
    return { status: 'healthy', activeConversations: count };
  });

  // Initialize controllers
  const chatController = new ChatController({
    claudeClient,
    conversationManager,
    streamHandler: claudeStreamHandler,
    streamManager,
    messageValidator,
    conversationFormatter,
    logger,
  });

  return {
    // Utility services
    logger,
    cacheManager,
    healthChecker,

    // Claude services
    claudeClient,
    claudeRequestBuilder,
    claudeResponseParser,
    claudeTokenManager,
    claudeModelSelector,
    claudeConfigService,
    claudeErrorHandler,
    claudeRetryService,
    claudeRateLimiter,

    // Stream services
    streamManager,
    streamBuffer,
    streamEventEmitter,
    streamErrorHandler,
    claudeStreamHandler,

    // Conversation services
    conversationStore,
    conversationValidator,
    conversationFormatter,
    conversationHistory,
    conversationPruner,
    conversationSerializer,
    conversationManager,

    // Message services
    messageBuilder,
    messageValidator,
    messageFormatter,
    messageTransformer,
    messageSanitizer,
    messageCompressor,
    messageMetadata,

    // Controllers
    chatController,
  };
}

module.exports = initializeServices;
