const express = require('express');
const requestController = require('../../controllers/servicesAndTires/request.controller');

const Router = express.Router();

Router.get("/", requestController.getRequests);
Router.get("/:id", requestController.getRequest);
Router.post("/", requestController.createRequest);
Router.put("/:id", requestController.updateRequest);
Router.delete("/:id", requestController.deleteRequest);

module.exports = Router;
