const { Router } = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { getVariant, getVariants, getUserConfig } = require('../controllers/variant.controller');

const router = Router();

router.get('/variant', asyncHandler(getVariant));
router.post('/variants', asyncHandler(getVariants));
router.get('/variants/config', asyncHandler(getUserConfig));

module.exports = router;
