const express = require('express');
const router = express.Router();
const workshopRequestController = require('../../controllers/baseWorkshop/workshopRequest.controller');
const auditLogger = require('../../middleware/auditLogger.js');
const WorkshopRequest = require('../../models/baseWorkshop/workshopRequest.model');
const validateToken = require('../../middleware/validateToken.js');

// Ruta para crear una nueva solicitud
// POST /api/workshop-requests
router.post('/', auditLogger(WorkshopRequest), workshopRequestController.createRequest);

// GET citas de hoy
router.get('/available-today', validateToken.authRequired, workshopRequestController.getAvailableAppointmentsForToday);

// Ruta para obtener todas las solicitudes
// GET /api/workshop-requests
router.get('/', validateToken.authRequired, workshopRequestController.getRequests);

// Ruta para obtener una solicitud por su ID
// GET /api/workshop-requests/:id
router.get('/:id', validateToken.authRequired, workshopRequestController.getRequestById);

// Ruta para obtener una solicitud por su folio
// GET /api/workshop-requests/folio/:folio
router.get('/folio/:folio', validateToken.authRequired, workshopRequestController.getRequestByFolio);

router.get('/getByPlate/:plate', validateToken.authRequired, workshopRequestController.getRequestProductByPlate);

// Ruta para actualizar una solicitud por su ID
// PUT /api/workshop-requests/:id
router.put('/:id', validateToken.authRequired, auditLogger(WorkshopRequest), workshopRequestController.updateRequest);

// Ruta para eliminar una solicitud por su ID
// DELETE /api/workshop-requests/:id
router.delete('/:id', validateToken.authRequired, auditLogger(WorkshopRequest), workshopRequestController.deleteRequest);

module.exports = router;