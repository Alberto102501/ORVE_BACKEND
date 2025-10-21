const express = require('express');
const inventoryTiresController = require('../../controllers/servicesAndTires/inventoryTires.controller');

const Router = express.Router();

Router.get("/", inventoryTiresController.getInventory);
Router.post("/", inventoryTiresController.addInventoryTire);
Router.put("/:id", inventoryTiresController.updateInventoryTire);
Router.delete("/:id", inventoryTiresController.deleteInventoryTire);

module.exports = Router;