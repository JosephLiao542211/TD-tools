class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttlMap = new Map();
    this.defaultTTL = 3600000; // 1 hour
  }

  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);

    if (ttl > 0) {
      const expiresAt = Date.now() + ttl;
      this.ttlMap.set(key, expiresAt);

      setTimeout(() => {
        this.delete(key);
      }, ttl);
    }

    return true;
  }

  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const expiresAt = this.ttlMap.get(key);
    if (expiresAt && Date.now() > expiresAt) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  has(key) {
    return this.cache.has(key) && this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
    this.ttlMap.delete(key);
    return true;
  }

  clear() {
    this.cache.clear();
    this.ttlMap.clear();
  }

  size() {
    return this.cache.size;
  }

  keys() {
    return Array.from(this.cache.keys());
  }

  prune() {
    const now = Date.now();
    for (const [key, expiresAt] of this.ttlMap.entries()) {
      if (now > expiresAt) {
        this.delete(key);
      }
    }
  }
}

module.exports = CacheManager;
