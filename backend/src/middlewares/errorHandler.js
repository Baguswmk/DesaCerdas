export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  console.error('Stack:', err.stack);
  
  
  if (err.code) {
    switch (err.code) {
      case 'P2002':
        return errorResponse(res, 'Data already exists', null, 409);
      case 'P2025':
        return errorResponse(res, 'Record not found', null, 404);
      case 'P2003':
        return errorResponse(res, 'Foreign key constraint failed', null, 400);
      default:
        return errorResponse(res, 'Database error', null, 500);
    }
  }
  
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 'File too large', null, 413);
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return errorResponse(res, 'Unexpected file field', null, 400);
  }
  
  
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', null, 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', null, 401);
  }
  
  
  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation failed', err.details, 422);
  }
  
  
  return errorResponse(res, 'Internal server error', null, 500);
};