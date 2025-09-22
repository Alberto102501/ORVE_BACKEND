const mongoose = require('mongoose');
const { bool } = require('sharp');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    addres:{
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    assignment:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
        match: [/^\d+$/, 'El número de teléfono debe contener solo dígitos']
    },
    numberEmployed:{
        type: String,
        required: true
    },
    status:{
        type: Boolean
    }
}, {
  timestamps: true
});


module.exports = mongoose.model('User', userSchema);