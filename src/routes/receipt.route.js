const { Router } = require('express');
const {
    createReceipt,
    getReceipts,
    getReceiptById,
    updateReceipt,
    patchReceipt,
    deleteReceipt,
    getReceiptByPlate,
    getReceiptByNumberEmployed
} = require('../controllers/receipt.controller.js');
const auditLogger = require('../middleware/auditLogger');
const Receipt = require('../models/receipt.model.js');

const router = Router();

router.get('/byPlate', getReceiptByPlate);
router.post('/', auditLogger(Receipt), createReceipt);
router.get('/', getReceipts);
router.get('/getByNumberEmployed/:numEmployed', getReceiptByNumberEmployed);
router.get('/:id', getReceiptById);
router.put('/:id', auditLogger(Receipt), updateReceipt);
router.patch('/:id', auditLogger(Receipt), patchReceipt);
router.delete('/:id', auditLogger(Receipt), deleteReceipt);

module.exports = router;
