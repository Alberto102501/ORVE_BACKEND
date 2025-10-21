const inventoryTire = require('../../models/servicesAndTires/inventoryTires.model');

exports.getInventory = async (req, res) => {
    try {
        const inventory = await inventoryTire.find();
        res.status(200).json(inventory);
    } catch (error) {
        return res.status(500).json({message : "GET : Error en el servidor"});
    }
};

exports.addInventoryTire = async (req, res) => {
    try {
        const { typeVehicle, rin, measure, quantity, requisition } = req.body;
        const newInventoryTire = new inventoryTire({
            typeVehicle,
            rin,
            measure,
            quantity,
            requisition
        });
        const savedInventoryTire = await newInventoryTire.save();
        res.status(201).json(savedInventoryTire);
    } catch (error) {
        return res.status(500).json({message : "POST : Error en el servidor"});
    }
};

exports.updateInventoryTire = async (req, res) => {
    try {
        const tire = await inventoryTire.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!tire) return res.status(404).json({ message: "No encontrado" });
        res.json(tire);
    } catch (error) {
        return res.status(404).json({ message: "PUT : Error en el servidor" });
    }
}

exports.deleteInventoryTire = async (req, res) => {
    try {
        const tire = await inventoryTire.findByIdAndDelete(req.params.id);
        if(!tire) return res.status(404).json({message : "No encontrado"});
        return res.sendStatus(204);
    } catch (error) {
        return res.status(404).json({ message: "DELETE : Error en el servidor" });
    }
}