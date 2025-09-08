const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');

// Crear nuevo vehículo
router.post('/', vehicleController.createVehicle);

// Obtener todos los vehículos
router.get('/', vehicleController.getVehicles);

// Obtener un vehículo por ID
router.get('/:id', vehicleController.getVehicleById);

// Actualizar un vehículo por ID
router.put('/:id', vehicleController.updateVehicle);

module.exports = router;
