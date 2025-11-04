const mongoose = require('mongoose');

const workshopRequestSchema = new mongoose.Schema({
    folio: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    vehicle: {
        //id: { type: mongoose.Schema.Types.ObjectId, ref: 'vehicles', required: true },
        numEco: { type: String },
        brand: { type: String },
        subBrand: { type: String },
        series: { type: String },
        type: { type: String },
        color: { type: String },
        model: { type: String },
        plates: { type: String },
        accessories: { type: [String] },
        condition: { type: String },
        annotations: { type: String },
        numberCard: { type: String },
        cylinders: { type: String },
        transmission: { type: String }
    },
    user: {
        type: String,
        required: true,
        trim: true,
    },
    assignment: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    time: {
        type: String,
    },
    date: {
        type: Date,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    appointmentDate: {
        type: Date,
    },
    appointmentTime: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WorkshopRequests', workshopRequestSchema, 'workshopRequests');