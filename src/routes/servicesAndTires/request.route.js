const express = require('express');
const requestController = require('../../controllers/servicesAndTires/request.controller');
const auditLogger = require('../../middleware/auditLogger');
const Request = require('../../models/servicesAndTires/request.model');

const Router = express.Router();

Router.get("/accepted", requestController.getAcceptedRequests);
Router.get("/", requestController.getRequests);
Router.get("/:id", requestController.getRequest);
Router.post("/", auditLogger(Request), requestController.createRequest);
Router.put("/:id", auditLogger(Request), requestController.updateRequest);
Router.delete("/:id", auditLogger(Request), requestController.deleteRequest);

module.exports = Router;
