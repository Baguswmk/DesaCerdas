export const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

export const errorResponse = (res, message, errors = null, statusCode = 400) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (errors) {
    response.errors = Array.isArray(errors) ? errors : [errors];
  }
  
  return res.status(statusCode).json(response);
};

export const paginatedResponse = (res, message, data, pagination, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10))
    },
    timestamp: new Date().toISOString()
  });
};
