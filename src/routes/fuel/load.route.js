const {Router} = require('express');
const { createLoad, getLoads } = require('../../controllers/fuel/load.controller.js');
const auditLogger = require('../../middleware/auditLogger.js');
const Load = require('../../models/fuel/load.model.js');
const validateToken = require('../../middleware/validateToken.js');

const router = Router();

router.get('/', validateToken.authRequired, getLoads);
router.post('/addLoad', validateToken.authRequired, auditLogger(Load), createLoad);

module.exports = router;