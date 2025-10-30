const mongoose = require("mongoose");

const autoPartsInventorySchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        trim: true,
    },
    plate: {
        type: String,
        trim: true,
        default: null,
    },
    vehicleDetails: [{
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        vehicleType: {
            type: String,
            required: true,
            trim: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
        },
        cylinders: {
            type: String,
            required: true,
            trim: true,
        },
    }],
    ur: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
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
    partBrand: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("autoPartsInventory", autoPartsInventorySchema,"autoPartsInventory");
