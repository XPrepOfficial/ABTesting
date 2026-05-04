const { getBucket } = require('./hashing.service');
const { getExperiment, getExperiments, getAllEnabledExperiments } = require('./experiment.service');

const DEFAULT_VARIANT = 'Control';

// Mongoose Map type returns a plain object after .lean()
function resolveVariant(bucketMap, bucket) {
  if (!bucketMap) return DEFAULT_VARIANT;
  const map = bucketMap instanceof Map ? Object.fromEntries(bucketMap) : bucketMap;
  return map[bucket] || DEFAULT_VARIANT;
}

async function assignVariant(userId, experimentKey) {
  const experiment = await getExperiment(experimentKey);

  if (!experiment || !experiment.enabled) {
    return DEFAULT_VARIANT;
  }

  const bucket = getBucket(userId, experimentKey);
  const variant = resolveVariant(experiment.bucketMap, bucket);

  return variant;
}

async function assignVariants(userId, experimentKeys) {
  const experiments = await getExperiments(experimentKeys);
  const results = {};

  for (const key of experimentKeys) {
    const experiment = experiments[key];

    if (!experiment || !experiment.enabled) {
      results[key] = DEFAULT_VARIANT;
      continue;
    }

    const bucket = getBucket(userId, key);
    const variant = resolveVariant(experiment.bucketMap, bucket);

    results[key] = variant;
  }

  return results;
}

async function assignAllVariants(userId) {
  const experiments = await getAllEnabledExperiments();
  const activeList = [];
  const controlList = [];

  for (const experiment of experiments) {
    const bucket = getBucket(userId, experiment.experimentKey);
    const variant = resolveVariant(experiment.bucketMap, bucket);
    if (variant === DEFAULT_VARIANT) {
      controlList.push(experiment.experimentKey);
    } else {
      activeList.push(experiment.experimentKey);
    }
  }

  return { activeList, controlList };
}

module.exports = { assignVariant, assignVariants, assignAllVariants };
