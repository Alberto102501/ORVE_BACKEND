const newLoad = require('../../models/fuel/load.model');

exports.createLoad = async(req, res) => {
    const fieldMap = {
        "Tipo producto": "productType",
        "Cuenta": "account",
        "Tarjeta/Tag": "cardOrTag",
        "Placa": "licensePlate",
        "Fecha": "date",
        "ID": "transactionId",
        "Cargo": "debit",
        "Abono": "credit",
        "Saldo": "balance",
        "Tipo": "transactionType",
        "Usuario": "user",
        "Expediente": "caseFile",
        "Concepto": "concept",
        "Producto": "product",
        "Precio": "price",
        "Km INI": "kmStart",
        "Km FIN": "kmEnd",
        "Litros": "liters",
        "Rendimiento": "efficiency",
        "IVA": "iva",
        "Estación": "station",
        "Estación RFC": "stationRFC",
        "Estado": "state",
        "Ciudad": "city",
        "Colonia": "neighborhood",
        "Domicilio": "address",
        "Año": "year",
        "Mes": "month",
        "Dia": "day",
        "Hora": "hour"
    };

    try {
        const payload = Array.isArray(req.body) ? req.body : [req.body];
        const transformData = (rawData) => {
            return rawData.map((row) => {
                const transformed = {};
                for (const key in row) {
                const mappedKey = fieldMap[key];
                if (mappedKey) {
                    transformed[mappedKey] = row[key];
                }
                }
                return transformed;
            });
        };
        const transformedPayload = transformData(payload);
        const savedLoad = await newLoad.insertMany(transformedPayload);
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