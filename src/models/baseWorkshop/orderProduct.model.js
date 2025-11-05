const mongoose = require("mongoose");

const orderProductsSchema = new mongoose.Schema({
    products : [{
        plates : {
            type: String,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        um: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
    }],
    status : {
        type: String,
        default: 'Pendiente',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("orderProducts", orderProductsSchema,"orderProducts");