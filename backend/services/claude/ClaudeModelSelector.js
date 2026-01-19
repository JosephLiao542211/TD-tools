class ClaudeModelSelector {
  constructor() {
    this.models = {
      sonnet: 'claude-sonnet-4-5-20250929',
      opus: 'claude-opus-4-5-20251101',
      haiku: 'claude-3-5-haiku-20241022',
    };
    this.defaultModel = this.models.sonnet;
  }

  selectModel(preference) {
    if (preference && this.models[preference.toLowerCase()]) {
      return this.models[preference.toLowerCase()];
    }
    return this.defaultModel;
  }

  getModelByComplexity(complexity) {
    switch (complexity) {
      case 'simple':
        return this.models.haiku;
      case 'complex':
        return this.models.opus;
      default:
        return this.models.sonnet;
    }
  }

  getAvailableModels() {
    return Object.keys(this.models);
  }

  getModelInfo(modelKey) {
    return {
      key: modelKey,
      id: this.models[modelKey],
      contextWindow: 200000,
    };
  }
}

module.exports = ClaudeModelSelector;
