const AuditLog = require('../models/Audit/auditLog.model'); // Asegúrate de que la ruta sea correcta

const auditLogger = async (req, res, next) => {
    // Solo registramos si el método es POST, PUT o PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        
        // 1. Extraer datos relevantes
        const logData = {
            method: req.method,
            endpoint: req.originalUrl,
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            
            // Si el frontend envía un header personalizado:
            userName: req.headers['x-user-system-name'] || 'Desconocido', 
            
            // Asumiendo que el usuario está autenticado y la información está en req.user
            // userId: req.user?._id, 
            
            // Cuerpo de la petición. Excluye datos sensibles como contraseñas.
            changes: { ...req.body }, 
        };

        try {
            // 2. Guardar la entrada en la base de datos
            const logEntry = new AuditLog(logData);
            await logEntry.save();
        } catch (error) {
            console.error('Error al guardar log de auditoría:', error);
            // No detenemos la petición principal si falla el logging
        }
    }

    next(); // Continúa con la ejecución normal de la ruta/controlador
};

module.exports = auditLogger;