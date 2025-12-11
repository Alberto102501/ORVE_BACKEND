const express = require('express');
const userController = require('../controllers/users.controller');
const validateToken = require('../middleware/validateToken')
const auditLogger = require('../middleware/auditLogger');

const User = require('../models/users.model');

const Router = express.Router();

Router.get('/', userController.getUsers);
Router.post('/', auditLogger(User), userController.createUser);
Router.put('/:id', validateToken.authRequired, auditLogger(User), userController.updateUser);
Router.delete('/:id', auditLogger(User), userController.deleteUser);

module.exports = Router;