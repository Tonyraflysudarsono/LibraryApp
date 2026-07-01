const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const { authMiddleware, roleGuard } = require('../middleware/auth');

router.get('/', kategoriController.getAllKategori);
router.post('/', authMiddleware, roleGuard(['admin']), kategoriController.createKategori);

module.exports = router;
