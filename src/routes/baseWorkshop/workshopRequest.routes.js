const express = require('express');
const router = express.Router();
const workshopRequestController = require('../../controllers/baseWorkshop/workshopRequest.controller');
const auditLogger = require('../../middleware/auditLogger.js');
const WorkshopRequest = require('../../models/baseWorkshop/workshopRequest.model');

// Ruta para crear una nueva solicitud
// POST /api/workshop-requests
router.post('/', auditLogger(WorkshopRequest), workshopRequestController.createRequest);

// GET citas de hoy
router.get('/available-today', workshopRequestController.getAvailableAppointmentsForToday);

// Ruta para obtener todas las solicitudes
// GET /api/workshop-requests
router.get('/', workshopRequestController.getRequests);

// Ruta para obtener una solicitud por su ID
// GET /api/workshop-requests/:id
router.get('/:id', workshopRequestController.getRequestById);

// Ruta para obtener una solicitud por su folio
// GET /api/workshop-requests/folio/:folio
router.get('/folio/:folio', workshopRequestController.getRequestByFolio);

router.get('/getByPlate/:plate', workshopRequestController.getRequestProductByPlate);

// Ruta para actualizar una solicitud por su ID
// PUT /api/workshop-requests/:id
router.put('/:id', auditLogger(WorkshopRequest), workshopRequestController.updateRequest);

// Ruta para eliminar una solicitud por su ID
// DELETE /api/workshop-requests/:id
router.delete('/:id', auditLogger(WorkshopRequest), workshopRequestController.deleteRequest);

module.exports = router;