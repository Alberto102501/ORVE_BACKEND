const mongoose = require('mongoose');

const requestProductsSchema = new mongoose.Schema({
    folio: {
        type: String,
        required: true,
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
    isBase: {
        type: Boolean,
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
    approvedProducts: [
        {
            // Campos de control interno
            inventoryId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            assignedQuantity: {
                type: Number,
                required: true
            },

            // **********************************
            // ** CAMPOS DEL PRODUCTO DE INVENTARIO **
            // **********************************
            orderNumber: {
                type: String,
                trim: true,
            },
            process: {
                type: String,
                trim: true,
            },
            plate: {
                type: String,
                trim: true,
            },
            category: {
                type: String,
                trim: true,
            },
            description: {
                type: String,
                required: true,
                trim: true
            },
            um: {
                type: String,
                required: true,
                trim: true
            },
            partBrand: {
                type: String,
                trim: true,
            },
        }
    ],
    status: {
        type: String,
        enum: ['Pendiente', 'Asignado', 'Rechazado'],
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