/**
 * Examples of using the System Prompts API
 *
 * This file demonstrates various ways to use the system prompts module
 * in your application.
 */

const {
  getSystemPrompt,
  detectPromptMode,
  detectLanguage,
  detectFramework,
  getIntelligentSystemPrompt,
  PROMPT_MODES,
  CODING_ASSISTANT_PROMPT,
  DEBUGGING_SPECIALIST_PROMPT
} = require('./systemPrompts');

// ============================================================================
// Example 1: Get a specific prompt mode
// ============================================================================

function example1_specificMode() {
  console.log('\n=== Example 1: Get Specific Prompt Mode ===\n');

  // Get the debugging specialist prompt
  const debugPrompt = getSystemPrompt(PROMPT_MODES.DEBUGGING);
  console.log('Debugging prompt length:', debugPrompt.length);

  // Get the code review prompt
  const reviewPrompt = getSystemPrompt('code_review');
  console.log('Code review prompt length:', reviewPrompt.length);

  // Get the teaching prompt
  const teachPrompt = getSystemPrompt(PROMPT_MODES.TEACHING);
  console.log('Teaching prompt length:', teachPrompt.length);
}

// ============================================================================
// Example 2: Detect prompt mode from user message
// ============================================================================

function example2_detectMode() {
  console.log('\n=== Example 2: Detect Mode from Message ===\n');

  const testMessages = [
    "I'm getting a TypeError in my code",
    "Can you review this function for me?",
    "How does async/await work in JavaScript?",
    "Should I use microservices or a monolith?",
    "Write a function to sort an array"
  ];

  testMessages.forEach(message => {
    const mode = detectPromptMode(message);
    console.log(`Message: "${message}"`);
    console.log(`Detected mode: ${mode}\n`);
  });
}

// ============================================================================
// Example 3: Detect language and framework
// ============================================================================

function example3_detectContext() {
  console.log('\n=== Example 3: Detect Language & Framework ===\n');

  const messages = [
    "Help me with my React component",
    "I'm working on a Django REST API",
    "How do I use async/await in Node.js?",
    "Python FastAPI error handling"
  ];

  messages.forEach(message => {
    const language = detectLanguage(message);
    const framework = detectFramework(message);
    console.log(`Message: "${message}"`);
    console.log(`Language: ${language || 'none detected'}`);
    console.log(`Framework: ${framework || 'none detected'}\n`);
  });
}

// ============================================================================
// Example 4: Get prompt with customizations
// ============================================================================

function example4_customizations() {
  console.log('\n=== Example 4: Custom Prompt ===\n');

  // Create a customized debugging prompt for Python/Django
  const customPrompt = getSystemPrompt(PROMPT_MODES.DEBUGGING, {
    language: 'python',
    framework: 'Django',
    projectType: 'REST API',
    additionalContext: 'Focus on database query optimization and N+1 problems'
  });

  console.log('Customized prompt (first 500 chars):');
  console.log(customPrompt.substring(0, 500) + '...\n');
}

// ============================================================================
// Example 5: Intelligent prompt selection with conversation history
// ============================================================================

function example5_intelligentSelection() {
  console.log('\n=== Example 5: Intelligent Selection with History ===\n');

  // Simulate a conversation history
  const conversationHistory = [
    { role: 'user', content: 'I want to build a React application' },
    { role: 'assistant', content: 'Great! I can help you with that.' },
    { role: 'user', content: 'I need to fetch data from an API' },
    { role: 'assistant', content: 'You can use fetch or axios...' }
  ];

  // New message from user
  const currentMessage = "I'm getting a CORS error when calling the API";

  // Get intelligent prompt
  const prompt = getIntelligentSystemPrompt(currentMessage, conversationHistory);

  console.log('Current message:', currentMessage);
  console.log('Detected context: React, JavaScript');
  console.log('Selected mode: debugging_specialist');
  console.log('Prompt length:', prompt.length);
  console.log('\nPrompt includes:');
  console.log('- Debugging methodology');
  console.log('- React context');
  console.log('- JavaScript best practices\n');
}

// ============================================================================
// Example 6: Using prompts in API calls
// ============================================================================

async function example6_apiUsage() {
  console.log('\n=== Example 6: API Usage Pattern ===\n');

  // Simulated API client setup
  const ClaudeAPIClient = require('../services/claude/ClaudeAPIClient');
  const claudeClient = new ClaudeAPIClient();

  // User message
  const userMessage = "Write a function to validate email addresses in Python";

  // Conversation history
  const messages = [
    { role: 'user', content: userMessage }
  ];

  // Get intelligent system prompt
  const systemPrompt = getIntelligentSystemPrompt(userMessage, []);

  console.log('Sending message to Claude with system prompt:');
  console.log('- Mode: coding_assistant');
  console.log('- Language: Python detected');
  console.log('- Prompt configured\n');

  // Make API call with system prompt
  try {
    // Uncomment to actually make the call:
    // const response = await claudeClient.createMessage(messages, {
    //   system: systemPrompt,
    //   max_tokens: 2000
    // });
    // console.log('Response:', response.content[0].text);

    console.log('(API call skipped in example)\n');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// Example 7: Switching modes during conversation
// ============================================================================

function example7_modeSwitching() {
  console.log('\n=== Example 7: Dynamic Mode Switching ===\n');

  const conversation = [
    {
      user: "Write a binary search function",
      expectedMode: PROMPT_MODES.DEFAULT
    },
    {
      user: "I'm getting an IndexError on line 15",
      expectedMode: PROMPT_MODES.DEBUGGING
    },
    {
      user: "Can you review the code for performance issues?",
      expectedMode: PROMPT_MODES.CODE_REVIEW
    },
    {
      user: "How does binary search work?",
      expectedMode: PROMPT_MODES.TEACHING
    }
  ];

  console.log('Conversation flow with automatic mode switching:\n');

  conversation.forEach((turn, index) => {
    const detectedMode = detectPromptMode(turn.user);
    const match = detectedMode === turn.expectedMode ? '✓' : '✗';

    console.log(`Turn ${index + 1}:`);
    console.log(`  User: "${turn.user}"`);
    console.log(`  Expected: ${turn.expectedMode}`);
    console.log(`  Detected: ${detectedMode} ${match}\n`);
  });
}

// ============================================================================
// Example 8: Prompt mode comparison
// ============================================================================

function example8_modeComparison() {
  console.log('\n=== Example 8: Compare Prompt Modes ===\n');

  const modes = [
    PROMPT_MODES.DEFAULT,
    PROMPT_MODES.DEBUGGING,
    PROMPT_MODES.CODE_REVIEW,
    PROMPT_MODES.ARCHITECTURE,
    PROMPT_MODES.TEACHING
  ];

  console.log('Prompt mode characteristics:\n');

  modes.forEach(mode => {
    const prompt = getSystemPrompt(mode);
    const lines = prompt.split('\n').length;
    const words = prompt.split(/\s+/).length;

    console.log(`${mode}:`);
    console.log(`  Length: ${prompt.length} chars`);
    console.log(`  Lines: ${lines}`);
    console.log(`  Words: ${words}`);
    console.log(`  Focus: ${getModeDescription(mode)}\n`);
  });
}

function getModeDescription(mode) {
  const descriptions = {
    [PROMPT_MODES.DEFAULT]: 'General software engineering',
    [PROMPT_MODES.DEBUGGING]: 'Error analysis and troubleshooting',
    [PROMPT_MODES.CODE_REVIEW]: 'Code quality and improvements',
    [PROMPT_MODES.ARCHITECTURE]: 'System design and patterns',
    [PROMPT_MODES.TEACHING]: 'Learning and explanation'
  };
  return descriptions[mode] || 'Unknown';
}

// ============================================================================
// Example 9: Custom prompt builder
// ============================================================================

function example9_customBuilder() {
  console.log('\n=== Example 9: Custom Prompt Builder ===\n');

  // Build a custom prompt for a specific project
  function buildProjectSpecificPrompt(projectConfig) {
    const basePrompt = getSystemPrompt(PROMPT_MODES.DEFAULT);

    const projectContext = `

=== PROJECT CONTEXT ===
Project: ${projectConfig.name}
Type: ${projectConfig.type}
Stack: ${projectConfig.stack.join(', ')}
Standards: ${projectConfig.standards}

Key Requirements:
${projectConfig.requirements.map(r => `- ${r}`).join('\n')}

When helping with this project, always:
${projectConfig.guidelines.map(g => `- ${g}`).join('\n')}
`;

    return basePrompt + projectContext;
  }

  // Example project configuration
  const projectConfig = {
    name: 'E-commerce Platform',
    type: 'Full-stack web application',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    standards: 'Airbnb JavaScript Style Guide',
    requirements: [
      'PCI-DSS compliance for payment processing',
      'GDPR compliance for user data',
      'High availability (99.9% uptime)',
      'Scalable to 100k concurrent users'
    ],
    guidelines: [
      'Use TypeScript for type safety',
      'Write tests for all business logic',
      'Follow security best practices',
      'Optimize database queries',
      'Use caching where appropriate'
    ]
  };

  const customPrompt = buildProjectSpecificPrompt(projectConfig);

  console.log('Built custom project-specific prompt');
  console.log('Total length:', customPrompt.length, 'chars');
  console.log('\nProject context added:');
  projectConfig.requirements.forEach(req => {
    console.log(`  - ${req}`);
  });
  console.log();
}

// ============================================================================
// Example 10: Performance testing
// ============================================================================

function example10_performance() {
  console.log('\n=== Example 10: Performance Testing ===\n');

  const iterations = 1000;
  const testMessage = "I'm getting a TypeError when trying to access user.profile.name";

  // Test detection speed
  console.log(`Running ${iterations} iterations...\n`);

  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    detectPromptMode(testMessage);
    detectLanguage(testMessage);
    detectFramework(testMessage);
  }
  const end = Date.now();

  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  console.log(`Total time: ${totalTime}ms`);
  console.log(`Average per iteration: ${avgTime.toFixed(3)}ms`);
  console.log(`Throughput: ${(iterations / (totalTime / 1000)).toFixed(0)} ops/sec\n`);
}

// ============================================================================
// Run all examples
// ============================================================================

function runAllExamples() {
  console.log('\n'.repeat(2));
  console.log('='.repeat(80));
  console.log('         SYSTEM PROMPTS - USAGE EXAMPLES');
  console.log('='.repeat(80));

  example1_specificMode();
  example2_detectMode();
  example3_detectContext();
  example4_customizations();
  example5_intelligentSelection();
  example6_apiUsage();
  example7_modeSwitching();
  example8_modeComparison();
  example9_customBuilder();
  example10_performance();

  console.log('='.repeat(80));
  console.log('         ALL EXAMPLES COMPLETED');
  console.log('='.repeat(80));
  console.log('\n');
}

// ============================================================================
// Module exports
// ============================================================================

module.exports = {
  example1_specificMode,
  example2_detectMode,
  example3_detectContext,
  example4_customizations,
  example5_intelligentSelection,
  example6_apiUsage,
  example7_modeSwitching,
  example8_modeComparison,
  example9_customBuilder,
  example10_performance,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}
