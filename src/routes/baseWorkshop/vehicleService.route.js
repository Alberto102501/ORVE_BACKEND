const express = require('express');
const vehicleServiceController = require('../../controllers/baseWorkshop/vehicleService.controller');
const auditLogger = require('../../middleware/auditLogger');
const vehicleService = require('../../models/baseWorkshop/vehicleService.model');

const Router = express.Router();

Router.get('/getByFolio/:folio', vehicleServiceController.getRequestByFolio);
Router.get('/', vehicleServiceController.getRegistersService);
Router.get('/:id', vehicleServiceController.getById);
Router.post('/newService', auditLogger(vehicleService), vehicleServiceController.createRequestService);
Router.put('/update/:id', auditLogger(vehicleService), vehicleServiceController.updateRequestService);
Router.patch('/updateStatusByFolio/:folio', auditLogger(vehicleService), vehicleServiceController.updateVehicleStatusByFolio);
Router.patch('/finalize/:id', auditLogger(vehicleService), vehicleServiceController.finalizeVehicleService);

module.exports = Router;