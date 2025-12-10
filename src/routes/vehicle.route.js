const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const upload = require('../middleware/upload');
const auditLogger = require('../middleware/auditLogger');
const Vehicle = require('../models/vehicle.model');


// Crear nuevo vehículo
router.post('/', upload.array('images', 6), auditLogger(Vehicle), vehicleController.createVehicle);

// Obtener todos los vehículos
router.get('/', vehicleController.getVehicles);

// Obtener un vehículo por ID
router.get('/:id', vehicleController.getVehicleById);

// Actualizar un vehículo por ID
router.put('/:id', upload.array('images', 6), auditLogger(Vehicle), vehicleController.updateVehicle);

// Actualizar parcialmente un vehículo por ID
router.patch('/:id', upload.array('images', 6), auditLogger(Vehicle), vehicleController.patchVehicle);

module.exports = router;
