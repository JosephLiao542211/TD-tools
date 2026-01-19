class MessageFormatter {
  formatForDisplay(message) {
    return {
      role: message.role,
      content: message.content,
      timestamp: message.timestamp?.toISOString() || new Date().toISOString(),
    };
  }

  formatForAPI(message) {
    return {
      role: message.role,
      content: message.content,
    };
  }

  formatBatch(messages) {
    return messages.map(msg => this.formatForAPI(msg));
  }

  addFormatting(content, type = 'markdown') {
    if (type === 'markdown') {
      return this.formatMarkdown(content);
    }
    return content;
  }

  formatMarkdown(content) {
    return content;
  }

  stripFormatting(content) {
    return content.replace(/[*_`~]/g, '');
  }

  truncate(content, maxLength = 100) {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }
}

module.exports = MessageFormatter;
