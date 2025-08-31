import jwt from 'jsonwebtoken';

// Middleware untuk verifikasi token JWT
export const verifyToken = (req, res, next) => {
  try {
    // Ambil token dari cookies atau Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token tidak ditemukan. Silakan login terlebih dahulu.' 
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token telah expired. Silakan login kembali.' 
      });
    }
    return res.status(403).json({ 
      success: false,
      message: 'Token tidak valid.' 
    });
  }
};

// Middleware opsional untuk user yang belum login
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Jika token tidak valid, tetap lanjut tanpa user
    next();
  }
};

// Middleware untuk role-based access
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Akses ditolak. Login diperlukan.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Akses ditolak. Role tidak memiliki izin.' 
      });
    }

    next();
  };
};

// Alias untuk kemudahan penggunaan
export const authenticateToken = verifyToken;
export const requireAdmin = [verifyToken, requireRole('ADMIN')];
