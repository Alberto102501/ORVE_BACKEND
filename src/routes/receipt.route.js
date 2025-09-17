const { Router } = require('express');
const {
    createReceipt,
    getReceipts,
    getReceiptById,
    updateReceipt
} = require('../controllers/receipt.controller.js');

const router = Router();

router.post('/', createReceipt);
router.get('/', getReceipts);
router.get('/:id', getReceiptById);
router.put('/:id', updateReceipt);

module.exports = router;
