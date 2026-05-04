const { assignVariant, assignVariants, assignAllVariants } = require('../services/assignment.service');

async function getVariant(req, res) {
  const { userId, experimentKey } = req.query;

  if (!userId || !experimentKey) {
    return res.status(400).json({ error: 'userId and experimentKey query params are required' });
  }

  const variant = await assignVariant(userId, experimentKey);
  res.json({ variant });
}

async function getVariants(req, res) {
  const { userId, experiments } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  if (!Array.isArray(experiments) || experiments.length === 0) {
    return res.status(400).json({ error: 'experiments must be a non-empty array' });
  }

  const variants = await assignVariants(userId, experiments);
  res.json(variants);
}

async function getUserConfig(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId query param is required' });
  }

  const config = await assignAllVariants(userId);
  res.json(config);
}

module.exports = { getVariant, getVariants, getUserConfig };
