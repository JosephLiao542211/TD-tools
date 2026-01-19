/**
 * System Prompt Configuration
 *
 * This file allows customization of system prompt behavior for the Claude API client.
 * You can enable/disable features, set default modes, and add custom context.
 */

const promptConfig = {
  /**
   * Enable or disable intelligent prompt selection
   * When true, the system will auto-detect the appropriate prompt mode based on user messages
   * When false, always use the default coding assistant prompt
   */
  intelligentSelection: true,

  /**
   * Default prompt mode when intelligent selection is disabled
   * Options: 'coding_assistant', 'debugging', 'code_review', 'architecture', 'teaching'
   */
  defaultMode: 'coding_assistant',

  /**
   * Auto-detect programming language and framework from messages
   * Adds context about detected languages/frameworks to the system prompt
   */
  autoDetectContext: true,

  /**
   * Number of previous messages to consider for context detection
   * Higher values provide more context but may slow down processing
   */
  contextHistoryLength: 5,

  /**
   * Enable logging of which prompt mode is selected
   * Useful for debugging and understanding how the system works
   */
  logPromptMode: true,

  /**
   * Custom additions to all system prompts
   * This text will be appended to every system prompt
   * Use this for project-specific guidelines or company standards
   */
  customGlobalContext: '',

  /**
   * Project-specific customizations
   * Add context that applies to your specific project
   */
  projectContext: {
    // Example: projectName: 'My Awesome App',
    // Example: codingStandards: 'Follow Airbnb JavaScript Style Guide',
    // Example: testingFramework: 'Jest with React Testing Library',
  },

  /**
   * Language-specific preferences
   * Override defaults for specific programming languages
   */
  languagePreferences: {
    javascript: {
      // preferredStyle: 'functional',
      // useTypeScript: false,
    },
    python: {
      // preferredVersion: '3.10+',
      // useTypeHints: true,
    },
    // Add more languages as needed
  },

  /**
   * Mode-specific configurations
   * Fine-tune behavior for specific prompt modes
   */
  modeConfig: {
    debugging: {
      // Emphasize step-by-step analysis
      verbose: true,
      // Always suggest tests to prevent regression
      suggestTests: true,
    },
    code_review: {
      // How detailed should reviews be
      detailLevel: 'medium', // 'low', 'medium', 'high'
      // Focus areas for review
      focusAreas: ['security', 'performance', 'maintainability'],
    },
    architecture: {
      // Consider scalability by default
      considerScalability: true,
      // Discuss trade-offs
      explainTradeoffs: true,
    },
    teaching: {
      // Learning level assumption
      defaultLevel: 'intermediate', // 'beginner', 'intermediate', 'advanced'
      // Include practical exercises
      includeExercises: true,
    },
  },

  /**
   * Feature flags for experimental features
   */
  experimental: {
    // Use conversation analysis to improve prompt selection
    advancedContextAnalysis: false,
    // Cache system prompts for performance
    cachePrompts: false,
  },
};

/**
 * Get the current prompt configuration
 */
function getPromptConfig() {
  return { ...promptConfig };
}

/**
 * Update prompt configuration at runtime
 * @param {Object} updates - Configuration updates to apply
 */
function updatePromptConfig(updates) {
  Object.assign(promptConfig, updates);
}

/**
 * Reset configuration to defaults
 */
function resetPromptConfig() {
  Object.assign(promptConfig, {
    intelligentSelection: true,
    defaultMode: 'coding_assistant',
    autoDetectContext: true,
    contextHistoryLength: 5,
    logPromptMode: true,
    customGlobalContext: '',
    projectContext: {},
    languagePreferences: {},
    modeConfig: {
      debugging: { verbose: true, suggestTests: true },
      code_review: { detailLevel: 'medium', focusAreas: ['security', 'performance', 'maintainability'] },
      architecture: { considerScalability: true, explainTradeoffs: true },
      teaching: { defaultLevel: 'intermediate', includeExercises: true },
    },
    experimental: { advancedContextAnalysis: false, cachePrompts: false },
  });
}

/**
 * Validate configuration
 */
function validateConfig() {
  const errors = [];

  if (!['coding_assistant', 'debugging', 'code_review', 'architecture', 'teaching'].includes(promptConfig.defaultMode)) {
    errors.push(`Invalid defaultMode: ${promptConfig.defaultMode}`);
  }

  if (typeof promptConfig.intelligentSelection !== 'boolean') {
    errors.push('intelligentSelection must be a boolean');
  }

  if (typeof promptConfig.contextHistoryLength !== 'number' || promptConfig.contextHistoryLength < 0) {
    errors.push('contextHistoryLength must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  promptConfig,
  getPromptConfig,
  updatePromptConfig,
  resetPromptConfig,
  validateConfig,
};
