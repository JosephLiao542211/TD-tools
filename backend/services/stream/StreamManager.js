class StreamManager {
  constructor() {
    this.activeStreams = new Map();
    this.buffers = new Map();
  }

  createStream(sessionId) {
    this.activeStreams.set(sessionId, {
      sessionId,
      active: true,
      startTime: Date.now(),
    });
    this.buffers.set(sessionId, '');
  }

  isActive(sessionId) {
    const stream = this.activeStreams.get(sessionId);
    return stream?.active || false;
  }

  appendToBuffer(sessionId, text) {
    const current = this.buffers.get(sessionId) || '';
    this.buffers.set(sessionId, current + text);
  }

  getBuffer(sessionId) {
    return this.buffers.get(sessionId) || '';
  }

  clearBuffer(sessionId) {
    this.buffers.set(sessionId, '');
  }

  endStream(sessionId) {
    const stream = this.activeStreams.get(sessionId);
    if (stream) {
      stream.active = false;
      stream.endTime = Date.now();
    }
  }

  cleanup(sessionId) {
    this.activeStreams.delete(sessionId);
    this.buffers.delete(sessionId);
  }

  getActiveStreams() {
    return Array.from(this.activeStreams.values()).filter(s => s.active);
  }

  getStreamStats(sessionId) {
    const stream = this.activeStreams.get(sessionId);
    const buffer = this.buffers.get(sessionId) || '';

    return {
      active: stream?.active || false,
      duration: stream ? Date.now() - stream.startTime : 0,
      bufferSize: buffer.length,
    };
  }
}

module.exports = StreamManager;
