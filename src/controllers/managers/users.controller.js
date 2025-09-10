const mongoose = require('mongoose');
const User = require('../../models/managers/users.model');

exports.getUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({success: true, data: users});
    }catch(error){
        res.status(500).json({success: false, message: 'Error al obtener usuarios: ', error});
    }
}

exports.createUser = async (req, res) => {
    const {name, username, password, module, status} = req.body;
    
    try{
        const newUser = new User({name, username, password, module, status});
        const savedUser = await newUser.save();
        res.status(200).json({success: true, data: savedUser});
    } catch(error) {
        res.status(500).json({success: false, message: 'Error al crear usuario', error})
    }
}

exports.updateUser = async (req, res) => {
    const {id} = req.params;
    const update = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, update, {
          new: true,              // Devuelve el documento actualizado
          runValidators: true     // Aplica validaciones del esquema
        });
    
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    
        res.status(200).json({ success: true, data: updatedUser });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar usuario', error });
      }
}