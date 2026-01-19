class ClaudeRateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      perMinute: 50,
      perHour: 1000,
    };
  }

  checkLimit(sessionId) {
    const now = Date.now();
    const sessionRequests = this.requests.get(sessionId) || [];

    // Clean old requests
    const recentRequests = sessionRequests.filter(
      timestamp => now - timestamp < 3600000 // 1 hour
    );

    const lastMinute = recentRequests.filter(
      timestamp => now - timestamp < 60000
    ).length;

    if (lastMinute >= this.limits.perMinute) {
      return { allowed: false, reason: 'rate_limit_minute' };
    }

    if (recentRequests.length >= this.limits.perHour) {
      return { allowed: false, reason: 'rate_limit_hour' };
    }

    recentRequests.push(now);
    this.requests.set(sessionId, recentRequests);

    return { allowed: true };
  }

  reset(sessionId) {
    this.requests.delete(sessionId);
  }

  setLimits(perMinute, perHour) {
    this.limits = { perMinute, perHour };
  }
}

module.exports = ClaudeRateLimiter;
