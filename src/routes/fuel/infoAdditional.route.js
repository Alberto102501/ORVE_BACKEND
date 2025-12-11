const { Router } = require('express');
const router = Router();

const { getInfos, getInfoByCardNumber, postInfo, putInfoByCardNumber, getProcessedFuelInfo  } = require('../../controllers/fuel/infoAdditional.controller');
const auditLogger = require('../../middleware/auditLogger.js');
const InfoAdditional = require('../../models/fuel/infoAdditional.model.js');
const validateToken = require('../../middleware/validateToken.js');

router.route('/')
    .get(validateToken.authRequired, getInfos)
    .post(validateToken.authRequired, auditLogger(InfoAdditional), postInfo);

// en tu archivo de rutas (ej: src/routes/fuel.routes.js)
router.get('/processed', validateToken.authRequired, getProcessedFuelInfo);


router.route('/:numberCard')
    .get(validateToken.authRequired, getInfoByCardNumber)
    .put(validateToken.authRequired, auditLogger(InfoAdditional), putInfoByCardNumber);

module.exports = router;
