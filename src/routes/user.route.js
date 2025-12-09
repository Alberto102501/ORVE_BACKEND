const express = require('express');
const userController = require('../controllers/users.controller');
const validateToken = require('../middleware/validateToken')
const auditLogger = require('../middleware/auditLogger');

const User = require('../models/users.model');

const Router = express.Router();

Router.get('/', /*validateToken.authRequired,*/ userController.getUsers);
Router.post('/', userController.createUser);
Router.put('/:id', auditLogger(User), userController.updateUser);
Router.delete('/:id', userController.deleteUser);

module.exports = Router;