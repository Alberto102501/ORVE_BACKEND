const Vehicle = require('../models/vehicle.model');

// Crear nuevo vehículo
exports.createVehicle = async (req, res) => {
    try {
        // Validación del número de serie
        const regexVIN = /[A-HJ-NPR-Z0-9]{17}$/;
        if(regexVIN.test(req.body.series)){
            // Verificar si ya existe un vehículo con el mismo número de serie
            const existingVehicle = await Vehicle.findOne({ series: req.body.series });
            if (existingVehicle) {
                return res.status(409).json({ message: 'El número de serie ya existe' });
            }

            const newVehicle = new Vehicle(req.body);
            await newVehicle.save();
            res.status(201).json(newVehicle);
        }else{
            res.status(400).json({ message: 'El número de serie no es válido. Debe tener 17 caracteres y no contener las letras I, O o Q.' });
        }
    } catch (error) {
        // Errores
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todos los vehículos
exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un vehículo por ID
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un vehículo por ID
exports.updateVehicle = async (req, res) => {
    try {
        const regexVIN = /[A-HJ-NPR-Z0-9]{17}$/;
        if(regexVIN.test(req.body.series)){
            //validar que el numero de serie no se repita
            const existingVehicle = await Vehicle.findOne({ series: req.body.series, _id: { $ne: req.params.id } });
            if (existingVehicle) {
                return res.status(409).json({ message: 'El número de serie ya existe' });
            }
            const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedVehicle) {
                return res.status(404).json({ message: 'Vehículo no encontrado' });
            }
            res.status(200).json(updatedVehicle);
        }else{
            return res.status(400).json({ message: 'El número de serie no es válido. Debe tener 17 caracteres y no contener las letras I, O o Q.' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
