const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const upload = require('../middleware/upload');
const auditLogger = require('../middleware/auditLogger');
const Vehicle = require('../models/vehicle.model');
const validateToken = require('../middleware/validateToken');


// Crear nuevo vehículo
router.post('/', validateToken.authRequired, upload.array('images', 6), auditLogger(Vehicle), vehicleController.createVehicle);

// Obtener todos los vehículos
router.get('/', validateToken.authRequired, vehicleController.getVehicles);

// Obtener un vehículo por ID
router.get('/:id', validateToken.authRequired, vehicleController.getVehicleById);

// Actualizar un vehículo por ID
router.put('/:id', validateToken.authRequired, upload.array('images', 6), auditLogger(Vehicle), vehicleController.updateVehicle);

// Actualizar parcialmente un vehículo por ID
router.patch('/:id', validateToken.authRequired, upload.array('images', 6), auditLogger(Vehicle), vehicleController.patchVehicle);

module.exports = router;
