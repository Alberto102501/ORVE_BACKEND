const express = require('express');
const localVehicleServiceController = require('../../controllers/localWorkshop/localVehicleService.controller');
const auditLogger = require('../../middleware/auditLogger');
const LocalVehicleService = require('../../models/localWorkshop/localVehicleService.model');

const router = express.Router();

router.get('/getByFolio/:folio', localVehicleServiceController.getRequestByFolio);
router.get('/', localVehicleServiceController.getRegistersService);
router.get('/:id', localVehicleServiceController.getById);
router.post('/newService', auditLogger(LocalVehicleService), localVehicleServiceController.createRequestService);
router.put('/update/:id', auditLogger(LocalVehicleService), localVehicleServiceController.updateRequestService);
router.patch('/updateStatusByFolio/:folio', auditLogger(LocalVehicleService), localVehicleServiceController.updateVehicleStatusByFolio);
router.patch('/finalize/:id', auditLogger(LocalVehicleService), localVehicleServiceController.finalizeVehicleService);

module.exports = router;
