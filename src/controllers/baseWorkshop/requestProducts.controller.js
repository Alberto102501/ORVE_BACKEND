const newRequestProducts = require('../../models/baseWorkshop/requestProducts.model.js');

exports.getAllRequestProducts = async (req, res) => {
    try {
        const requestProducts = await newRequestProducts.find();
        res.status(200).json(requestProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving request products', error });
    }
};

exports.getAllRequestProductsByFolio = async (req, res) => {
    try {
        const { folio } = req.params;
        const requestProducts = await newRequestProducts.find({ folio }).sort({ createdAt: -1 }); // Ordenar por fecha descendente

        if (requestProducts.length === 0) {
            return res.status(404).json({ message: 'No se encontraron solicitudes de productos para este folio' });
        }
        
        res.status(200).json(requestProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar solicitudes por folio', error });
    }
};

// En requestProducts.controller.js
exports.createRequestProducts = async (req, res) => {
    try {
        const { folio, plate, brand, subBrand, model, products } = req.body;
        const requestProducts = new newRequestProducts({
            folio,
            plate,
            brand,
            subBrand,
            model,
            products,
        });
        await requestProducts.save();
        res.status(201).json(requestProducts);
    } catch (error) {
        // ✨ AÑADIR LÓGICA DE VALIDACIÓN MÓVIL (Mongoose Validation Error) ✨
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            // Devolvemos un código 400 (Bad Request) con el detalle exacto de la falla
            return res.status(400).json({ 
                message: 'Error de validación de Mongoose. Campos requeridos faltantes o inválidos: ' + messages.join('; ') 
            });
        }
        
        // Error genérico del servidor (500)
        res.status(500).json({ 
            message: 'Error creating request products', 
            error: error.message 
        });
    }   
};

exports.updateRequestProductsStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = req.body;

        const requestProducts = await newRequestProducts.findByIdAndUpdate(
            id,
            updateData, 
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!requestProducts) {
            return res.status(404).json({ message: 'El producto al que se quiere hacer el patch no fue encontrado' });
        }

        
        res.status(200).json(requestProducts);

    } catch (error) {
        res.status(500).json({ message: 'Error updating request products status', error });
    }
};