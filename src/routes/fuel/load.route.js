const {Router} = require('express');
const { createLoad, getLoads } = require('../../controllers/fuel/load.controller.js');

const router = Router();

router.get('/', getLoads);
router.post('/addLoad', createLoad);

module.exports = router;