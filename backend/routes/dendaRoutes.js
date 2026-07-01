const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');
const { authMiddleware, roleGuard } = require('../middleware/auth');

router.get('/', authMiddleware, roleGuard(['admin']), peminjamanController.getDendaList);
router.patch('/:id/bayar', authMiddleware, roleGuard(['admin']), peminjamanController.bayarDenda);

module.exports = router;
