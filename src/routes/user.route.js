const express = require('express');
const userController = require('../controllers/users.controller');

const Router = express.Router();

Router.get('/', userController.getUsers);
Router.post('/', userController.createUser);
Router.put('/:id', userController.updateUser);
Router.delete('/:id', userController.deleteUser);

module.exports = Router;