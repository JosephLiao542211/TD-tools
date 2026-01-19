class HealthChecker {
  constructor() {
    this.checks = new Map();
    this.status = 'healthy';
  }

  registerCheck(name, checkFunction) {
    this.checks.set(name, checkFunction);
  }

  async runCheck(name) {
    const checkFn = this.checks.get(name);
    if (!checkFn) {
      return { status: 'unknown', message: 'Check not found' };
    }

    try {
      const result = await checkFn();
      return {
        status: 'healthy',
        ...result,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
      };
    }
  }

  async runAllChecks() {
    const results = {};

    for (const [name, checkFn] of this.checks.entries()) {
      try {
        results[name] = await checkFn();
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          message: error.message,
        };
      }
    }

    return results;
  }

  async getHealth() {
    const checks = await this.runAllChecks();
    const allHealthy = Object.values(checks).every(
      check => check.status === 'healthy'
    );

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
}

module.exports = HealthChecker;
