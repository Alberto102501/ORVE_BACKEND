const express = require('express');
const vehicleServiceController = require('../../controllers/baseWorkshop/vehicleService.controller');

const Router = express.Router();

Router.get('/', vehicleServiceController.getRegistersService);
Router.get('/:id', vehicleServiceController.getById);
Router.post('/newService', vehicleServiceController.createRequestService);
Router.put('/update/:id', vehicleServiceController.updateRequestService);

module.exports = Router;