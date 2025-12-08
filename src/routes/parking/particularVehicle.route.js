const express = require('express');
const router = express.Router();
const particularVehicleController = require('../../controllers/parking/particularVehicle.controller');

router.get('/checkUniqueness', particularVehicleController.checkUniqueness);

router.get('/', particularVehicleController.getParticularVehicle);

router.post('/addVehicle', particularVehicleController.createParticularVehicle);

router.put('/updateVehicle/:id', particularVehicleController.updateParticularVehicle);



module.exports = router;