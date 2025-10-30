const { Router } = require('express');
const {
    createReceipt,
    getReceipts,
    getReceiptById,
    updateReceipt,
    patchReceipt,
    deleteReceipt,
    getReceiptByPlate
} = require('../controllers/receipt.controller.js');

const router = Router();

router.get('/byPlate', getReceiptByPlate);
router.post('/', createReceipt);
router.get('/', getReceipts);
router.get('/:id', getReceiptById);
router.put('/:id', updateReceipt);
router.patch('/:id', patchReceipt);
router.delete('/:id', deleteReceipt);

module.exports = router;
