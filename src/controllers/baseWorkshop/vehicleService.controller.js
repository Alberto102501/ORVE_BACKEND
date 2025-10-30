const newService = require('../../models/baseWorkshop/vehicleService.model');

exports.getRegistersService = async (req, res) => {
    try{
        const services = await newService.find();
        res.status(200).json({message: 'Success', data: services});
    }catch (error){
        res.status(500).json({Error: error.message});
    }
}

exports.getById = async (req, res) => {
    try{
        const register = await newService.findById(req.params.id);

        if(!register) {
            res.status(404).json({message: 'Registro no encontrado'});
        }

        res.status(200).json({message: 'Success', data: register});
    }catch(error){
        res.status(500).json({error: error.message});
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

exports.updateRequestService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Si el status cambia a Aceptado o Rechazado, registra la fecha
    if (['Aceptado', 'Rechazado'].includes(req.body.status)) {
      updateData.acceptanceDate = new Date();
    }

    // Si el status vuelve a Pendiente, borra la fecha
    if (req.body.status === 'Pendiente') {
      updateData.acceptanceDate = null;
    }

    const updatedService = await newService.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ message: 'Registro actualizado', data: updatedService });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ error: error.message });
  }
};