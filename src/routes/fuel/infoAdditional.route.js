const { Router } = require('express');
const router = Router();

const { getInfos, getInfoByCardNumber, postInfo, putInfoByCardNumber, getProcessedFuelInfo  } = require('../../controllers/fuel/infoAdditional.controller');

router.route('/')
    .get(getInfos)
    .post(postInfo);

// en tu archivo de rutas (ej: src/routes/fuel.routes.js)
router.get('/processed', getProcessedFuelInfo);


router.route('/:numberCard')
    .get(getInfoByCardNumber)
    .put(putInfoByCardNumber);

module.exports = router;
