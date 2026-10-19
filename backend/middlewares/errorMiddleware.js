export const errorHandler = (err, req, res, next) => {
  console.error('Error middleware:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    error: JSON.stringify(err, Object.getOwnPropertyNames(err))
  });

  const statusCode = err.status || 500;
  const errorMessage = typeof err.message === 'string' ? err.message : 
    (err.message ? JSON.stringify(err.message) : 'Internal Server Error');

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      status: statusCode
    }
  });
};