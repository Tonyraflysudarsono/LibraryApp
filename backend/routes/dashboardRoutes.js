const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, roleGuard } = require('../middleware/auth');

router.get('/stats', authMiddleware, roleGuard(['admin']), dashboardController.getDashboardStats);

module.exports = router;
