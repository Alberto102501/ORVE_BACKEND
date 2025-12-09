const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    // Información de la Solicitud
    method: { type: String, required: true }, // POST, PUT, PATCH
    endpoint: { type: String, required: true }, // Ruta a la que se accedió
    ipAddress: { type: String }, // Dirección IP del cliente

    // Información del Usuario/Sistema
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Opcional: Si el usuario está autenticado
    userName: { type: String }, // Nombre de usuario del equipo (si se envía en headers) o del sistema
    
    // Contenido
    changes: { type: Object }, // Datos enviados en el cuerpo de la solicitud (req.body)
    
    // Metadatos
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema, 'auditLogs');