const Parking = require('../../models/parking/parking.model.js');

exports.getParkings = async (req, res) => {
    try {
        const parkings = await Parking.find();
        res.json(parkings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getParking = async (req, res) => {
    const { id } = req.params;
    try {
        const parking = await Parking.findById(id);
        if (!parking) {
            return res.status(404).json({ message: 'Parking spot not found' });
        }
        res.json(parking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getParkingsOfMotorcycle = async (req, res) => {
    try {
        const parkings = await Parking.find({ isMotorcycle: true });
        res.json(parkings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateParking = async (req, res) => {
    const { id } = req.params;
    const { info, tag, status } = req.body;

    console.log(req.body);

    const updateFields = {};
    if (info) updateFields.info = info;
    if (tag) updateFields.tag = tag;
    if (status) updateFields.status = status;

    try {
        const updatedParking = await Parking.findOneAndUpdate(
            { _id: id },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedParking) {
            return res.status(404).json({ message: 'Error si' });
        }

        res.json(updatedParking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateParkingByReceipt = async (req, res) => {
    const { id } = req.params;

    console.log(req.body);

    const updateFields = {};
    updateFields.status = "Disponible";
    updateFields.info = {};

    try {
        const updatedParking = await Parking.findOneAndUpdate(
            { "info.parkId": id },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedParking) {
            return res.status(200).json({ message: 'No tiene Parking' });
        }

        res.json(updatedParking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
