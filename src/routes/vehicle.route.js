const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const upload = require('../middleware/upload');


// Crear nuevo vehículo
router.post('/', upload.array('images', 6), vehicleController.createVehicle);

// Obtener todos los vehículos
router.get('/', vehicleController.getVehicles);

// Obtener un vehículo por ID
router.get('/:id', vehicleController.getVehicleById);

// Actualizar un vehículo por ID
router.put('/:id', vehicleController.updateVehicle);

// Actualizar parcialmente un vehículo por ID
router.patch('/:id', vehicleController.patchVehicle);

module.exports = router;
