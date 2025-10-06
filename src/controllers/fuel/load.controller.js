const newLoad = require('../../models/fuel/load.model');

exports.createLoad = async(req, res) => {
    try {
        const payload = Array.isArray(req.body) ? req.body : [req.body];
        const savedLoad = await newLoad.insertMany(payload);
        res.status(201).json({message: 'Carga creada exitosamente', data: savedLoad});
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getLoads = async (req, res) => {
    try {
        const loads = await newLoad.find();
        res.json(loads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};