const WorkshopRequest = require('../../models/baseWorkshop/workshopRequest.model');

const VehicleService = require('../../models/baseWorkshop/vehicleService.model');

// Crear una nueva solicitud
exports.createRequest = async (req, res) => {
    try {
        const { folio, vehicle, user, assignment, phone, time, date, description, appointmentDate, appointmentTime} = req.body;

        // Validar que el folio no exista
        const existingRequest = await WorkshopRequest.findOne({ folio });
        if (existingRequest) {
            return res.status(409).json({ message: 'El folio de la solicitud ya existe.' });
        }

        const newRequest = new WorkshopRequest({
            folio,
            vehicle,
            user,
            assignment,
            phone,
            time,
            date,
            description,
            appointmentDate,
            appointmentTime
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la solicitud: ' + error.message });
    }
};

// Obtener todas las solicitudes
exports.getRequests = async (req, res) => {
    try {
        const requests = await WorkshopRequest.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las solicitudes: ' + error.message });
    }
};

// Obtener una solicitud por ID
exports.getRequestById = async (req, res) => {
    try {
        const request = await WorkshopRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la solicitud: ' + error.message });
    }
};

// Obtener una solicitud por folio
exports.getRequestByFolio = async (req, res) => {
    try {
        const request = await WorkshopRequest.findOne({ folio: req.params.folio });
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }
        res.status(200).json(request);
    } catch (error) { 
        res.status(500).json({ message: 'Error al obtener la solicitud: ' + error.message });
    }
}

// Actualizar una solicitud por ID
exports.updateRequest = async (req, res) => {
    try {
        const updatedRequest = await WorkshopRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la solicitud: ' + error.message });
    }
};

// Eliminar una solicitud por ID
exports.deleteRequest = async (req, res) => {
    try {
        const deletedRequest = await WorkshopRequest.findByIdAndDelete(req.params.id);
        if (!deletedRequest) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }
        res.status(200).json({ message: 'Solicitud eliminada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la solicitud: ' + error.message });
    }
};

exports.getRequestProductByPlate = async (req, res) => {
    try {
        const plate = req.params.plate;
        const selectedDate = req.query.date; // Recibido como YYYY-MM-DD

        if (!plate || !selectedDate) {
            return res.status(400).json({ message: 'Faltan datos: placa o fecha.' });
        }

        // Convertir la fecha YYYY-MM-DD a un rango de día completo en UTC
        const startOfDay = new Date(`${selectedDate}T00:00:00.000Z`);
        const endOfDay = new Date(`${selectedDate}T23:59:59.999Z`);


        const response = await WorkshopRequest.find({
            'vehicle.plates': plate,
            // Filtro estricto: la cita debe estar dentro de las 24 horas del día seleccionado
            appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        });

        // Si response.length > 0, significa que YA HAY una cita para esa placa ese día, y se debe bloquear.
        res.status(200).json({ message: 'success', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar la consulta', error: error.message });
    }
};

exports.getAvailableAppointmentsForToday = async (req, res) => {
    try {
        // Obtiene los componentes de la fecha actual
        const now = new Date(); 
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-11 (Ene=0, Nov=10)
        const day = now.getDate();

        // Construye "hoy" como medianoche UTC
        const today = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

        // Construye "mañana" como medianoche UTC del día siguiente
        const tomorrow = new Date(Date.UTC(year, month, day + 1, 0, 0, 0, 0));

        // --- 2. Pipeline de Agregación ---
        const availableAppointments = await WorkshopRequest.aggregate([
            {
                // Paso 1: Encuentra solo las citas de hoy
                $match: {
                    appointmentDate: {
                        $gte: today,
                        $lt: tomorrow
                    }
                }
            },
            {
                // Paso 2: Busca una coincidencia en la colección 'vehicleservices'
                $lookup: {
                    from: 'vehicleservices', // El nombre de la colección de registros
                    localField: 'folio',     // Campo de 'WorkshopRequest' (citas)
                    foreignField: 'folio',   // Campo de 'VehicleService' (registros)
                    as: 'registration'       // Guarda los resultados aquí (será un array)
                }
            },
            {
                // Paso 3: Filtra. Quédate SOLO con las citas
                // donde el array 'registration' esté VACÍO (tamaño 0).
                $match: {
                    registration: { $size:  0}
                }
            },
            {
                // (Opcional) Limpia el campo 'registration' para no enviarlo
                $project: {
                    registration: 0
                }
            }
        ]);

        //console.log('Citas disponibles:', availableAppointments);

        // 3. Devuelve la lista ya filtrada
        res.status(200).json(availableAppointments);

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener citas disponibles: ' + error.message });
    }
};