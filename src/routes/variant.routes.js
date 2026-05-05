const { Router } = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { getVariant, getVariants, getUserConfig } = require('../controllers/variant.controller');

const router = Router();

router.get('/', asyncHandler(getVariant));
router.post('/', asyncHandler(getVariants));
router.get('/config', asyncHandler(getUserConfig));

module.exports = router;
