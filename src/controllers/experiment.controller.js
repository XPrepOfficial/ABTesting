const { upsertExperiment } = require('../services/experiment.service');

async function createOrUpdateExperiment(req, res) {
  const { experimentKey, enabled = true, bucketMap } = req.body;

  if (!experimentKey || typeof experimentKey !== 'string') {
    return res.status(400).json({ error: 'experimentKey (string) is required' });
  }
  if (!bucketMap || typeof bucketMap !== 'object' || Array.isArray(bucketMap)) {
    return res.status(400).json({ error: 'bucketMap (object) is required' });
  }

  const experiment = await upsertExperiment({ experimentKey, enabled, bucketMap });
  res.json(experiment);
}

module.exports = { createOrUpdateExperiment };
