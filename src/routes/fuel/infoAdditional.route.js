const { Router } = require('express');
const router = Router();

const { getInfos, getInfoByCardNumber, postInfo, putInfoByCardNumber } = require('../../controllers/fuel/infoAdditional.controller');

router.route('/')
    .get(getInfos)
    .post(postInfo);

router.route('/:numberCard')
    .get(getInfoByCardNumber)
    .put(putInfoByCardNumber);

module.exports = router;
