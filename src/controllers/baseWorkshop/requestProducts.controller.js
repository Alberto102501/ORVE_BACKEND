const newRequestProducts = require('../../models/baseWorkshop/requestProducts.model.js');

exports.getAllRequestProducts = async (req, res) => {
    try {
        const requestProducts = await newRequestProducts.find();
        res.status(200).json(requestProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving request products', error });
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
        res.status(500).json({ message: 'Error creating request products', error });
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