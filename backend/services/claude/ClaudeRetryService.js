class ClaudeRetryService {
  constructor(errorHandler) {
    this.errorHandler = errorHandler;
    this.maxRetries = 3;
  }

  async executeWithRetry(operation, context = {}) {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        this.errorHandler.logError(error, { ...context, attempt });

        if (!this.errorHandler.isRetryableError(error) || attempt === this.maxRetries) {
          throw error;
        }

        const delay = this.errorHandler.getRetryDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setMaxRetries(max) {
    this.maxRetries = max;
  }
}

module.exports = ClaudeRetryService;
