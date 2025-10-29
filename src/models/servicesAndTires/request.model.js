const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    folio:{
        type: String,
        required: true,
        unique: true
    },
    vehicle: {
        type: Object,
        required: true,
    },
    user: {
        type: String
    },
    assignment: {
        type: String
    },
    serviceType: {
        type: String,
    },
    priority: {
        type: String,
    },
    time: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    mileage: {
        type: Number,
    },
    status: {
        type: String
    },
    tire :{
        type: Object
    },
    type: {
        type: String
    },
    items: [
        {
            quantity: {
                type: Number
            },
            description: {
                type: String
            },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Request", requestSchema);
