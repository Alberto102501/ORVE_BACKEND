const {Router} = require('express');
const { createLoad, getLoads } = require('../../controllers/fuel/load.controller.js');
const auditLogger = require('../../middleware/auditLogger.js');
const Load = require('../../models/fuel/load.model.js');

const router = Router();

router.get('/', getLoads);
router.post('/addLoad', auditLogger(Load), createLoad);

module.exports = router;