const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController');
const { authMiddleware, roleGuard } = require('../middleware/auth');

router.get('/', bukuController.getAllBuku);
router.get('/:id', bukuController.getBukuById);
router.post('/', authMiddleware, roleGuard(['admin']), bukuController.createBuku);
router.put('/:id', authMiddleware, roleGuard(['admin']), bukuController.updateBuku);
router.delete('/:id', authMiddleware, roleGuard(['admin']), bukuController.deleteBuku);

module.exports = router;
