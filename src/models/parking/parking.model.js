const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    info: {
        type: Object,
        default: {}
    },
    tag: {
        type: String,
        trim: true,
        default: ""
    },
    status: {
        type: String,
        trim: true,
        default: "Disponible"
    },
    isMotorcycle: {
        type: Boolean
    }
}, {
    timestamps: false
});

module.exports = mongoose.model("parkingBox", parkingSchema, "parkingBox");
