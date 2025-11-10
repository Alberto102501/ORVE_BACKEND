const WorkshopRequest = require('../../models/baseWorkshop/workshopRequest.model');

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