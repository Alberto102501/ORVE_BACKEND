const express = require('express');
const router = express.Router();
const orderProductController = require('../../controllers/baseWorkshop/orderProduct.controller');
const auditLogger = require('../../middleware/auditLogger');
const OrderProduct = require('../../models/baseWorkshop/orderProduct.model');
const validateToken = require('../../middleware/validateToken.js');

router.post('/', validateToken.authRequired, auditLogger(OrderProduct), orderProductController.createOrder);

router.get('/', validateToken.authRequired, orderProductController.getOrders);

router.get('/:id', validateToken.authRequired, orderProductController.getOrderById);

router.put('/:id', validateToken.authRequired, auditLogger(OrderProduct), orderProductController.updateOrder);

router.delete('/:id', validateToken.authRequired, auditLogger(OrderProduct), orderProductController.deleteOrder);

module.exports = router;