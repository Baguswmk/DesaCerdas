// 1. Unified Auth Middleware - middlewares/auth.js
import { verifyToken as verifyJwt } from '../utils/jwt.js';

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
      
      const decoded = verifyJwt(token);
      req.user = decoded;
      
      // Role-based access control
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

// Specific middleware for common use cases
export const requireAuth = authenticate({ required: true });
export const optionalAuth = authenticate({ required: false });
export const requireAdmin = authenticate({ required: true, roles: ['ADMIN'] });


// 3. Error Handler Middleware - middlewares/errorHandler.js


// 4. Request Logger - middlewares/logger.js


// 5. Enhanced Upload Configuration - config/upload.js

// 6. Validation Middleware - middlewares/validation.js


// 7. Database Configuration - config/database.js
