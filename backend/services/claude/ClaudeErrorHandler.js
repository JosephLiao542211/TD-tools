class ClaudeErrorHandler {
  handleError(error) {
    const errorResponse = {
      error: true,
      message: 'An error occurred',
      type: 'unknown_error',
    };

    if (error.status === 401) {
      errorResponse.type = 'authentication_error';
      errorResponse.message = 'Invalid API key';
    } else if (error.status === 429) {
      errorResponse.type = 'rate_limit_error';
      errorResponse.message = 'Rate limit exceeded. Please try again later.';
    } else if (error.status === 500) {
      errorResponse.type = 'api_error';
      errorResponse.message = 'Claude API error. Please try again.';
    } else if (error.message) {
      errorResponse.message = error.message;
    }

    return errorResponse;
  }

  isRetryableError(error) {
    return error.status === 429 || error.status === 500 || error.status === 503;
  }

  getRetryDelay(attemptNumber) {
    return Math.min(1000 * Math.pow(2, attemptNumber), 10000);
  }

  logError(error, context = {}) {
    console.error('[Claude Error]', {
      message: error.message,
      status: error.status,
      type: error.type,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = ClaudeErrorHandler;
