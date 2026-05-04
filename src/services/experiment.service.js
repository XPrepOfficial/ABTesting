const Experiment = require('../models/experiment.model');
const cache = require('../config/cache');

const VALID_HEX = new Set('0123456789abcdef'.split(''));

async function getExperiment(experimentKey) {
  const cached = cache.get(experimentKey);
  if (cached !== null) return cached;

  const experiment = await Experiment.findOne({ experimentKey }).lean();
  // Store null explicitly so we don't hammer DB for unknown keys
  cache.set(experimentKey, experiment ?? false);
  return experiment ?? null;
}

async function getExperiments(experimentKeys) {
  const results = {};
  const missing = [];

  for (const key of experimentKeys) {
    const cached = cache.get(key);
    if (cached !== null) {
      results[key] = cached || null;
    } else {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const found = await Experiment.find({ experimentKey: { $in: missing } }).lean();
    const foundMap = Object.fromEntries(found.map((e) => [e.experimentKey, e]));

    for (const key of missing) {
      const exp = foundMap[key] ?? null;
      cache.set(key, exp ?? false);
      results[key] = exp;
    }
  }

  return results;
}

async function upsertExperiment({ experimentKey, isActive, bucketMap }) {
  const invalidKeys = Object.keys(bucketMap).filter((k) => !VALID_HEX.has(k));
  if (invalidKeys.length > 0) {
    const err = new Error(`Invalid bucketMap keys: ${invalidKeys.join(', ')}. Must be hex chars 0–f.`);
    err.status = 400;
    throw err;
  }

  const experiment = await Experiment.findOneAndUpdate(
    { experimentKey },
    { experimentKey, isActive, bucketMap },
    { upsert: true, new: true, runValidators: true }
  ).lean();

  cache.invalidate(experimentKey);
  return experiment;
}

async function getAllEnabledExperiments() {
  return Experiment.find({ isActive: true }).lean();
}

module.exports = { getExperiment, getExperiments, getAllEnabledExperiments, upsertExperiment };
