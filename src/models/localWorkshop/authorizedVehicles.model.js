const mongoose = require('mongoose');

const authorizedVehiclesShema = new mongoose.Schema({
    numEco: {
        type: String,
        unique: true
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
    plates: {
        type: String,
        required: true
    }
}, {
  timestamps: true 
})

module.exports = mongoose.model('authorizedVehicles', authorizedVehiclesShema, 'authorizedVehicles');