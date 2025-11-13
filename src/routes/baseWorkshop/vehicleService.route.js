const express = require('express');
const vehicleServiceController = require('../../controllers/baseWorkshop/vehicleService.controller');

const Router = express.Router();

Router.get('/getByFolio/:folio', vehicleServiceController.getRequestByFolio);
Router.get('/', vehicleServiceController.getRegistersService);
Router.get('/:id', vehicleServiceController.getById);
Router.post('/newService', vehicleServiceController.createRequestService);
Router.put('/update/:id', vehicleServiceController.updateRequestService);
Router.patch('/updateStatusByFolio/:folio', vehicleServiceController.updateVehicleStatusByFolio);
Router.patch('/finalize/:id', vehicleServiceController.finalizeVehicleService);

module.exports = Router;