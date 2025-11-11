// controllers/notification.controller.js

const Notification = require('../../models/baseWorkshop/notification.model');

// POST: Crear una nueva notificación (Usado en VehicleRegistration.jsx:analyzeServiceHistory)
exports.createNotification = async (plate, message) => {
    try {
        const newNotification = new Notification({
            plate,
            message,
            type: 'RECURRENCE_ALERT',
            isRead: false
        });
        await newNotification.save();
        return true;
    } catch (error) {
        console.error('Error al crear notificación:', error);
        return false;
    }
};


// GET: Obtener notificaciones
// Soporta filtrado por query parameter (ej: ?isRead=false)
exports.getNotifications = async (req, res) => {
    try {
        // Filtramos por isRead=false para obtener solo las NO LEÍDAS (badge count)
        const filter = req.query.isRead === 'false' ? { isRead: false } : {};
        
        // Obtener las 20 notificaciones más recientes
        const notifications = await Notification.find(filter)
            .sort({ timestamp: -1 })
            .limit(20); 

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener notificaciones', error: error.message });
    }
};

// PATCH: Marcar todas las notificaciones no leídas como leídas
exports.markAllAsRead = async (req, res) => {
    try {
        // Actualiza el campo isRead de false a true para todas las que cumplan la condición
        const result = await Notification.updateMany(
            { isRead: false }, // Condición: solo las no leídas
            { $set: { isRead: true } } // Acción: marcar como true
        );

        res.status(200).json({ 
            message: `Marcadas ${result.modifiedCount} notificaciones como leídas.`,
            count: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar notificaciones como leídas', error: error.message });
    }
};