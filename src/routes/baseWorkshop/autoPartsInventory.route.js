const { Router } = require('express');
const {
    getInventory,
    createInventoryItem,
    getInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateInventoryQuantity
} = require('../../controllers/baseWorkshop/autoPartsInventory.controller.js');
const validateToken = require('../../middleware/validateToken.js');
const auditLogger = require('../../middleware/auditLogger.js');
const AutoPartsInventory = require('../../models/baseWorkshop/autoPartsInventory.model.js');

const router = Router();

router.get('/', validateToken.authRequired, getInventory);
router.post('/', validateToken.authRequired, auditLogger(AutoPartsInventory), createInventoryItem);
router.get('/:id', validateToken.authRequired, getInventoryItem);
router.put('/:id', validateToken.authRequired, auditLogger(AutoPartsInventory), updateInventoryItem);
router.patch('/deduct-stock', validateToken.authRequired, auditLogger(AutoPartsInventory), updateInventoryQuantity);
router.delete('/:id', validateToken.authRequired, auditLogger(AutoPartsInventory), deleteInventoryItem);

module.exports = router;
