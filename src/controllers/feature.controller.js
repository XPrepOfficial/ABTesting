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
  const { userId, appName } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId query param is required' });
  }
  if (!appName) {
    return res.status(400).json({ error: 'appName query param is required' });
  }

  const features = await getAllFeatures(appName);

  const experimentKeys = [
    ...new Set(features.map((f) => f.experimentKey).filter(Boolean)),
  ];

  const experiments = experimentKeys.length > 0 ? await getExperiments(experimentKeys) : {};

  const config = {};

  for (const feature of features) {
    let entry;

    if (feature.status === 'Success') {
      entry = { enabled: true, variant: feature.variant };
    } else if (feature.status === 'Failure') {
      entry = { enabled: false, variant: 'control' };
    } else {
      if (feature.experimentKey) {
        const experiment = experiments[feature.experimentKey];
        const variant =
          experiment && experiment.isActive
            ? resolveVariant(experiment.bucketMap, getBucketFromUserId(userId))
            : 'Control';
        entry = { enabled: variant !== 'Control', variant };
      } else {
        entry = { enabled: feature.isActive };
      }
    }

    config[feature.featureKey] = entry;
  }

  res.json(config);
}

async function createOrUpdateFeature(req, res) {
  const { featureKey, isActive, status, variant, experimentKey, appName } = req.body;

  if (!featureKey) {
    return res.status(400).json({ error: 'featureKey is required' });
  }
  if (typeof isActive !== 'boolean') {
    return res.status(400).json({ error: 'isActive must be a boolean' });
  }
  if (!appName) {
    return res.status(400).json({ error: 'appName is required' });
  }
  if (status && !['Running', 'Success', 'Failure'].includes(status)) {
    return res.status(400).json({ error: 'status must be Running, Success, or Failure' });
  }

  const feature = await upsertFeature({ featureKey, isActive, status, variant, experimentKey, appName });
  res.json(feature);
}

module.exports = { getFeaturesConfig, createOrUpdateFeature };
