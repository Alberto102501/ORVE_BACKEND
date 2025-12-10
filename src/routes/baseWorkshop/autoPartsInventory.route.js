const { Router } = require('express');
const {
    getInventory,
    createInventoryItem,
    getInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateInventoryQuantity
} = require('../../controllers/baseWorkshop/autoPartsInventory.controller.js');
const { authRequired } = require('../../middleware/validateToken.js');
const auditLogger = require('../../middleware/auditLogger.js');
const AutoPartsInventory = require('../../models/baseWorkshop/autoPartsInventory.model.js');

const router = Router();

router.get('/', getInventory);
router.post('/', auditLogger(AutoPartsInventory), createInventoryItem);
router.get('/:id', getInventoryItem);
router.put('/:id', auditLogger(AutoPartsInventory), updateInventoryItem);
router.patch('/deduct-stock', auditLogger(AutoPartsInventory), updateInventoryQuantity);
router.delete('/:id', auditLogger(AutoPartsInventory), deleteInventoryItem);

module.exports = router;
