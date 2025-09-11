const express = require('express');
const usersController = require('../../controllers/managers/users.controller');
const validateToken = require('../../middleware/validateToken');


const Router = express.Router();

Router.get('/', usersController.getUsers);
// Router.get('/:id', );
Router.post('/', usersController.createUser);
Router.put('/:id', usersController.updateUser);

Router.post('/login', usersController.login);
Router.post('/logout', usersController.logout);

module.exports = Router;