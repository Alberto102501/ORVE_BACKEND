const mongoose = require("mongoose");

const orderProductsSchema = new mongoose.Schema({
    products : [{
        plates : {
            type: String,
            trim: true,
            uppercase: true
        },
        brand: {
            type: String,
            trim: true,
            uppercase: true
        },
        subBrand: {
            type: String,
            trim: true,
            uppercase: true
        },
        model: {
            type: String,
            trim: true,
        },
        cylinders: {
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
            uppercase: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
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