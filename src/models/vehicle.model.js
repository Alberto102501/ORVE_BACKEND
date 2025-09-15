const mongoose = require('mongoose');

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
    rfv: {
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
    }
}, {
  timestamps: true
});

module.exports = mongoose.model('vehicles', VehicleSchema, 'vehicles');
