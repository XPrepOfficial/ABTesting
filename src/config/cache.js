const CACHE_TTL_MS = 30 * 1000;

class ExperimentCache {
  constructor() {
    this._store = new Map();
    this._timestamps = new Map();
  }

  get(key) {
    const ts = this._timestamps.get(key);
    if (!ts || Date.now() - ts > CACHE_TTL_MS) {
      this._evict(key);
      return null;
    }
    return this._store.get(key) ?? null;
  }

  set(key, value) {
    this._store.set(key, value);
    this._timestamps.set(key, Date.now());
  }

  invalidate(key) {
    this._evict(key);
  }

  _evict(key) {
    this._store.delete(key);
    this._timestamps.delete(key);
  }
}

module.exports = new ExperimentCache();
