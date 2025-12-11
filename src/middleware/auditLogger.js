const AuditLog = require('../models/Audit/auditLog.model');

const getPreviousState = async (req, Model) => {
    if (!Model) return null;

    try {
        // Lógica específica: Deduct Stock (PATCH)
        if (req.method === 'PATCH' && req.originalUrl.includes('/api/base-workshop/deduct-stock')) {
            const products = req.body;
            // Validar que se reciba un array para evitar errores
            if (Array.isArray(products)) {
                return await Model.find({
                    _id: { $in: products.map(p => p.inventoryId) },
                }).lean();
            }
            return null;
        }

        // Lógica específica: Fuel Info (PUT)
        if (req.method === 'PUT' && req.originalUrl.includes('/api/fuel/info/')) {
            // Verificamos que existan structure de fuelDetails para evitar crash
            if (req.body.fuelDetails) {
                return await Model.findOne({
                    numberCard: req.params.numberCard,
                    "fuelDetails.month": req.body.fuelDetails.month,
                    "fuelDetails.year": req.body.fuelDetails.year
                }).lean();
            }
        }

        // Lógica específica: Parking Receipt (PUT)
        if (req.method === 'PUT' && req.originalUrl.includes('/api/parkingPlace/receipt/')) {
            const doc = await Model.findOne({
                "info.parkId": req.params.id,
            }).lean();
            return doc || { message: "No tenia Parking" };
        }

        // Lógica específica: Update Status By Folio (PATCH)
        if (req.method === 'PATCH' && (req.originalUrl.includes('/api/baseWorkshop/updateStatusByFolio/') || req.originalUrl.includes('/api/localWorkshop/updateStatusByFolio/'))) {
            return await Model.findOne({
                folio: req.params.folio,
            }).lean();
        }

        // Lógica Genérica por ID (req.params.id)
        // Se ejecuta si ninguna ruta específica hizo match antes.
        if (req.params.id) {
            return await Model.findById(req.params.id).lean();
        }
    } catch (error) {
        console.error('Error al obtener el estado anterior en auditLogger:', error);
    }

    return null;
};

const auditLogger = (Model = null) => async (req, res, next) => {
    // Solo registramos si el método es de modificación
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return next();
    }

    let previousState = null;

    // Obtenemos el estado anterior ANTES de continuar con la petición (next)
    // Esto es necesario para capturar el valor antes de que el controlador lo modifique.
    if (['PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        previousState = await getPreviousState(req, Model);
    }

    // Hook para guardar el log después de que la respuesta se haya enviado al cliente.
    // Esto evita bloquear la respuesta del servidor mientras se guarda el log.
    res.on('finish', async () => {
        // Opcional: Solo loguear si la petición fue exitosa (2xx) o error de cliente (4xx), 
        // pero generalmente para auditoría queremos registrar todo intento.

        try {
            const logData = {
                method: req.method,
                endpoint: req.originalUrl,
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,

                // Nombre de sistema desde headers si existe
                userName: req.headers['x-user-system-name'] || 'Desconocido',

                // ID de usuario autenticado (si middleware de auth corrió antes)
                userId: req.user?._id || req.user?.id,

                // Datos de la petición y estado previo
                newData: { ...req.body },
                oldData: previousState
            };

            const logEntry = new AuditLog(logData);
            await logEntry.save();
        } catch (error) {
            console.error('Error asíncrono al guardar log de auditoría:', error);
        }
    });

    next();
};

module.exports = auditLogger;