const express = require('express');
const localVehicleServiceController = require('../../controllers/localWorkshop/localVehicleService.controller');
const auditLogger = require('../../middleware/auditLogger');
const LocalVehicleService = require('../../models/localWorkshop/localVehicleService.model');
const validateToken = require('../../middleware/validateToken');

const router = express.Router();

router.get('/getByFolio/:folio', validateToken.authRequired, localVehicleServiceController.getRequestByFolio);
router.get('/', validateToken.authRequired, localVehicleServiceController.getRegistersService);
router.get('/:id', validateToken.authRequired, localVehicleServiceController.getById);
router.post('/newService', validateToken.authRequired, auditLogger(LocalVehicleService), localVehicleServiceController.createRequestService);
router.put('/update/:id', validateToken.authRequired, auditLogger(LocalVehicleService), localVehicleServiceController.updateRequestService);
router.patch('/updateStatusByFolio/:folio', validateToken.authRequired, auditLogger(LocalVehicleService), localVehicleServiceController.updateVehicleStatusByFolio);
router.patch('/finalize/:id', validateToken.authRequired, auditLogger(LocalVehicleService), localVehicleServiceController.finalizeVehicleService);

module.exports = router;
