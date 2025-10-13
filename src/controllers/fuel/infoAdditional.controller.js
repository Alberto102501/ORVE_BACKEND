const InfoAddFuel = require('../../models/fuel/infoAdditional.model');

exports.getInfos = async (req, res) => {
    try {
        const info = await InfoAddFuel.find();
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la información adicional de combustible', error: error.message });
    }
};

exports.getInfoByCardNumber = async (req, res) => {
    try {
        const { numberCard } = req.params;
        const info = await InfoAddFuel.findOne({ numberCard: numberCard });
        if (!info) {
            return res.status(404).json({ message: 'No se encontró información para el número de tarjeta proporcionado.' });
        }
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la información adicional de combustible', error: error.message });
    }
};

exports.postInfo = async (req, res) => {
    try {
        const { numberCard, fuelDetails } = req.body;
        const newInfo = new InfoAddFuel({
            numberCard,
            fuelDetails
        });
        await newInfo.save();
        res.status(201).json({ message: 'Información adicional de combustible creada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la información adicional de combustible', error: error.message });
    }
};

exports.putInfoByCardNumber = async (req, res) => {
    try {
        const { numberCard } = req.params;
        const { fuelDetails } = req.body; // Se espera un único objeto de subdocumento

        if (!fuelDetails || typeof fuelDetails.month === 'undefined' || typeof fuelDetails.year === 'undefined') {
            return res.status(400).json({ message: 'El subdocumento fuelDetails debe contener month y year.' });
        }

        // Primero, intentar actualizar un subdocumento existente que coincida en mes y año
        let updatedInfo = await InfoAddFuel.findOneAndUpdate(
            { 
                numberCard: numberCard, 
                "fuelDetails.month": fuelDetails.month,
                "fuelDetails.year": fuelDetails.year
            },
            { 
                $set: { "fuelDetails.$": fuelDetails } // Actualizar el subdocumento coincidente
            },
            { new: true }
        );

        // Si no se encontró y actualizó ningún subdocumento, agregar uno nuevo
        if (!updatedInfo) {
            updatedInfo = await InfoAddFuel.findOneAndUpdate(
                { numberCard: numberCard },
                { $push: { fuelDetails: fuelDetails } }, // Agregar el nuevo subdocumento
                { new: true }
            );
        }

        // Si aún no se encontró el documento, el numberCard es inválido
        if (!updatedInfo) {
            return res.status(404).json({ message: 'No se encontró ningún registro con el número de tarjeta proporcionado.' });
        }

        res.json({ message: 'Información de combustible actualizada/añadida exitosamente', data: updatedInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la información de combustible', error: error.message });
    }
};
