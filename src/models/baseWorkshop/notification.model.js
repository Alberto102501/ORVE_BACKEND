// models/baseWorkshop/notification.model.js

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
    timestamps: true // Esto añade campos `createdAt` y `updatedAt` automáticamente
});


// OPTIMIZACIÓN CLAVE: ÍNDICE ÚNICO PARCIAL
// Garantiza que solo puede haber UN documento donde:
// 1. La placa (plate) sea la misma.
// 2. El tipo (type) sea 'RECURRENCE_ALERT'.
// 3. El estado de lectura (isRead) sea FALSE.
// Esto previene los duplicados incluso en caso de llamadas concurrentes.
notificationSchema.index(
    { plate: 1, type: 1, isRead: 1 }, 
    { 
        unique: true, 
        partialFilterExpression: { 
            isRead: false, 
            type: 'RECURRENCE_ALERT' 
        } 
    }
); 


module.exports = mongoose.model('notification', notificationSchema, 'notification');