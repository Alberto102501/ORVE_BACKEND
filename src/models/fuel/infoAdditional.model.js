const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    numberCard: {
        type: String,
        required: true
    },
    amount:{
        type: Number,
    },
    location:{
        type: String
    },
    observations:{
        type: String
    },
    status:{
        type: Boolean,
        default: true
    }
});


module.exports = mongoose.model('InfoAddFuel', userSchema,'InfoAddFuel');