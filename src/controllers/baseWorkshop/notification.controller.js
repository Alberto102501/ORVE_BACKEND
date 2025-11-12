// controllers/baseWorkshop/notification.controller.js

const Notification = require('../../models/baseWorkshop/notification.model');
const mongoose = require('mongoose'); // Necesario para la validación del ID

// POST: Crear una nueva notificación
exports.createNotificationHandler = async (req, res) => {
    try {
        const { plate, message, type } = req.body; 

        const newNotification = new Notification({
            plate,
            message,
            type: type || 'RECURRENCE_ALERT', 
            isRead: false
        });
        await newNotification.save();
        
        res.status(201).json({ message: 'Notificación creada con éxito', data: newNotification }); 
    } catch (error) {
        console.error('Error al crear notificación (Handler):', error);
        
        if (error.name === 'ValidationError') {
             return res.status(400).json({ message: 'Fallo de validación de notificación.', errorDetail: error.message });
        }
        res.status(500).json({ message: 'Error interno al crear notificación.' });
    }
};


// GET: Obtener notificaciones
// Soporta filtrado por query parameter (ej: ?isRead=false)
exports.getNotifications = async (req, res) => {
    try {
        // Se mantiene la lógica de filtrado por isRead si se pasa el query param
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

// PATCH: Marcar TODAS las notificaciones no leídas como leídas
exports.markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { isRead: false }, 
            { $set: { isRead: true } } 
        );

        res.status(200).json({ 
            message: `Marcadas ${result.modifiedCount} notificaciones como leídas.`,
            count: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar notificaciones como leídas', error: error.message });
    }
};


// NUEVA FUNCIÓN: Marcar una notificación específica como leída
exports.markAsReadById = async (req, res) => {
    try {
        const { id } = req.params; // ID de la notificación a marcar

        // Validar que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de notificación inválido.' });
        }

        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            { $set: { isRead: true } }, // Acción: Cambiar isRead a true
            { new: true } // Devolver el documento actualizado
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: 'Notificación no encontrada.' });
        }

        res.status(200).json({ message: 'Notificación marcada como leída.', data: updatedNotification });

    } catch (error) {
        console.error('Error al marcar notificación individual como leída:', error);
        res.status(500).json({ message: 'Error interno al procesar la solicitud.' });
    }
};