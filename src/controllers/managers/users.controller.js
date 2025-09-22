const mongoose = require('mongoose');
const User = require('../../models/managers/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createAccessToken = require('../../libs/jwt')

exports.getUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({success: true, data: users});
    }catch(error){
        res.status(500).json({success: false, message: 'Error al obtener usuarios: ', error});
    }
}

exports.createUser = async (req, res) => {
    const {name, username, password, module, status, typeUser} = req.body;
    
    try{
        // const passwordHash = await bcrypt.hash(password, 10); 

        const newUser = new User({name, username, password/*: passwordHash*/, module, status, typeUser});
        const savedUser = await newUser.save();

        // const token = await createAccessToken({id: savedUser._id});

        // res.cookie('token', token);
        // res.json({message: 'Usuario creado exitosamente'});

        res.status(200).json({success: true, data: savedUser});
    } catch(error) {
        res.status(500).json({success: false, message: 'Error al crear usuario', error});
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

exports.login = async (req, res) => {
  const {username, password} = req.body;

  try{
    const userFound = await User.findOne({username});
    if(!userFound) return res.status(400).json({message: "Usuario no encontrado."});

    const isMatch = await bcrypt.compare(password, userFound.password);

    if(!isMatch) return res.status(400).json({message: "Contraseña incorrecta"});

    const token = await createAccessToken({id: userFound._id});

    res.cookie('token', token);

    res.status(200).json({success: true, data: userFound.username});

  }catch(error){
    res.status(500).json({success: false, message: 'Error al crear usuario', error});
  }
}

exports.logout = (req, res) => {
  res.cookie('token', "", {
    expires: new Date(0) 
  });
  return res.sendStatus(200);
}