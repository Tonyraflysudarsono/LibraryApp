const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');
const { authMiddleware, roleGuard } = require('../middleware/auth');

router.get('/', authMiddleware, peminjamanController.getAllTransactions);
router.post('/', authMiddleware, peminjamanController.createTransaction);
router.patch('/:id/request-return', authMiddleware, peminjamanController.requestReturn);
router.post('/:id/verify', authMiddleware, roleGuard(['admin']), peminjamanController.verifyReturn);

module.exports = router;
