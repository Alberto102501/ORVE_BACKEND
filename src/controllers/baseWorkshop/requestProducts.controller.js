const mongoose = require('mongoose');
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

        // if (requestProducts.length === 0) {
        //     return res.status(404).json({ message: 'No se encontraron solicitudes de productos para este folio' });
        // }
        
        res.status(200).json(requestProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar solicitudes por folio', error });
    }
};

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
        // AÑADIR LÓGICA DE VALIDACIÓN MÓVIL (Mongoose Validation Error) 
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
    const { id } = req.params;
    const updateData = req.body; 

    try {
        // 1. CONVERSIÓN DE IDs (si approvedProducts existe)
        if (updateData.approvedProducts && updateData.approvedProducts.length > 0) {
            updateData.approvedProducts.forEach(product => {
                // Validación estricta del formato de ObjectId antes de la conversión
                if (typeof product.inventoryId === 'string' && !mongoose.Types.ObjectId.isValid(product.inventoryId)) {
                     // Si el formato es INCORRECTO, lanzamos un error de validación (CastError)
                     throw new Error(`El ID de inventario '${product.inventoryId}' tiene un formato inválido.`);
                }
                
                // Conversión segura (si es una cadena válida)
                if (typeof product.inventoryId === 'string') {
                    product.inventoryId = new mongoose.Types.ObjectId(product.inventoryId);
                }
            });
        }
        
        // 2. OPERACIÓN DE ACTUALIZACIÓN SEGURA con $set
        const requestProducts = await newRequestProducts.findByIdAndUpdate(
            id,
            { $set: updateData }, // Usa $set explícitamente
            { 
                new: true, 
                runValidators: true // Esto dispara la validación del esquema (la causa del 400)
            }
        );

        if (!requestProducts) {
            return res.status(404).json({ message: 'La solicitud de producto no fue encontrada' });
        }
        
        res.status(200).json(requestProducts);

    } catch (error) {
        // 3. CAPTURA Y REPORTE DE ERRORES DE VALIDACIÓN (400)
        
        // Error de validación de Mongoose o CastError (incluye el error de formato que lanzamos arriba)
        if (error.name === 'ValidationError' || error.name === 'CastError' || error.message.includes('formato inválido')) {
             return res.status(400).json({ 
                message: 'Fallo de validación de datos. Revise los campos: ' + error.message, 
                errorDetail: error 
            });
        }
        
        // Error interno genérico (500)
        console.error('Error interno del servidor:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor al actualizar la solicitud', 
            error: error.message 
        });
    }
};