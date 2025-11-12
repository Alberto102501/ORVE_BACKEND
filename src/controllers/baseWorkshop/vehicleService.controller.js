const newService = require('../../models/baseWorkshop/vehicleService.model');
const Notification = require('../../models/baseWorkshop/notification.model');
const mongoose = require('mongoose'); // NECESARIO para usar la función $match en aggregation

exports.getRegistersService = async (req, res) => {
    try {
        // --- CÁLCULO DE FECHAS ---
        // 1. Fecha para la lógica de VISITAS FRECUENTES (últimos 30 días)
        const THIRTY_DAYS_AGO = new Date();
        THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30); 
        
        // 2. Fecha para la lógica de COOLDOWN DE ALERTA (últimos 30 días)
        // Usamos el mismo periodo de 30 días para el "silencio" de la alerta.
        const ALERT_COOLDOWN_DATE = new Date(THIRTY_DAYS_AGO.getTime()); 
        
        const LIMIT_RECORDS = 100; 
        
        // =========================================================================
        // 1. OPTIMIZACIÓN DE PERSISTENCIA: Obtener todas las placas con alertas RECIENTES
        // Buscamos CUALQUIER alerta de recurrencia creada en los últimos 30 días (leída o no).
        const existingAlerts = await Notification.find({
            type: 'RECURRENCE_ALERT',
            // Buscamos cualquier alerta creada desde la fecha de Cooldown
            createdAt: { $gte: ALERT_COOLDOWN_DATE } 
        }).select('plate').lean(); 

        // Convertir la lista a un Set para búsquedas O(1)
        const platesWithActiveAlert = new Set(existingAlerts.map(alert => alert.plate));
        // =========================================================================

        // 2. Pipeline de Agregación OPTIMIZADO (Solo procesa los 100 más recientes)
        const services = await newService.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: LIMIT_RECORDS }, 
            {
                $lookup: {
                    from: 'vehicleservices', 
                    let: { current_plate: "$plate" }, 
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$plate", "$$current_plate"] }, 
                                        { $eq: ["$status", "Aceptado"] }, // Solo Aceptado
                                        { $gte: ["$createdAt", THIRTY_DAYS_AGO] } 
                                    ]
                                }
                            }
                        },
                        { $count: "visitCount" } 
                    ],
                    as: "frequentVisitorInfo" 
                }
            },
            { $addFields: { visitCount: { $ifNull: [{ $arrayElemAt: ["$frequentVisitorInfo.visitCount", 0] }, 0] } } },
            { $addFields: { isFrequentVisitor: { $gte: ["$visitCount", 3] } } },
            { $project: { frequentVisitorInfo: 0 } }
        ]);
        
        // 3. Persistencia de la Alerta (Crear el documento de Notificación)
        const alertsToCreate = [];
        for (const service of services) {
            const vehiclePlate = service.plate;
            
            if (service.isFrequentVisitor) {
                // VERIFICACIÓN CORREGIDA: Si ya existe una alerta (leída o no) creada en los últimos 30 días, NO creamos otra.
                if (!platesWithActiveAlert.has(vehiclePlate)) {
                    const message = `ALERTA: Placas ${vehiclePlate} visitó ${service.visitCount} veces en 30 días. Folio ${service.folio}.`;
                    
                    alertsToCreate.push({
                        plate: vehiclePlate,
                        message: message,
                        type: 'RECURRENCE_ALERT',
                        // Se inserta como no leída por defecto
                        isRead: false 
                    });

                    // Añadir al Set para prevenir duplicados DENTRO de esta misma ejecución
                    platesWithActiveAlert.add(vehiclePlate);
                }
            }
        }

        // Crear todas las nuevas alertas en una sola operación masiva, manejando duplicados
        if (alertsToCreate.length > 0) {
            try {
                // ordered: false permite que se inserten los documentos no duplicados
                await Notification.insertMany(alertsToCreate, { ordered: false }); 
            } catch (error) {
                // El código de error 11000 se maneja (debido al índice único parcial)
                if (error.code === 11000) {
                    console.log('Advertencia: Se detectó e ignoró un intento de alerta duplicada (concurrencia).');
                } else {
                    throw error; 
                }
            }
        }
        
        // 4. Devolver la respuesta
        res.status(200).json({message: 'Success', data: services});

    } catch (error) {
        console.error('Error en getRegistersService (Final):', error);
        res.status(500).json({Error: error.message});
    }
};

exports.getById = async (req, res) => {
    try{
        const register = await newService.findById(req.params.id);

        if(!register) {
            res.status(404).json({message: 'Registro no encontrado'});
        }

        res.status(200).json({message: 'Success', data: register});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

exports.createRequestService = async (req, res) => {
    try{
        const newRequestService = new newService(req.body);
        const savedRequestServices = await newRequestService.save();
        res.status(200).json({message: 'Success', data: savedRequestServices}) ;
    }catch (error){
        console.error('Error al guardar servicio: ', error);
        res.status(500).json({Error: error.message});
    }
}

exports.updateRequestService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Si el status cambia a Aceptado o Rechazado, registra la fecha
    if (['Aceptado', 'Rechazado'].includes(req.body.status)) {
      updateData.acceptanceDate = new Date();
    }

    // Si el status vuelve a Pendiente, borra la fecha
    if (req.body.status === 'Pendiente') {
      updateData.acceptanceDate = null;
    }

    const updatedService = await newService.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ message: 'Registro actualizado', data: updatedService });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateVehicleStatusByFolio = async (req, res) => {
    // 1. Obtener el folio de la URL
    const { folio } = req.params; 
    // 2. Obtener el nuevo estado del cuerpo (body)
    const { status } = req.body; 

    try {
        // Buscar el vehículo por el folio de la solicitud y actualizar su estado
        const vehicle = await newService.findOneAndUpdate(
            { folio: folio }, // Condición: folio debe coincidir
            { status: status }, 
            { new: true }
        );

        if (!vehicle) {
            return res.status(404).json({ message: "Registro de vehículo no encontrado para el folio proporcionado." });
        }

        res.json({ message: "Estado del vehículo actualizado correctamente.", vehicle });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor al actualizar el estado." });
    }
};

exports.finalizeVehicleService = async (req, res) => {
    try {
        const { id } = req.params; // ID del registro de servicio (no el folio)
        const { status, exit } = req.body; // Esperamos { status: 'Aceptado' o 'Finalizado', exit: { ... } }

        // 1. Validaciones básicas
        if (!status || !exit) {
            return res.status(400).json({ message: 'Faltan campos requeridos (status y datos de egreso).' });
        }

        // 2. Construcción del objeto de actualización
        const updateData = {
            status: status, // Actualiza el status principal a 'Aceptado' o 'Finalizado'
        };

        // Si el estado es aceptado, registra la fecha de aceptación (basado en tu lógica existente)
        if (status === 'Aceptado') {
            updateData.acceptanceDate = new Date();
        }

        // 3. Añadir el subdocumento 'exit'. Usamos $push si 'exit' es un array en el modelo 
        // (tu modelo lo define como un array: exit: [...])
        if (exit) {
            // $push añade un nuevo elemento al array 'exit'
            const updatedService = await newService.findByIdAndUpdate(
                id,
                { 
                    $set: updateData, // Actualiza status y acceptanceDate
                    $push: { exit: exit } // Añade el subdocumento de egreso completo
                },
                { 
                    new: true, 
                    runValidators: true 
                }
            );

            if (!updatedService) {
                return res.status(404).json({ message: 'Registro de servicio no encontrado.' });
            }

            return res.status(200).json({ message: 'Servicio finalizado y egreso registrado', data: updatedService });
        }
        
        return res.status(400).json({ message: 'Datos de egreso incompletos.' });

    } catch (error) {
        // Manejo detallado de errores de Mongoose (validación)
        if (error.name === 'ValidationError') {
             return res.status(400).json({ 
                message: 'Error de validación al finalizar el servicio.', 
                errorDetail: error.message 
            });
        }
        console.error('Error al finalizar servicio:', error);
        res.status(500).json({ error: error.message });
    }
};