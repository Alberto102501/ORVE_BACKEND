const express = require('express');
const vehicleServiceController = require('../../controllers/baseWorkshop/vehicleService.controller');
const auditLogger = require('../../middleware/auditLogger');
const vehicleService = require('../../models/baseWorkshop/vehicleService.model');
const validateToken = require('../../middleware/validateToken.js');

const Router = express.Router();

Router.get('/getByFolio/:folio', validateToken.authRequired, vehicleServiceController.getRequestByFolio);
Router.get('/', validateToken.authRequired, vehicleServiceController.getRegistersService);
Router.get('/:id', validateToken.authRequired, vehicleServiceController.getById);
Router.post('/newService', validateToken.authRequired, auditLogger(vehicleService), vehicleServiceController.createRequestService);
Router.put('/update/:id', validateToken.authRequired, auditLogger(vehicleService), vehicleServiceController.updateRequestService);
Router.patch('/updateStatusByFolio/:folio', validateToken.authRequired, auditLogger(vehicleService), vehicleServiceController.updateVehicleStatusByFolio);
Router.patch('/finalize/:id', validateToken.authRequired, auditLogger(vehicleService), vehicleServiceController.finalizeVehicleService);

module.exports = Router;