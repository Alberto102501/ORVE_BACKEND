const mongoose = require('mongoose');

const particularVehicleSchema = new mongoose.Schema({
    completeName: {
        type: String
    },
    department: {
        type: String
    },
    numberPhone: {
        type: String
    },
    vehicleBrand: {
        type: String
    },
    vehicleSubBrand: {
        type: String
    },
    vehicleType: {
        type: String
    },
    vehicleColor: {
        type: String
    },
    vehiclePlates: {
        type: String
    },
    type: {
        type: String
    },
    parking: {
        type: Boolean,
        default: false
    }
}, {
  timestamps: true
});

module.exports = mongoose.model('ParticularVehicle', particularVehicleSchema);