const express = require('express');
const router = express.Router();
const authorizedVehiclesController = require('../../controllers/localWorkshop/authorizedVehicles.controller');

router.get('/', authorizedVehiclesController.getAuthorizedVehicles);
router.post('/', authorizedVehiclesController.createAuthorizedVehicle);
router.put('/:id', authorizedVehiclesController.updateAuthorizedVehicle);
router.delete('/:id', authorizedVehiclesController.deleteAuthorizedVehicle);

module.exports = router;