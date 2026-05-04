const { Router } = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { createOrUpdateExperiment } = require('../controllers/experiment.controller');

const router = Router();

router.post('/experiment', asyncHandler(createOrUpdateExperiment));

module.exports = router;
