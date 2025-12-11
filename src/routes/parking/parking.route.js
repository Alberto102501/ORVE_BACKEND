const { Router } = require('express');
const { updateParking, getParkings, getParking, getParkingsOfMotorcycle, updateParkingByReceipt } = require('../../controllers/parking/parking.controller.js');
const auditLogger = require('../../middleware/auditLogger');
const Parking = require('../../models/parking/parking.model');
const validateToken = require('../../middleware/validateToken');

const router = Router();

router.get('/motorcycle', validateToken.authRequired, getParkingsOfMotorcycle);
router.put('/receipt/:id', validateToken.authRequired, auditLogger(Parking), updateParkingByReceipt);
router.get('/', validateToken.authRequired, getParkings);
router.get('/:id', validateToken.authRequired, getParking);
router.put('/:id', validateToken.authRequired, auditLogger(Parking), updateParking);

module.exports = router;
