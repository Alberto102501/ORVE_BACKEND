const newService = require('../../models/baseWorkshop/vehicleService.model');

exports.getRegistersService = async (req, res) => {
    try{
        const services = await newService.find();
        res.status(200).json({message: 'Success', data: services});
    }catch (error){
        res.status(500).json({Error: error.message});
    }
}

exports.createRequestService = async (req, res) => {
    try{
        const newRequestService = new newService(req.body);
        const savedRequestServices = await newRequestService.save();
        res.status(200).json({message: 'Success', data: savedRequestServices}) ;
    }catch (error){
        console.error('Error al guardar servicio: ', error);
        res.status(500).json({Error: error.message});
    }
}