const mongoose = require('mongoose');

function arrayLimit(val) {
    return val.length <= 6;
}

const VehicleSchema = new mongoose.Schema({
    numEco: {
        type: String,
    },
    status: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    subBrand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    series: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    rh: {
        type: String
    },
    plates: {
        type: String,
        required: true
    },
    numberCard: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    annotations: {
        type: String
    },
    accessories: {
        type: Array
    },
    category: {
        type: String,
        required: true
    },
    images: {
        type: [String], // ahora acepta múltiples rutas
        validate: [arrayLimit, '{PATH} excede el límite de 6 imágenes']
    }

    

}, {
  timestamps: true
});


module.exports = mongoose.model('vehicles', VehicleSchema, 'vehicles');
