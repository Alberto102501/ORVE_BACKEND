const {Router} = require('express');
const { updateParking, getParkings, getParking } = require('../../controllers/parking/parking.controller.js');

const router = Router();

router.get('/', getParkings);
router.get('/:id', getParking);
router.put('/:id', updateParking);

module.exports = router;
