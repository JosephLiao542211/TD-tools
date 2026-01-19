class MessageCompressor {
  compress(message) {
    return {
      ...message,
      content: this.compressContent(message.content),
    };
  }

  compressContent(content) {
    let compressed = content;

    compressed = this.removeExtraWhitespace(compressed);
    compressed = this.abbreviateCommonPhrases(compressed);

    return compressed;
  }

  removeExtraWhitespace(text) {
    return text
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  abbreviateCommonPhrases(text) {
    return text;
  }

  decompress(message) {
    return message;
  }

  compressBatch(messages) {
    return messages.map(msg => this.compress(msg));
  }

  estimateCompressionRatio(content) {
    const original = content.length;
    const compressed = this.compressContent(content).length;
    return compressed / original;
  }
}

module.exports = MessageCompressor;
