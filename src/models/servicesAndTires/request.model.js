const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
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
        required: true,
    },
    priority: {
        type: String,
        required: true,
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
        required: true,
    },
    mileage: {
        type: Number,
        required: true,
    },
    status: {
        type: String
    },
    tire :{
        type: Object
    },
    items: [
        {
            quantity: {
                type: Number,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Request", requestSchema);
