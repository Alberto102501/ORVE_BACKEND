const Vehicle = require('../../models/localWorkshop/authorizedVehicles.model');

exports.getAuthorizedVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener vehículos autorizados', error });
    }
}

exports.getAuthorizedVehicleByPlate = async (req, res) => {
    try {
        const plates = req.params.plates?.trim();

        if (!plates) {
            return res.status(400).json('Error al buscar la placa.');
        }

        const response = await Vehicle.findOne({ plates: new RegExp(`^${plates}$`, 'i') });

        // if (!response) {
        //     return res.status(404).json({ error: 'Vehículo no encontrado' });
        // }

        res.status(200).json({ message: 'success', data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createAuthorizedVehicle = async (req, res) => {
    try {
        const newVehicle = new Vehicle(req.body);
        const isVehicle = await Vehicle.findOne({ series: req.body.series });
        if (isVehicle) {
            return res.status(409).json({ message: 'El vehículo ya se encuentra registrado' });
        }
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar vehículo autorizado', error });
    }
}

exports.updateAuthorizedVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        res.status(200).json(updatedVehicle);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar vehículo autorizado', error });
    }
}

exports.deleteAuthorizedVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVehicle = await Vehicle.findByIdAndDelete(id);

        if (!deletedVehicle) {
            res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        res.status(200).json({ message: 'Vehículo eliminado' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar vehículo autorizado', error });
    }
}