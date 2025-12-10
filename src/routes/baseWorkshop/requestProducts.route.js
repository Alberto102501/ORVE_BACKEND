const express = require('express');
const requestProductsController = require('../../controllers/baseWorkshop/requestProducts.controller.js');
const auditLogger = require('../../middleware/auditLogger.js');
const RequestProducts = require('../../models/baseWorkshop/requestProducts.model.js');

const router = express.Router();

router.get('/', requestProductsController.getAllRequestProducts);
router.get('/getByFolio/:folio', requestProductsController.getAllRequestProductsByFolio);
router.post('/createRequestProducts', auditLogger(RequestProducts), requestProductsController.createRequestProducts);
router.patch('/updateStatus/:id', auditLogger(RequestProducts), requestProductsController.updateRequestProductsStatus);

module.exports = router;