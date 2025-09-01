import csrf from 'csurf';

// Konfigurasi CSRF yang flexible
const createCSRFMiddleware = () => {
  return csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 3600000 // 1 hour
    },
    // Ignore CSRF untuk development jika environment variable diset
    ignoreMethods: process.env.NODE_ENV === 'development' ? ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'] : ['GET', 'HEAD', 'OPTIONS']
  });
};

// Smart CSRF middleware - otomatis disable untuk development
export const smartCSRF = (req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const forceDisable = process.env.DISABLE_CSRF === 'true';
  
  // Disable CSRF jika development dan tidak ada force enable
  if ((isDevelopment || forceDisable) && process.env.FORCE_CSRF !== 'true') {
    console.log('🔓 CSRF protection disabled for development');
    // Mock csrfToken function untuk compatibility
    req.csrfToken = () => 'dev-mode-no-csrf-needed';
    return next();
  }
  
  // Gunakan CSRF normal untuk production
  const csrfProtection = createCSRFMiddleware();
  csrfProtection(req, res, (err) => {
    if (err) {
      console.error('❌ CSRF Error:', err.message);
      return res.status(403).json({
        success: false,
        message: 'CSRF token diperlukan atau tidak valid',
        code: 'INVALID_CSRF_TOKEN',
        hint: 'Dapatkan CSRF token dari /api/csrf-token terlebih dahulu'
      });
    }
    next();
  });
};

export default smartCSRF;