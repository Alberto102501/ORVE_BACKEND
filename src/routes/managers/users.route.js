const express = require('express');
const usersController = require('../../controllers/managers/users.controller');
const validateToken = require('../../middleware/validateToken');
const auditLogger = require('../../middleware/auditLogger');
const User = require('../../models/managers/users.model');


const Router = express.Router();

Router.get('/users', validateToken.authRequired, usersController.getUsers);
// Router.get('/:id', );
Router.post('/users', validateToken.authRequired, auditLogger(User), usersController.createUser);
Router.put('/users/:id', validateToken.authRequired, auditLogger(User), usersController.updateUser);

Router.post('/login', usersController.login);
Router.post('/logout', usersController.logout);
Router.post('/recovery/sendCode', usersController.sendCode);
Router.post('/recovery/resetPassword', usersController.resetPassword);
Router.post('/recovery/verifyCode', usersController.verifyCode);

module.exports = Router;