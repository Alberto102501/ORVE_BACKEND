const InfoAddFuel = require('../../models/fuel/infoAdditional.model');
const Receipts = require('../../models/receipt.model');
const ParticularVehicle = require('../../models/parking/particularVehicles.model');
const Load = require('../../models/fuel/load.model');


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
        const { numberCard, fuelDetails } = req.body;
        const newInfo = new InfoAddFuel({
            numberCard,
            fuelDetails
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
        const { fuelDetails } = req.body; // Se espera un único objeto de subdocumento

        if (!fuelDetails || typeof fuelDetails.month === 'undefined' || typeof fuelDetails.year === 'undefined') {
            return res.status(400).json({ message: 'El subdocumento fuelDetails debe contener month y year.' });
        }

        // Primero, intentar actualizar un subdocumento existente que coincida en mes y año
        let updatedInfo = await InfoAddFuel.findOneAndUpdate(
            { 
                numberCard: numberCard, 
                "fuelDetails.month": fuelDetails.month,
                "fuelDetails.year": fuelDetails.year
            },
            { 
                $set: { "fuelDetails.$": fuelDetails } // Actualizar el subdocumento coincidente
            },
            { new: true }
        );

        // Si no se encontró y actualizó ningún subdocumento, agregar uno nuevo
        if (!updatedInfo) {
            updatedInfo = await InfoAddFuel.findOneAndUpdate(
                { numberCard: numberCard },
                { $push: { fuelDetails: fuelDetails } }, // Agregar el nuevo subdocumento
                { new: true }
            );
        }

        // Si aún no se encontró el documento, el numberCard es inválido
        if (!updatedInfo) {
            return res.status(404).json({ message: 'No se encontró ningún registro con el número de tarjeta proporcionado.' });
        }

        res.json({ message: 'Información de combustible actualizada/añadida exitosamente', data: updatedInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la información de combustible', error: error.message });
    }
};

exports.getProcessedFuelInfo = async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({ message: 'El año y el mes son requeridos.' });
        }

        // --- 1. CONSTRUIR LISTA MAESTRA DE VEHÍCULOS ---
        // Obtener datos de 'receipts' (VehicleService)
        const receipts = await Receipts.find().lean();

        // Obtener datos de 'parking'
        const parking = await ParticularVehicle.find().lean();

        // Mapear y combinar ambas fuentes en una sola lista
        const allVehicles = [
            ...receipts.map(item => ({
                id: item.vehicle?.numberCard,
                type: item.type,
                plates: item.vehicle?.plates,
                brand: item.vehicle?.brand,
                sub_brand: item.vehicle?.subBrand,
                model: item.vehicle?.model,
                series: item.vehicle?.series,
                user_name: item.user?.name,
            })),
            ...parking.map(item => ({
                id: item.numberCard,
                type: 'Particular',
                plates: item.vehiclePlates,
                brand: item.vehicleBrand,
                sub_brand: item.vehicleSubBrand,
                model: item.vehicleModel,
                series: item.vehicleSeries,
                user_name: item.completeName || '',
            }))
        ];

        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);

        // --- 2. OBTENER Y AGRUPAR TODAS LAS TRANSACCIONES DEL MES ---
        // Se consultan directamente las transacciones ('loads') y se agrupan por vehículo.
        const transactionData = await Load.aggregate([
            {
                // Paso 1: Filtrar solo las transacciones del mes y año solicitados
                $match: {
                    year: yearNum,
                    month: monthNum
                }
            },
            {
                // Paso 2: Agrupar por 'cardOrTag' (ID del vehículo)
                $group: {
                    _id: '$cardOrTag', // Agrupar por el ID del vehículo
                    transactions: { $push: '$$ROOT' }, // Crear un array con todas las transacciones del grupo
                    liters_per_month: { $sum: '$liters' }, // Sumar los litros
                    total_price: { $sum: { $multiply: ['$price', '$liters'] } } // Sumar el precio total
                }
            }
        ]);

        // Crear un Map con los datos de transacciones para búsqueda O(1)
        const transactionMap = new Map(transactionData.map(item => [item._id, item]));

        // --- 3. OBTENER INFORMACIÓN ADICIONAL (fuelDetails) ---
        const fuelInfoDetails = await InfoAddFuel.find().lean();
        // Crear un Map con los detalles para búsqueda O(1)
        const fuelDetailsMap = new Map(fuelInfoDetails.map(item => [item.numberCard, item.fuelDetails]));

        // --- 4. ITERAR SOBRE LA LISTA MAESTRA Y COMBINAR TODO ---
        const processedData = allVehicles.map(vehicle => {
            // Obtener datos de transacciones del Map
            const vehicleTransactions = transactionMap.get(vehicle.id);
            // Obtener detalles de combustible del otro Map
            const fuelDetails = fuelDetailsMap.get(vehicle.id) || [];

            // Calcular valores basados en las transacciones (si existen)
            const liters_per_month = vehicleTransactions?.liters_per_month || 0;
            const total_price = vehicleTransactions?.total_price || 0;
            const cost_per_liter = liters_per_month > 0 ? (total_price / liters_per_month) : 0;
            const transactions = vehicleTransactions?.transactions || [];

            const uniqueFuelTypes = [...new Set(transactions.map(tx => tx.product))];
            const fuel_type = uniqueFuelTypes.length === 1 ? uniqueFuelTypes[0] : uniqueFuelTypes.length > 1 ? 'Mixto' : '';

            // Lógica para encontrar los detalles del mes actual o el anterior
            if (fuelDetails.length > 0) {
                let fuelDetailsForMonth = fuelDetails.find(detail => detail.year === yearNum && detail.month === monthNum);
                if (!fuelDetailsForMonth && fuelDetails.length > 0) {
                    const previousDetails = fuelDetails
                        .filter(detail => (detail.year * 100 + detail.month) < (yearNum * 100 + monthNum))
                        .sort((a, b) => (b.year * 100 + b.month) - (a.year * 100 + a.month));
                    if (previousDetails.length > 0) {
                        fuelDetailsForMonth = previousDetails[0];
                    }
                }

                //if(transactions.length === 0) return;
                // Devolver el objeto combinado con datos de transacciones y detalles
                return {
                    ...vehicle,
                    liters_per_month: liters_per_month.toFixed(2),
                    cost_per_liter: cost_per_liter.toFixed(2),
                    transactions: transactions,
                    fuel_type,
                    liters: fuelDetailsForMonth?.liters || '0.0', // Este 'liters' es el de la dispersión
                    dispersion_amount: fuelDetailsForMonth?.amount || '0.0',
                    location: fuelDetailsForMonth?.location || '',
                    observations: fuelDetailsForMonth?.observations || '',
                    status: fuelDetailsForMonth?.status !== undefined ? fuelDetailsForMonth.status : true,
                    manager: fuelDetailsForMonth?.manager || '',
                    hasFuelInfo: true, // Tiene entrada en InfoAddFuel
                    hasFuelDetailsForMonth: !!fuelDetailsForMonth,
                };
            }

            // --- CASO: El vehículo NO tiene entrada en InfoAddFuel ---
            // Aún así, devolvemos sus datos de transacciones calculados.
            //if(transactions.length === 0) return;
            return {
                ...vehicle,
                liters_per_month: liters_per_month.toFixed(2),
                cost_per_liter: cost_per_liter.toFixed(2),
                transactions: transactions,
                fuel_type: fuel_type,
                liters: '0.0',
                dispersion_amount: '0.0',
                location: '',
                observations: '',
                status: true,
                manager: '',
                hasFuelInfo: false, // No tiene entrada en InfoAddFuel
                hasFuelDetailsForMonth: false,
            };
        });

        res.status(200).json(processedData);

    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la información de combustible', error: error.message });
    }
};