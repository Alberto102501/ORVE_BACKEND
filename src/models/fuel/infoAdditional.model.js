const mongoose = require('mongoose');

// Esquema para el subdocumento de detalles de combustible
const fuelDetailsSchema = new mongoose.Schema({
    amount: {
        type: Number,
    },
    location: {
        type: String
    },
    observations: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    liters: {
        type: Number
    },
    manager: {
        type: String
    },
    month: {
        type: Number
    },
    year: {
        type: Number
    }
});

// Esquema principal para InfoAddFuel
const infoAddFuelSchema = new mongoose.Schema({
    numberCard: {
        type: String,
        required: true
    },
    fuelDetails: [fuelDetailsSchema],
});

module.exports = mongoose.model('InfoAddFuel', infoAddFuelSchema, 'InfoAddFuel');
