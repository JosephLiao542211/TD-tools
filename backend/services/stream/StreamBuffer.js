class StreamBuffer {
  constructor(maxSize = 1000000) {
    this.buffers = new Map();
    this.maxSize = maxSize;
  }

  create(streamId) {
    this.buffers.set(streamId, {
      data: '',
      chunks: [],
      size: 0,
    });
  }

  append(streamId, chunk) {
    const buffer = this.buffers.get(streamId);
    if (!buffer) {
      this.create(streamId);
      return this.append(streamId, chunk);
    }

    buffer.data += chunk;
    buffer.chunks.push({
      text: chunk,
      timestamp: Date.now(),
    });
    buffer.size += chunk.length;

    if (buffer.size > this.maxSize) {
      this.trim(streamId);
    }
  }

  get(streamId) {
    const buffer = this.buffers.get(streamId);
    return buffer?.data || '';
  }

  getChunks(streamId) {
    const buffer = this.buffers.get(streamId);
    return buffer?.chunks || [];
  }

  trim(streamId) {
    const buffer = this.buffers.get(streamId);
    if (!buffer) return;

    const keepSize = Math.floor(this.maxSize * 0.7);
    const trimAmount = buffer.size - keepSize;

    if (trimAmount > 0) {
      buffer.data = buffer.data.substring(trimAmount);
      buffer.size = buffer.data.length;

      while (buffer.chunks.length > 0 && buffer.chunks[0].text.length < trimAmount) {
        buffer.chunks.shift();
      }
    }
  }

  clear(streamId) {
    this.buffers.delete(streamId);
  }

  getSize(streamId) {
    const buffer = this.buffers.get(streamId);
    return buffer?.size || 0;
  }
}

module.exports = StreamBuffer;
