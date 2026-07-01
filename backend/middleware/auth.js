const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Format token salah.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeyatmalibrary123');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid atau telah kadaluarsa.' });
  }
};

const roleGuard = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak memiliki izin.' });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  roleGuard,
};
