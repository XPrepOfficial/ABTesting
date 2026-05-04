const { getAllFeatures, upsertFeature } = require('../services/feature.service');
const { getExperiments } = require('../services/experiment.service');

function getBucketFromUserId(userId) {
  return String(userId).slice(-1).toLowerCase();
}

function resolveVariant(bucketMap, bucket) {
  if (!bucketMap) return 'Control';
  const map = bucketMap instanceof Map ? Object.fromEntries(bucketMap) : bucketMap;
  return map[bucket] || 'Control';
}

async function getFeaturesConfig(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId query param is required' });
  }

  const features = await getAllFeatures();

  const experimentKeys = [
    ...new Set(features.map((f) => f.experimentKey).filter(Boolean)),
  ];

  const experiments = experimentKeys.length > 0 ? await getExperiments(experimentKeys) : {};

  const config = {};

  for (const feature of features) {
    const entry = { enabled: feature.enabled };

    if (feature.experimentKey) {
      const experiment = experiments[feature.experimentKey];
      const variant =
        experiment && experiment.isActive
          ? resolveVariant(experiment.bucketMap, getBucketFromUserId(userId))
          : 'Control';
      entry.experiment = { variant };
    }

    config[feature.featureKey] = entry;
  }

  res.json(config);
}

async function createOrUpdateFeature(req, res) {
  const { featureKey, enabled, experimentKey } = req.body;

  if (!featureKey) {
    return res.status(400).json({ error: 'featureKey is required' });
  }
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'enabled must be a boolean' });
  }

  const feature = await upsertFeature({ featureKey, enabled, experimentKey });
  res.json(feature);
}

module.exports = { getFeaturesConfig, createOrUpdateFeature };
