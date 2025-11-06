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
            process,
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
            process,
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

const updateInventoryQuantity = async (req, res) => {
    try {
        // El payload debe ser un array de objetos: 
        // [{ inventoryId: '...', quantityToDeduct: N }, ...]
        const productsToUpdate = req.body;

        if (!Array.isArray(productsToUpdate) || productsToUpdate.length === 0) {
            return res.status(400).json({ message: "Payload inválido. Se espera un array de productos para descontar." });
        }

        const updatePromises = productsToUpdate.map(async (product) => {
            const { inventoryId, quantityToDeduct } = product;
            
            // Usamos $inc para decrementar el campo 'quantity'
            // El valor a incrementar debe ser negativo para descontar
            const updatedItem = await AutoPartsInventory.findByIdAndUpdate(
                inventoryId,
                { $inc: { quantity: -quantityToDeduct } },
                { new: true, runValidators: true }
            );

            if (!updatedItem) {
                // Si el item no se encuentra, devolvemos un error en la lista de promesas
                return { inventoryId, success: false, message: "Item de inventario no encontrado." };
            }
            // Aquí puedes agregar lógica de stock bajo si es necesario (e.g., if (updatedItem.quantity < 0))

            return { inventoryId, success: true, newQuantity: updatedItem.quantity };
        });

        // Esperar a que todas las promesas de actualización terminen
        const results = await Promise.all(updatePromises);
        
        // Revisar si hubo fallos en alguna actualización individual
        const failedUpdates = results.filter(r => !r.success);

        if (failedUpdates.length > 0) {
            // Devolver un 202 (Accepted) con advertencias si algunas fallaron, o un 400 si son críticas
            return res.status(400).json({ 
                message: "Algunos artículos no pudieron ser actualizados (revisar stock o ID).", 
                results,
                failedUpdates
            });
        }

        res.status(200).json({ message: "Inventario actualizado correctamente.", results });

    } catch (error) {
        // Mongoose validation or internal error
        return res.status(500).json({ message: "Error interno al actualizar el inventario.", error: error.message });
    }
};

module.exports = {
    getInventory,
    createInventoryItem,
    getInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateInventoryQuantity
};
