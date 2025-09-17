const mongoose = require('mongoose');
const User = require('../models/users.model');

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuarios', error });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { name, addres, position, assignment, phone, numberEmployed } = req.body;

  if (!name || !addres || !position || !assignment || !phone || !numberEmployed) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  // Validación de formato de teléfono (solo dígitos) y longitud
  const phoneRegex = /^\d+$/;
  const longitud = 10;
  if(phone.length !== longitud){
    return res.status(400).json({ success: false, message: 'El número de teléfono debe tener 10 dígitos' });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'El número de teléfono debe contener solo dígitos, sin letras ni símbolos'
    });
  }

  try {
    const newUser = new User({ name, addres, position, assignment, phone, numberEmployed });
    const savedUser = await newUser.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear usuario', error });
  }
};

//Actualizar un usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Validar formato de ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  if (updates.phone) {
    const phoneRegex = /^\d+$/;
    const longitud = 10;

    if (updates.phone.length !== longitud) {
      return res.status(400).json({
        success: false,
        message: 'El número de teléfono debe tener 10 dígitos'
      });
    }

    if (!phoneRegex.test(updates.phone)) {
      return res.status(400).json({
        success: false,
        message: 'El número de teléfono debe contener solo dígitos, sin letras ni símbolos'
      });
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
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
};

//Eliminar un usuario
exports.deleteUser = async (req, res) => {
}