/**
 * Centralized application error handling middleware
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}`;

  console.error(`[Error] [${req.method} ${req.url}] RequestID: ${requestId}`, err);

  const response = {
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR'
    },
    requestId
  };

  // Only expose stack traces in local development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
    error: { code: 'ROUTE_NOT_FOUND' }
  });
}
