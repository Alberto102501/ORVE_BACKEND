const express = require('express');
const requestProductsController = require('../../controllers/baseWorkshop/requestProducts.controller.js');

const router = express.Router();

router.get('/', requestProductsController.getAllRequestProducts);
router.post('/createRequestProducts', requestProductsController.createRequestProducts);
router.patch('/updateStatus/:id', requestProductsController.updateRequestProductsStatus);

module.exports = router;