const { Router } = require('express');
const variantRoutes = require('./variant.routes');
const experimentRoutes = require('./experiment.routes');
const featureRoutes = require('./feature.routes');

const router = Router();

router.use('/variant',variantRoutes);
router.use('/experiment',experimentRoutes);
router.use('/feature',featureRoutes);

module.exports = router;
