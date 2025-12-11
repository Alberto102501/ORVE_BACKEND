const express = require('express');
const router = express.Router();
const particularVehicleController = require('../../controllers/parking/particularVehicle.controller');
const auditLogger = require('../../middleware/auditLogger');
const ParticularVehicle = require('../../models/parking/particularVehicles.model');
const validateToken = require('../../middleware/validateToken');

router.get('/checkUniqueness', validateToken.authRequired, particularVehicleController.checkUniqueness);

router.get('/', validateToken.authRequired, particularVehicleController.getParticularVehicle);

router.post('/addVehicle', validateToken.authRequired, auditLogger(ParticularVehicle), particularVehicleController.createParticularVehicle);

router.put('/updateVehicle/:id', validateToken.authRequired, auditLogger(ParticularVehicle), particularVehicleController.updateParticularVehicle);



module.exports = router;