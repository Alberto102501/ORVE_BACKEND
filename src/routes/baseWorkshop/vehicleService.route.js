const express = require('express');
const vehicleServiceController = require('../../controllers/baseWorkshop/vehicleService.controller');

const Router = express.Router();

Router.get('/', vehicleServiceController.getRegistersService);
Router.post('/newService', vehicleServiceController.createRequestService);

module.exports = Router;