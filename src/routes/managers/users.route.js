const express = require('express');
const usersController = require('../../controllers/managers/users.controller');


const Router = express.Router();

Router.get('/', usersController.getUsers);
// Router.get('/:id', );
Router.post('/', usersController.createUser);
Router.put('/:id', usersController.updateUser);

module.exports = Router;