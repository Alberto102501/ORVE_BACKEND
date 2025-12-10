const express = require('express');
const router = express.Router();
const authorizedVehiclesController = require('../../controllers/localWorkshop/authorizedVehicles.controller');
const auditLogger = require('../../middleware/auditLogger');
const AuthorizedVehicle = require('../../models/localWorkshop/authorizedVehicles.model');

router.get('/', authorizedVehiclesController.getAuthorizedVehicles);
router.get('/getByPlate/:plates', authorizedVehiclesController.getAuthorizedVehicleByPlate);
router.post('/', auditLogger(AuthorizedVehicle), authorizedVehiclesController.createAuthorizedVehicle);
router.put('/:id', auditLogger(AuthorizedVehicle), authorizedVehiclesController.updateAuthorizedVehicle);
router.delete('/:id', auditLogger(AuthorizedVehicle), authorizedVehiclesController.deleteAuthorizedVehicle);

module.exports = router;