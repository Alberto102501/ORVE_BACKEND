// routes/notification.route.js

const express = require('express');
const notificationController = require('../../controllers/baseWorkshop/notification.controller');

const router = express.Router();

// GET /api/notifications: Obtener notificaciones, opcionalmente filtradas por isRead
router.get('/', notificationController.getNotifications);

// PATCH /api/notifications/mark-read: Marcar todas las notificaciones no leídas como leídas
router.patch('/mark-read', notificationController.markAllAsRead);

router.post('/', notificationController.createNotification);

module.exports = router;