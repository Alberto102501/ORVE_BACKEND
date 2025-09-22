const Receipt = require('../models/receipt.model.js');

exports.createReceipt = async (req, res) => {
    try {
        const newReceipt = new Receipt(req.body);
        const savedReceipt = await newReceipt.save();
        res.status(201).json(savedReceipt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteReceipt = async (req, res) => {
    try {
        const deletedReceipt = await Receipt.findByIdAndDelete(req.params.id);
        if (!deletedReceipt) {
            return res.status(404).json({ message: 'Resguardo no encontrado (delete)' });
        }
        res.status(200).json({ message: 'Resguardo borrado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.patchReceipt = async (req, res) => {
    try {
        const updatedReceipt = await Receipt.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updatedReceipt) {
            return res.status(404).json({ message: 'Resguardo no encontrado (patch)' });
        }
        res.status(200).json(updatedReceipt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getReceipts = async (req, res) => {
    try {
        const receipts = await Receipt.find();
        res.status(200).json(receipts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReceiptById = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id);
        if (!receipt) {
            return res.status(404).json({ message: 'Resguardo no encontrado (get)' });
        }
        res.status(200).json(receipt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateReceipt = async (req, res) => {
    try {
        const updatedReceipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReceipt) {
            return res.status(404).json({ message: 'Resguardo no encontrado (update)' });
        }
        res.status(200).json(updatedReceipt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
