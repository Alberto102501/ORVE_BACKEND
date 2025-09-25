const particularVehicle = require('../../models/parking/particularVehicles.model');

exports.getParticularVehicle = async (req, res) => {
    try {
        const vehicles = await particularVehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener vehículos particulares', error });
    }

}

exports.createParticularVehicle = async (req, res) => {
    try {
        const newVehicle = new particularVehicle(req.body);
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar vehículo particular', error });
    }

}

exports.updateParticularVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVehicle = await particularVehicle.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
        });

        if (!updatedVehicle) {
        return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        res.status(200).json(updatedVehicle);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar vehículo particular', error });
    }
}