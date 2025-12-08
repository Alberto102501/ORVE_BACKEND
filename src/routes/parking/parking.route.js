const { Router } = require('express');
const { updateParking, getParkings, getParking, getParkingsOfMotorcycle, updateParkingByReceipt } = require('../../controllers/parking/parking.controller.js');

const router = Router();

router.get('/motorcycle', getParkingsOfMotorcycle);
router.put('/receipt/:id', updateParkingByReceipt);
router.get('/', getParkings);
router.get('/:id', getParking);
router.put('/:id', updateParking);

module.exports = router;
