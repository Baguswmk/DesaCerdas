import csrf from 'csurf';

const createCSRFMiddleware = () => {
  return csrf({
    cookie: {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 3600000 
    },
    ignoreMethods: process.env.NODE_ENV === 'development' 
      ? ['GET', 'HEAD', 'OPTIONS'] 
      : ['GET', 'HEAD', 'OPTIONS']
  });
};

export const smartCSRF = (req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const forceDisable = process.env.DISABLE_CSRF === 'true';
  
  // For guest endpoints, be more lenient
  if (req.path.includes('/guest/') && isDevelopment) {
    console.log('🔓 CSRF protection relaxed for guest endpoint in development');
    req.csrfToken = () => 'development-guest-token';
    return next();
  }
  
  if ((isDevelopment || forceDisable) && process.env.FORCE_CSRF !== 'true') {
    console.log('🔓 CSRF protection disabled for development');
    req.csrfToken = () => 'development-mode-no-csrf';
    return next();
  }
  
  const csrfProtection = createCSRFMiddleware();
  csrfProtection(req, res, (err) => {
    if (err) {
      console.error('❌ CSRF Error:', err.message);
      return res.status(403).json({
        success: false,
        message: 'CSRF token tidak valid atau hilang',
        code: 'INVALID_CSRF_TOKEN',
        hint: 'Ambil CSRF token dari GET /api/csrf-token dulu'
      });
    }
    next();
  });
};

export default smartCSRF;