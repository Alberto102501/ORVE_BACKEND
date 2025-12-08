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

exports.checkUniqueness = async (req, res) => {
    try {
        const { plates } = req.query; 

        // Inicializamos el estado de duplicidad de la placa
        let platesDuplicate = false;
        
        // 1. Verificar Placa (Solo si el valor de plates está presente)
        if (plates) {
            // Se recomienda usar la búsqueda insensible a mayúsculas ($regex: /plates/i)
            // para evitar problemas de case-sensitivity, si tu base de datos lo requiere.
            const vehicleWithPlate = await particularVehicle.findOne({ vehiclePlates: plates });
            
            if (vehicleWithPlate) {
                platesDuplicate = true;
            }
        }
        
        // Determinar el duplicado general (que es lo mismo que platesDuplicate)
        const isDuplicate = platesDuplicate;

        res.status(200).json({
            isDuplicate: isDuplicate, 
            platesDuplicate: platesDuplicate
        });

    } catch (error) {
        console.error('Error interno del servidor al verificar unicidad:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};