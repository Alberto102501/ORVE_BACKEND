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
const validateToken = require('../middleware/validateToken');

const router = Router();

router.get('/byPlate', validateToken.authRequired, getReceiptByPlate);
router.post('/', validateToken.authRequired, auditLogger(Receipt), createReceipt);
router.get('/', validateToken.authRequired, getReceipts);
router.get('/getByNumberEmployed/:numEmployed', validateToken.authRequired, getReceiptByNumberEmployed);
router.get('/:id', validateToken.authRequired, getReceiptById);
router.put('/:id', validateToken.authRequired, auditLogger(Receipt), updateReceipt);
router.patch('/:id', validateToken.authRequired, auditLogger(Receipt), patchReceipt);
router.delete('/:id', validateToken.authRequired, auditLogger(Receipt), deleteReceipt);

module.exports = router;
