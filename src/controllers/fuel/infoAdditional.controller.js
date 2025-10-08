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
        const { numberCard, amount, location, observations, status } = req.body;
        const newInfo = new InfoAddFuel({
            numberCard,
            amount,
            location,
            observations,
            status
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
        const { amount, location, observations, status} = req.body;
        
        const updatedInfo = await InfoAddFuel.findOneAndUpdate(
            { numberCard: numberCard }, 
            {
                amount,
                location,
                observations,
                status
            }, 
            { new: true }
        );

        if (!updatedInfo) {
            return res.status(404).json({ message: 'No se encontró ningún registro con el número de tarjeta proporcionado para actualizar.' });
        }

        res.json({ message: 'Información adicional de combustible actualizada exitosamente', data: updatedInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la información adicional de combustible', error: error.message });
    }
};
