// models/notification.model.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // Referencia al registro del vehículo o folio (para enlazar la alerta a la tabla)
    plate: {
        type: String,
        required: true,
        trim: true,
        index: true // Índice para búsquedas rápidas por placa
    },
    
    // Tipo de alerta (ej: 'RECURRENCE', 'LOW_STOCK', etc.)
    type: {
        type: String,
        required: true,
        enum: ['RECURRENCE_ALERT', 'GENERAL_INFO'],
        default: 'RECURRENCE_ALERT'
    },
    
    // Mensaje descriptivo para mostrar en la interfaz
    message: {
        type: String,
        required: true,
    },
    
    // Estado de lectura (false = no leída, true = leída)
    isRead: {
        type: Boolean,
        default: false
    },
    
    // Fecha y hora en que se generó la alerta
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('notification', notificationSchema, 'notification');