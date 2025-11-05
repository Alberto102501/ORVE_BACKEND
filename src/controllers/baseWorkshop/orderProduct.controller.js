const OrderProduct = require('../../models/baseWorkshop/orderProduct.model');

// Crear una nueva orden de productos
exports.createOrder = async (req, res) => {
    try {
        const { products, status } = req.body;
        const newOrder = new OrderProduct({
            products,
            status,
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden de productos.', error: error.message });
    }
};

// Obtener todas las órdenes de productos
exports.getOrders = async (req, res) => {
    try {
        const orders = await OrderProduct.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las órdenes de productos.', error: error.message });
    }
};

// Obtener una orden de productos por ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await OrderProduct.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Orden de productos no encontrada.' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden de productos.', error: error.message });
    }
};

// Actualizar una orden de productos por ID
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await OrderProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Orden de productos no encontrada.' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la orden de productos.', error: error.message });
    }
};

// Eliminar una orden de productos por ID
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await OrderProduct.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Orden de productos no encontrada.' });
        }
        res.status(200).json({ message: 'Orden de productos eliminada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la orden de productos.', error: error.message });
    }
};