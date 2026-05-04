const crypto = require('crypto');

/**
 * Returns a single hex character (0–f) deterministically derived from
 * userId + experimentKey via MD5. Same inputs always produce the same bucket.
 */
function getBucket(userId, experimentKey) {
  const input = String(userId) + experimentKey;
  return crypto.createHash('md5').update(input).digest('hex')[0];
}

module.exports = { getBucket };
