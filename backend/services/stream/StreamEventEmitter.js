const EventEmitter = require('events');

class StreamEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.streams = new Map();
  }

  registerStream(streamId) {
    this.streams.set(streamId, {
      startTime: Date.now(),
      eventCount: 0,
    });
    this.emit('stream:start', { streamId });
  }

  emitChunk(streamId, chunk) {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.eventCount++;
    }
    this.emit('stream:chunk', { streamId, chunk });
  }

  emitComplete(streamId, data) {
    this.emit('stream:complete', { streamId, data });
  }

  emitError(streamId, error) {
    this.emit('stream:error', { streamId, error });
  }

  emitPause(streamId) {
    this.emit('stream:pause', { streamId });
  }

  emitResume(streamId) {
    this.emit('stream:resume', { streamId });
  }

  unregisterStream(streamId) {
    this.streams.delete(streamId);
    this.emit('stream:end', { streamId });
  }

  getStreamInfo(streamId) {
    return this.streams.get(streamId);
  }

  getAllStreams() {
    return Array.from(this.streams.keys());
  }
}

module.exports = StreamEventEmitter;
