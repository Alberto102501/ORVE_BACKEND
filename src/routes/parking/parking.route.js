const { Router } = require('express');
const { updateParking, getParkings, getParking, getParkingsOfMotorcycle, updateParkingByReceipt } = require('../../controllers/parking/parking.controller.js');
const auditLogger = require('../../middleware/auditLogger');
const Parking = require('../../models/parking/parking.model');

const router = Router();

router.get('/motorcycle', getParkingsOfMotorcycle);
router.put('/receipt/:id', auditLogger(Parking), updateParkingByReceipt);
router.get('/', getParkings);
router.get('/:id', getParking);
router.put('/:id', auditLogger(Parking), updateParking);

module.exports = router;
