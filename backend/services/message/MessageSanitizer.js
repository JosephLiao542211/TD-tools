class MessageSanitizer {
  sanitize(message) {
    return {
      ...message,
      content: this.sanitizeContent(message.content),
    };
  }

  sanitizeContent(content) {
    if (typeof content !== 'string') {
      return '';
    }

    let sanitized = content;

    sanitized = this.removeControlCharacters(sanitized);
    sanitized = this.normalizeWhitespace(sanitized);
    sanitized = sanitized.trim();

    return sanitized;
  }

  removeControlCharacters(text) {
    return text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  }

  normalizeWhitespace(text) {
    return text.replace(/\s+/g, ' ');
  }

  removeHTMLTags(text) {
    return text.replace(/<[^>]*>/g, '');
  }

  escapeHTML(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  sanitizeBatch(messages) {
    return messages.map(msg => this.sanitize(msg));
  }
}

module.exports = MessageSanitizer;
