const { Router } = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { getFeaturesConfig, createOrUpdateFeature } = require('../controllers/feature.controller');

const router = Router();

router.get('/config', asyncHandler(getFeaturesConfig));
router.post('/', asyncHandler(createOrUpdateFeature));

module.exports = router;
