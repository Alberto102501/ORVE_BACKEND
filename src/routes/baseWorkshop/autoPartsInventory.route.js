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

const router = Router();

router.get('/', getInventory);
router.post('/', createInventoryItem);
router.get('/:id', getInventoryItem);
router.put('/:id', updateInventoryItem);
router.patch('/deduct-stock', updateInventoryQuantity);
router.delete('/:id', deleteInventoryItem);

module.exports = router;
