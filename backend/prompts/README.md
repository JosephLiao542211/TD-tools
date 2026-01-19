# System Prompts for Claude Coding Assistant

This directory contains intelligent system prompts that transform Claude into a specialized coding and development assistant.

## Overview

The system prompt functionality automatically adapts Claude's behavior based on the type of coding task you're working on. It detects the context from your messages and selects the most appropriate expert persona.

## Features

### 🎯 Intelligent Mode Selection

The system automatically detects what you need help with and selects the appropriate prompt mode:

- **Coding Assistant** (Default) - General software engineering help
- **Debugging Specialist** - Error analysis and troubleshooting
- **Code Review** - Code quality and improvement suggestions
- **Architecture Advisor** - System design and architectural decisions
- **Teaching Mode** - Learning and concept explanation

### 🔍 Context Detection

Automatically detects:
- **Programming languages** (JavaScript, Python, Java, Go, Rust, etc.)
- **Frameworks** (React, Django, Express, Spring Boot, etc.)
- **Project types** (web apps, APIs, mobile apps, etc.)

### ⚙️ Customizable

Configure behavior through `/backend/config/promptConfig.js`:
- Enable/disable intelligent selection
- Set default modes
- Add project-specific context
- Customize mode behaviors

## How It Works

### Automatic Detection Examples

**1. Debugging Detection:**
```
You: "Getting TypeError: Cannot read property 'name' of undefined"
System: Activates DEBUGGING_SPECIALIST_PROMPT
Claude: Provides step-by-step error analysis and solutions
```

**2. Code Review Detection:**
```
You: "Can you review this code and give me feedback?"
System: Activates CODE_REVIEW_PROMPT
Claude: Provides structured review with security, performance, and style feedback
```

**3. Architecture Detection:**
```
You: "Should I use microservices or a monolith for this project?"
System: Activates ARCHITECTURE_ADVISOR_PROMPT
Claude: Discusses trade-offs and provides architectural guidance
```

**4. Teaching Detection:**
```
You: "How does async/await work in JavaScript?"
System: Activates TEACHING_PROMPT
Claude: Provides clear explanation with examples and analogies
```

**5. Default Coding Assistant:**
```
You: "Write a function to validate email addresses"
System: Uses CODING_ASSISTANT_PROMPT
Claude: Provides complete, tested code with explanations
```

## Available Prompt Modes

### 1. CODING_ASSISTANT_PROMPT (Default)

**Best for:**
- Writing new code
- General programming questions
- Feature implementation
- Code refactoring

**Characteristics:**
- Comprehensive software engineering knowledge
- Security-aware
- Best practices focused
- Provides complete, runnable code
- Multi-language support

### 2. DEBUGGING_SPECIALIST_PROMPT

**Best for:**
- Error analysis
- Bug fixing
- Stack trace interpretation
- Troubleshooting

**Characteristics:**
- Methodical debugging approach
- Error pattern recognition
- Root cause analysis
- Prevention strategies

**Triggers:**
- Messages containing: "error", "bug", "not working", "fails", "throws"
- Stack traces or error messages

### 3. CODE_REVIEW_PROMPT

**Best for:**
- Code quality review
- Security audits
- Performance optimization
- Best practices validation

**Characteristics:**
- Structured review format
- Prioritized issues (Critical → High → Medium → Low)
- Security focus
- Constructive feedback

**Triggers:**
- Messages containing: "review", "feedback", "improve this code", "is this good"

### 4. ARCHITECTURE_ADVISOR_PROMPT

**Best for:**
- System design
- Technology decisions
- Scalability planning
- Design patterns

**Characteristics:**
- High-level design thinking
- Trade-off analysis
- Scalability considerations
- Pattern recommendations

**Triggers:**
- Messages containing: "architecture", "design", "should I use", "best way to organize"

### 5. TEACHING_PROMPT

**Best for:**
- Learning concepts
- Understanding how things work
- Explaining differences
- Concept clarification

**Characteristics:**
- Patient explanations
- Progressive examples
- Analogies and real-world examples
- Practice suggestions

**Triggers:**
- Messages containing: "how does", "what is", "explain", "understand", "learn"

## Usage Examples

### Example 1: Automatic Debugging Help

**Your message:**
```
I'm getting this error when running my React app:

TypeError: Cannot read properties of undefined (reading 'map')
  at UserList (src/components/UserList.js:15)
  at renderWithHooks (react-dom.development.js:14985)
```

**What happens:**
1. System detects error message and stack trace
2. Activates `DEBUGGING_SPECIALIST_PROMPT`
3. Claude analyzes the error systematically:
   - Identifies the issue (accessing .map on undefined)
   - Locates the problem (UserList.js:15)
   - Suggests fixes (null checking, optional chaining)
   - Explains prevention (prop validation, TypeScript)

### Example 2: Code Writing

**Your message:**
```
Write a Python function to calculate Fibonacci numbers using memoization
```

**What happens:**
1. System detects Python and coding request
2. Uses `CODING_ASSISTANT_PROMPT` with Python context
3. Claude provides:
   - Complete, runnable code
   - Explanation of memoization
   - Time/space complexity analysis
   - Usage examples

### Example 3: Architecture Decision

**Your message:**
```
I'm building an e-commerce platform. Should I use a microservices architecture
or a monolith? Expected traffic is 10k users initially.
```

**What happens:**
1. System detects architecture question
2. Activates `ARCHITECTURE_ADVISOR_PROMPT`
3. Claude discusses:
   - Pros/cons of each approach
   - Considerations for your scale (10k users)
   - Recommendation (likely monolith first)
   - Migration path if needed later
   - Trade-offs explained

## Configuration

### Basic Configuration

Edit `/backend/config/promptConfig.js`:

```javascript
const promptConfig = {
  // Enable automatic mode detection
  intelligentSelection: true,

  // Default mode when not auto-detecting
  defaultMode: 'coding_assistant',

  // Auto-detect languages and frameworks
  autoDetectContext: true,

  // Log which mode is selected (useful for debugging)
  logPromptMode: true,
};
```

### Adding Custom Context

Add project-specific context that will be included in all prompts:

```javascript
const promptConfig = {
  customGlobalContext: `
    Project: E-commerce Platform
    Stack: Node.js, React, PostgreSQL
    Standards: Follow Airbnb JavaScript Style Guide
    Testing: Jest and React Testing Library required
  `,

  projectContext: {
    projectName: 'ShopApp',
    codingStandards: 'Airbnb JavaScript Style Guide',
    testingFramework: 'Jest with React Testing Library',
  },
};
```

### Mode-Specific Configuration

Customize behavior for specific modes:

```javascript
const promptConfig = {
  modeConfig: {
    debugging: {
      verbose: true,        // Detailed step-by-step analysis
      suggestTests: true,   // Always suggest tests to prevent regression
    },
    code_review: {
      detailLevel: 'high',  // More thorough reviews
      focusAreas: ['security', 'performance'],  // Priority areas
    },
    teaching: {
      defaultLevel: 'beginner',     // Assume beginner level
      includeExercises: true,       // Add practice exercises
    },
  },
};
```

### Disabling Intelligent Selection

To always use the same prompt mode:

```javascript
const promptConfig = {
  intelligentSelection: false,
  defaultMode: 'debugging',  // Always use debugging mode
};
```

## API Usage

### Programmatic Access

```javascript
const {
  getSystemPrompt,
  detectPromptMode,
  getIntelligentSystemPrompt,
  PROMPT_MODES
} = require('./prompts/systemPrompts');

// Get a specific prompt
const prompt = getSystemPrompt(PROMPT_MODES.DEBUGGING);

// Detect mode from message
const mode = detectPromptMode("I'm getting an error...");
console.log(mode); // 'debugging_specialist'

// Get intelligent prompt with context
const conversationHistory = [
  { role: 'user', content: 'Help me with Python' },
  { role: 'assistant', content: 'Sure! What do you need?' }
];
const currentMessage = "How do I handle exceptions?";
const prompt = getIntelligentSystemPrompt(currentMessage, conversationHistory);
// Returns TEACHING_PROMPT with Python context
```

### Manual Mode Selection

```javascript
const { getSystemPrompt, PROMPT_MODES } = require('./prompts/systemPrompts');

// Use specific mode with customizations
const prompt = getSystemPrompt(PROMPT_MODES.CODE_REVIEW, {
  language: 'python',
  framework: 'Django',
  projectType: 'REST API',
  additionalContext: 'Focus on security for payment processing'
});
```

## Customization Examples

### Example 1: Company-Specific Standards

```javascript
// In promptConfig.js
const promptConfig = {
  customGlobalContext: `
    Company: Acme Corp

    Mandatory Standards:
    - All APIs must use OAuth 2.0 authentication
    - Database queries must use parameterized statements
    - All user input must be validated and sanitized
    - Code must have 80%+ test coverage
    - Follow PCI-DSS guidelines for payment data

    Preferred Technologies:
    - Backend: Node.js with TypeScript
    - Frontend: React with TypeScript
    - Database: PostgreSQL
    - Testing: Jest, Supertest
    - CI/CD: GitHub Actions
  `,
};
```

### Example 2: Educational Institution

```javascript
// Teaching-focused configuration
const promptConfig = {
  defaultMode: 'teaching',
  modeConfig: {
    teaching: {
      defaultLevel: 'beginner',
      includeExercises: true,
    },
  },
  customGlobalContext: `
    Context: Computer Science 101 Course
    - Explain concepts from first principles
    - Use simple, beginner-friendly language
    - Avoid advanced topics unless specifically asked
    - Encourage good practices from the start
    - Provide learning resources
  `,
};
```

### Example 3: Security-First Organization

```javascript
// Security-focused configuration
const promptConfig = {
  modeConfig: {
    code_review: {
      detailLevel: 'high',
      focusAreas: ['security'],  // Security is #1 priority
    },
  },
  customGlobalContext: `
    Security Requirements:
    - OWASP Top 10 awareness mandatory
    - All code must be scanned with SonarQube
    - No secrets in code (use environment variables)
    - Input validation at all boundaries
    - Regular security audits
    - Principle of least privilege
  `,
};
```

## Testing the System Prompts

To verify the system is working correctly:

1. **Start your server:**
   ```bash
   cd /home/josephliao/Personal/backend
   npm start
   ```

2. **Send test messages:**

   **Test debugging detection:**
   ```bash
   curl -X POST http://localhost:3000/api/chat/message \
     -H "Content-Type: application/json" \
     -d '{"sessionId": "test123", "message": "Getting TypeError: undefined is not a function"}'
   ```

   **Test teaching detection:**
   ```bash
   curl -X POST http://localhost:3000/api/chat/message \
     -H "Content-Type: application/json" \
     -d '{"sessionId": "test123", "message": "How does async/await work?"}'
   ```

3. **Check logs:**
   Look for log entries showing which prompt mode was selected:
   ```
   [INFO] Using system prompt for session { sessionId: 'test123', promptLength: 2847 }
   ```

## Troubleshooting

### System prompt not being applied

**Check:**
1. Is `intelligentSelection` enabled in `promptConfig.js`?
2. Check server logs for prompt selection messages
3. Verify ChatController is using `getIntelligentSystemPrompt()`

### Wrong prompt mode selected

**Solutions:**
1. Review detection patterns in `systemPrompts.js`
2. Add more specific keywords for your use case
3. Use manual mode selection instead of auto-detection
4. Adjust detection sensitivity

### Performance issues

**If prompt selection is slow:**
1. Reduce `contextHistoryLength` in config (default: 5)
2. Enable `cachePrompts` in experimental features
3. Disable `autoDetectContext` if not needed

## Best Practices

1. **Keep custom context concise** - Long system prompts can affect response quality
2. **Test prompt changes** - Verify behavior with real examples
3. **Use specific modes** - Manual selection for specialized workflows
4. **Monitor logs** - Understand which modes are being selected
5. **Iterate** - Adjust detection patterns based on your usage

## File Structure

```
backend/
├── prompts/
│   ├── systemPrompts.js          # Main prompt definitions and logic
│   ├── README.md                 # This file
│   └── examples/                 # Usage examples
├── config/
│   └── promptConfig.js           # Configuration file
└── controllers/
    └── ChatController.js         # Integration point
```

## Contributing

To add new prompt modes or improve existing ones:

1. Edit `systemPrompts.js`
2. Add new prompt constant
3. Update `getSystemPrompt()` switch statement
4. Add detection patterns in `detectPromptMode()`
5. Test with real examples
6. Update this documentation

## Advanced Topics

### Creating Custom Prompt Modes

Add a new specialized mode:

```javascript
// In systemPrompts.js
const DATA_SCIENCE_PROMPT = `You are a data science expert specializing in...`;

const PROMPT_MODES = {
  // ... existing modes
  DATA_SCIENCE: 'data_science',
};

function getSystemPrompt(mode = 'DEFAULT', customizations = {}) {
  switch (mode) {
    // ... existing cases
    case PROMPT_MODES.DATA_SCIENCE:
    case 'data_science':
      basePrompt = DATA_SCIENCE_PROMPT;
      break;
  }
  // ... rest of function
}

function detectPromptMode(userMessage) {
  // ... existing detection
  if (message.includes('machine learning') || message.includes('data analysis')) {
    return PROMPT_MODES.DATA_SCIENCE;
  }
  // ... rest of function
}
```

### Multi-Language Support

The system automatically detects languages from:
- Language names mentioned (python, javascript, etc.)
- Framework names (React, Django, etc.)
- File extensions in messages
- Previous conversation context

Detected languages add context like:
```
**Current Focus**: python development
**Framework Context**: Working with Django
```

## Support

For issues or questions:
1. Check logs for debugging information
2. Review configuration in `promptConfig.js`
3. Test with simple examples first
4. Verify API key is valid in `.env`

## License

Part of the Claude Chat Terminal project.
