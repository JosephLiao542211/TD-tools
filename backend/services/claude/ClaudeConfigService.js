class ClaudeConfigService {
  constructor() {
    this.config = {
      defaultModel: 'claude-sonnet-4-5-20250929',
      defaultMaxTokens: 8192,
      defaultTemperature: 1.0,
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 60000,
      streamTimeout: 120000,
    };
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
  }

  getAll() {
    return { ...this.config };
  }

  update(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  reset() {
    this.config = {
      defaultModel: 'claude-sonnet-4-5-20250929',
      defaultMaxTokens: 8192,
      defaultTemperature: 1.0,
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 60000,
      streamTimeout: 120000,
    };
  }
}

module.exports = ClaudeConfigService;
