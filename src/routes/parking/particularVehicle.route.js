const express = require('express');
const router = express.Router();
const particularVehicleController = require('../../controllers/parking/particularVehicle.controller');
const auditLogger = require('../../middleware/auditLogger');
const ParticularVehicle = require('../../models/parking/particularVehicles.model');

router.get('/checkUniqueness', particularVehicleController.checkUniqueness);

router.get('/', particularVehicleController.getParticularVehicle);

router.post('/addVehicle', auditLogger(ParticularVehicle), particularVehicleController.createParticularVehicle);

router.put('/updateVehicle/:id', auditLogger(ParticularVehicle), particularVehicleController.updateParticularVehicle);



module.exports = router;