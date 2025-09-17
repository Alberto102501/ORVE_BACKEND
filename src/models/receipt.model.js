const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
    XP_RH_CI: {
        type: String,
        required: true,
        trim: true
    },
    folio: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    strict: false
});

module.exports = mongoose.model('Receipt', receiptSchema);
