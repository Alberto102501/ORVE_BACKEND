const express = require('express');
const usersController = require('../../controllers/managers/users.controller');
const validateToken = require('../../middleware/validateToken');


const Router = express.Router();

Router.get('/users', usersController.getUsers);
// Router.get('/:id', );
Router.post('/users', usersController.createUser);
Router.put('/users/:id', usersController.updateUser);

Router.post('/login', usersController.login);
Router.post('/logout', usersController.logout);
Router.post('/recovery/sendCode', usersController.sendCode);
Router.post('/recovery/resetPassword', usersController.resetPassword);
Router.post('/recovery/verifyCode', usersController.verifyCode);

module.exports = Router;