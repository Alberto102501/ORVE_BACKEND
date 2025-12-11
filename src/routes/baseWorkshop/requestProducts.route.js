const express = require('express');
const requestProductsController = require('../../controllers/baseWorkshop/requestProducts.controller.js');
const auditLogger = require('../../middleware/auditLogger.js');
const RequestProducts = require('../../models/baseWorkshop/requestProducts.model.js');
const validateToken = require('../../middleware/validateToken.js');
const router = express.Router();

router.get('/', validateToken.authRequired, requestProductsController.getAllRequestProducts);
router.get('/getByFolio/:folio', validateToken.authRequired, requestProductsController.getAllRequestProductsByFolio);
router.post('/createRequestProducts', validateToken.authRequired, auditLogger(RequestProducts), requestProductsController.createRequestProducts);
router.patch('/updateStatus/:id', validateToken.authRequired, auditLogger(RequestProducts), requestProductsController.updateRequestProductsStatus);

module.exports = router;