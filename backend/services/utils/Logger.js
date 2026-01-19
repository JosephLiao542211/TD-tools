class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
  }

  log(level, message, meta = {}) {
    if (this.levels[level] <= this.levels[this.logLevel]) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta,
      };
      console.log(JSON.stringify(logEntry));
    }
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  setLevel(level) {
    if (this.levels[level] !== undefined) {
      this.logLevel = level;
    }
  }

  logRequest(req) {
    this.info('Incoming request', {
      method: req.method,
      path: req.path,
      ip: req.ip,
    });
  }

  logResponse(req, res, duration) {
    this.info('Response sent', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  }
}

module.exports = Logger;
