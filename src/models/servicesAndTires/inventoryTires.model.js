const mongoose = require('mongoose');

const inventoryTireSchema = new mongoose.Schema({
    typeVehicle : {
        type : String,
    },
    rin : {
        type : String,
        required : true
    },
    measure : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    requisition : {
        type : String
    }
});

module.exports = mongoose.model("inventoryTire", inventoryTireSchema, "inventoryTire");