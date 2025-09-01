
import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token tidak ditemukan' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token tidak valid' 
    });
  }
};


export const authenticateToken = verifyToken;


export const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    
    next();
  }
};


export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }
    
    next();
  };
};


export const requireAdmin = [verifyToken, requireRole(['ADMIN'])];


export const authenticate = (options = {}) => {
  const { required = true, roles = [] } = options;
  
  return async (req, res, next) => {
    try {
      const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
      
      if (!token) {
        if (required) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
        }
        return next();
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      next();
    } catch (error) {
      if (required) {
        return res.status(403).json({
          success: false,
          message: 'Invalid token'
        });
      }
      next();
    }
  };
};


export const requireAuth = authenticate({ required: true });
export const adminOnly = authenticate({ required: true, roles: ['ADMIN'] });