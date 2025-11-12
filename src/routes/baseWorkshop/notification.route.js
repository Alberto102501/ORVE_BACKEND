// routes/baseWorkshop/notification.route.js

const express = require('express');
const notificationController = require('../../controllers/baseWorkshop/notification.controller');

const router = express.Router();

// GET /api/notifications: Obtener notificaciones, opcionalmente filtradas por isRead
router.get('/', notificationController.getNotifications);

// PATCH /api/notifications/mark-all-read: Marcar TODAS las notificaciones no leídas como leídas
router.patch('/mark-all-read', notificationController.markAllAsRead);

// NUEVA RUTA: Marcar una notificación específica como leída por su ID
router.patch('/mark-read/:id', notificationController.markAsReadById);

router.post('/', notificationController.createNotificationHandler);


module.exports = router;