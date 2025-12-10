const express = require('express');
const router = express.Router();
const orderProductController = require('../../controllers/baseWorkshop/orderProduct.controller');
const auditLogger = require('../../middleware/auditLogger');
const OrderProduct = require('../../models/baseWorkshop/orderProduct.model');

router.post('/', auditLogger(OrderProduct), orderProductController.createOrder);

router.get('/', orderProductController.getOrders);

router.get('/:id', orderProductController.getOrderById);

router.put('/:id', auditLogger(OrderProduct), orderProductController.updateOrder);

router.delete('/:id', auditLogger(OrderProduct), orderProductController.deleteOrder);

module.exports = router;