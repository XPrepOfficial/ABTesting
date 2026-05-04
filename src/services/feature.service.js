const Feature = require('../models/feature.model');

async function getAllFeatures(appName) {
  return Feature.find({ appName }).lean();
}

async function upsertFeature({ featureKey, isActive, status, variant, experimentKey, appName }) {
  return Feature.findOneAndUpdate(
    { featureKey },
    {
      featureKey,
      isActive,
      status: status ?? 'Running',
      variant: variant ?? null,
      experimentKey: experimentKey ?? null,
      appName,
    },
    { upsert: true, new: true, runValidators: true }
  ).lean();
}

module.exports = { getAllFeatures, upsertFeature };
