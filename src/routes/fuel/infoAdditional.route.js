const { Router } = require('express');
const router = Router();

const { getInfos, getInfoByCardNumber, postInfo, putInfoByCardNumber, getProcessedFuelInfo  } = require('../../controllers/fuel/infoAdditional.controller');
const auditLogger = require('../../middleware/auditLogger.js');
const InfoAdditional = require('../../models/fuel/infoAdditional.model.js');

router.route('/')
    .get(getInfos)
    .post(auditLogger(InfoAdditional), postInfo);

// en tu archivo de rutas (ej: src/routes/fuel.routes.js)
router.get('/processed', getProcessedFuelInfo);


router.route('/:numberCard')
    .get(getInfoByCardNumber)
    .put(auditLogger(InfoAdditional), putInfoByCardNumber);

module.exports = router;
