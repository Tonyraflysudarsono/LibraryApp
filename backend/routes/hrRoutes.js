const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');
const { authMiddleware, roleGuard } = require('../middleware/auth');

router.get('/karyawan', authMiddleware, roleGuard(['admin']), hrController.getAllKaryawan);
router.post('/karyawan', authMiddleware, roleGuard(['admin']), hrController.createKaryawan);
router.put('/karyawan/:id', authMiddleware, roleGuard(['admin']), hrController.updateKaryawan);
router.delete('/karyawan/:id', authMiddleware, roleGuard(['admin']), hrController.deleteKaryawan);

router.get('/kehadiran', authMiddleware, roleGuard(['admin']), hrController.getKehadiran);
router.post('/kehadiran', authMiddleware, roleGuard(['admin']), hrController.recordKehadiran);

router.get('/stats', authMiddleware, roleGuard(['admin']), hrController.getHRStats);

module.exports = router;
