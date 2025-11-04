const mongoose = require('mongoose');

const requestProductsSchema = new mongoose.Schema({
    folio: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    plate: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    subBrand: {
        type: String,
        required: true,
        trim: true,
    },
    model: {
        type: String,
        required: true,
        trim: true,
    },
    products: [
        {
            amount: {
                type: Number,
                required: true,
                min: 1 // Asegura que la cantidad sea al menos 1
            },
            Product: { 
                type: String,
                required: true,
                trim: true
            },
            um: { 
                type: String,
                required: true,
                trim: true
            },
            observations: { 
                type: String,
                default: '',
                trim: true
            }
        }
    ],
    status: {
        type: String,
        enum: ['Pendiente', 'Aceptado', 'Rechazado'],
        default: 'Pendiente',
    },
    reasonRejection: {
        type: String,
        trim: true,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('RequestProducts', requestProductsSchema);