const express = require('express');
const router = express.Router();
const anggotaController = require('../controllers/anggotaController');
const { authMiddleware, roleGuard } = require('../middleware/auth');

router.get('/', authMiddleware, roleGuard(['admin']), anggotaController.getAllAnggota);
router.post('/', authMiddleware, roleGuard(['admin']), anggotaController.createAnggota);
router.put('/:id', authMiddleware, anggotaController.updateAnggota);
router.patch('/:id/status', authMiddleware, roleGuard(['admin']), anggotaController.toggleAnggotaStatus);

module.exports = router;
