const express = require('express');
const inventoryTiresController = require('../../controllers/servicesAndTires/inventoryTires.controller');
const auditLogger = require('../../middleware/auditLogger');
const InventoryTire = require('../../models/servicesAndTires/inventoryTires.model');

const Router = express.Router();

Router.get("/", inventoryTiresController.getInventory);
Router.post("/", auditLogger(InventoryTire), inventoryTiresController.addInventoryTire);
Router.put("/:id", auditLogger(InventoryTire), inventoryTiresController.updateInventoryTire);
Router.delete("/:id", auditLogger(InventoryTire), inventoryTiresController.deleteInventoryTire);

module.exports = Router;