const mongoose = require('mongoose');

const particularVehicleSchema = new mongoose.Schema({
    numEmployed: {
        type: String
    },
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
    }
});

module.exports = mongoose.model('ParticularVehicle', particularVehicleSchema);