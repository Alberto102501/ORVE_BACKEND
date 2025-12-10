const AuditLog = require('../models/Audit/auditLog.model'); // Asegúrate de que la ruta sea correcta

const auditLogger = (Model = null) => async (req, res, next) => {
    // Solo registramos si el método es POST, PUT o PATCH
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {

        let previousState = null;

        // Si es una actualización y tenemos el Modelo y el ID, buscamos el estado anterior
        if (['PUT', 'PATCH', 'DELETE'].includes(req.method) && Model && req.params.id) {
            try {
                const doc = await Model.findById(req.params.id).lean();
                if (doc) {
                    previousState = doc;
                }
            } catch (error) {
                console.error('Error al obtener el estado anterior para auditoría:', error);
            }
        }

        if (req.method === 'PUT' && req.originalUrl.includes('/api/fuel/info/')) {
            try {
                const doc = await Model.findOne({
                    numberCard: req.params.numberCard,
                    "fuelDetails.month": req.body.fuelDetails.month,
                    "fuelDetails.year": req.body.fuelDetails.year
                }).lean();
                if (doc) {
                    previousState = doc;
                }
            } catch (error) {
                console.error('Error al obtener el estado anterior para auditoría:', error);
            }
        }


        // 1. Extraer datos relevantes
        const logData = {
            method: req.method,
            endpoint: req.originalUrl,
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,

            // Si el frontend envía un header personalizado:
            userName: req.headers['x-user-system-name'] || 'Desconocido',

            // userId: req.user?.id, // Asumiendo req.user.id tras autenticación

            // Cuerpo de la petición (lo nuevo) y estado anterior
            newData: { ...req.body },
            oldData: previousState
        };

        try {
            // 2. Guardar la entrada en la base de datos
            const logEntry = new AuditLog(logData);
            await logEntry.save();
        } catch (error) {
            console.error('Error al guardar log de auditoría:', error);
        }
    }

    next();
};

module.exports = auditLogger;