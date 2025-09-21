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

            // Obtener el año actual
            const currentYear = new Date().getFullYear();

            // Contar todos los vehículos registrados (sin importar el año)
            const totalVehicles = await Vehicle.countDocuments();

            // Generar número consecutivo con formato 3 dígitos
            const ecoNumber = String(totalVehicles + 1).padStart(4, '0');

            // Formato final: "001/2025"
            const shortYear = String(currentYear).slice(-2); // "2025" → "25"
            const numEco = `${ecoNumber}/${shortYear}`;

            // Procesar rutas de imágenes
            const imagePaths = req.files?.map(file => file.path) || [];

            const newVehicle = new Vehicle({
            ...req.body,
            numEco,
            images: imagePaths
            });
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
    const { series, existingImages } = req.body;

    // Validación del número de serie
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!vinRegex.test(series)) {
      return res.status(400).json({ message: 'Número de serie inválido.' });
    }

    // Verificar duplicado
    const duplicate = await Vehicle.findOne({
      series,
      _id: { $ne: req.params.id }
    });

    if (duplicate) {
      return res.status(409).json({ message: 'Este número de serie ya está registrado.' });
    }

    // Obtener vehículo actual
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehículo no encontrado.' });
    }

    // Procesar imágenes existentes que el usuario decidió conservar
    const preservedImages = Array.isArray(existingImages)
      ? existingImages
      : existingImages
        ? [existingImages]
        : [];

    // Procesar nuevas imágenes cargadas
    const newImagePaths = req.files?.map(file => file.path) || [];

    // Combinar y limitar a máximo 6
    const updatedImages = [...preservedImages, ...newImagePaths].slice(0, 6);

    // Construir objeto actualizado
    const updatedData = {
      ...req.body,
      images: updatedImages
    };

    // Actualizar en la base de datos
    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar parcialmente un vehículo por ID
exports.patchVehicle = async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.status(200).json(updatedVehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
