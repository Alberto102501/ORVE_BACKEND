const express = require('express');
const localVehicleServiceController = require('../../controllers/localWorkshop/localVehicleService.controller');

const router = express.Router();

router.get('/getByFolio/:folio', localVehicleServiceController.getRequestByFolio);
router.get('/', localVehicleServiceController.getRegistersService);
router.get('/:id', localVehicleServiceController.getById);
router.post('/newService', localVehicleServiceController.createRequestService);
router.put('/update/:id', localVehicleServiceController.updateRequestService);
router.patch('/updateStatusByFolio/:folio', localVehicleServiceController.updateVehicleStatusByFolio);
router.patch('/finalize/:id', localVehicleServiceController.finalizeVehicleService);

module.exports = router;
