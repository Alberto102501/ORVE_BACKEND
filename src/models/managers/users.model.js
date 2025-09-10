const mongoose = require('mongoose');
const usersModel = require('../users.model');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    module:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        required: true
    }
}, 
{
  timestamps: true
});

module.exports = mongoose.model('Managers', userSchema);