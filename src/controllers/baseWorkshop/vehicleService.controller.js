const newService = require('../../models/baseWorkshop/vehicleService.model');

const mongoose = require('mongoose'); // NECESARIO para usar la función $match

exports.getRegistersService = async (req, res) => {
    try {
        // 1. Definir la fecha de hace 30 días
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); 
        
        // 2. Pipeline de Agregación
        const services = await newService.aggregate([
            // Primera Etapa: Realizar el conteo de visitas recientes (por placa)
            {
                $lookup: {
                    from: 'vehicleservices', // Nombre de la colección en MongoDB (Mongoose le añade 's')
                    let: { current_plate: "$plate" }, // Variable para la placa del servicio actual
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$plate", "$$current_plate"] }, // Que coincida la placa
                                        { $in: ["$status", ["Aceptado", "En reparación"]] }, // Que el estado sea de visita
                                        { $gte: ["$createdAt", thirtyDaysAgo] } // Que esté en los últimos 30 días
                                    ]
                                }
                            }
                        },
                        { $count: "visitCount" } // Contar los documentos que cumplen el match
                    ],
                    as: "frequentVisitorInfo" // El resultado del pipeline se guarda aquí
                }
            },
            
            // Segunda Etapa: Añadir las nuevas propiedades al objeto principal
            {
                $addFields: {
                    // visitCount: Extraer el valor del conteo (si está vacío es 0)
                    visitCount: { 
                        $ifNull: [{ $arrayElemAt: ["$frequentVisitorInfo.visitCount", 0] }, 0] 
                    },
                }
            },

            // Tercera Etapa: Calcular la propiedad booleana
            {
                $addFields: {
                    // isFrequentVisitor: True si el conteo es 3 o más
                    isFrequentVisitor: { $gte: ["$visitCount", 3] }
                }
            },

            // Cuarta Etapa: Ordenar (igual que antes)
            { $sort: { createdAt: -1 } },

            // Quinta Etapa (Opcional): Limpiar el campo temporal y reformatear el objeto
            {
                $project: {
                    frequentVisitorInfo: 0, // Eliminar el campo temporal
                }
            }
        ]);
        
        // 3. Devolver la respuesta (la respuesta de aggregate ya es un array)
        res.status(200).json({message: 'Success', data: services});

    } catch (error) {
        // Asegúrate de que Mongoose esté importado si tienes errores con $match
        console.error('Error en getRegistersService (Aggregation):', error);
        res.status(500).json({Error: error.message});
    }
}

exports.getById = async (req, res) => {
    try {
        const register = await newService.findById(req.params.id);

        if (!register) {
            res.status(404).json({ message: 'Registro no encontrado' });
        }

        res.status(200).json({ message: 'Success', data: register });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createRequestService = async (req, res) => {
    try {
        const newRequestService = new newService(req.body);
        const savedRequestServices = await newRequestService.save();
        res.status(200).json({ message: 'Success', data: savedRequestServices });
    } catch (error) {
        console.error('Error al guardar servicio: ', error);
        res.status(500).json({ Error: error.message });
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