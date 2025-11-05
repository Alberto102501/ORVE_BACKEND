const express = require('express');
const router = express.Router();
const orderProductController = require('../../controllers/baseWorkshop/orderProduct.controller');

router.post('/', orderProductController.createOrder);

router.get('/', orderProductController.getOrders);

router.get('/:id', orderProductController.getOrderById);

router.put('/:id', orderProductController.updateOrder);

router.delete('/:id', orderProductController.deleteOrder);

module.exports = router;