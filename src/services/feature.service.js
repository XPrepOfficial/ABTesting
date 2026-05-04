const Feature = require('../models/feature.model');

async function getAllFeatures() {
  return Feature.find().lean();
}

async function upsertFeature({ featureKey, enabled, experimentKey }) {
  return Feature.findOneAndUpdate(
    { featureKey },
    { featureKey, enabled, experimentKey: experimentKey ?? null },
    { upsert: true, new: true, runValidators: true }
  ).lean();
}

module.exports = { getAllFeatures, upsertFeature };
