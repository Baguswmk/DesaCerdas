export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    user: req.user?.id || 'anonymous'
  });
  
  
  if (err.code && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'Data sudah ada dalam sistem',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Data tidak ditemukan'
        });
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Referensi data tidak valid'
        });
      default:
        return res.status(500).json({
          success: false,
          message: 'Terjadi kesalahan database'
        });
    }
  }
  
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Ukuran file terlalu besar'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Field file tidak sesuai'
    });
  }
  
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token telah expired'
    });
  }
  
  
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Terjadi kesalahan server internal'
  });
};