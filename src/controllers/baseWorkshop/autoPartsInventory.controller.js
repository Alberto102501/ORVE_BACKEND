const AutoPartsInventory = require('../../models/baseWorkshop/autoPartsInventory.model.js');

const getInventory = async (req, res) => {
    try {
        const inventory = await AutoPartsInventory.find();
        res.json(inventory);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const createInventoryItem = async (req, res) => {
    try {
        const {
            orderNumber,
            plate,
            vehicleDetails,
            ur,
            category,
            quantity,
            um,
            description,
            partBrand
        } = req.body;

        const newInventoryItem = new AutoPartsInventory({
            orderNumber,
            plate,
            vehicleDetails,
            ur,
            category,
            quantity,
            um,
            description,
            partBrand
        });

        const savedItem = await newInventoryItem.save();
        res.json(savedItem);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const getInventoryItem = async (req, res) => {
    try {
        const item = await AutoPartsInventory.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const updateInventoryItem = async (req, res) => {
    try {
        const item = await AutoPartsInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const deleteInventoryItem = async (req, res) => {
    try {
        const item = await AutoPartsInventory.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    getInventory,
    createInventoryItem,
    getInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
};
