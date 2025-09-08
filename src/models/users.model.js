const mongoose = require('mongoose');

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
        match: /^\d+$/
    },
    userType:{
        type: String,
        required: true
    },
}, {
  timestamps: true
});


module.exports = mongoose.model('User', userSchema);