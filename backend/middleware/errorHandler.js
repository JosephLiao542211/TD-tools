const errorHandler = (logger) => {
  return (err, req, res, next) => {
    logger.error('Unhandled error', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    res.status(err.status || 500).json({
      error: true,
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  };
};

module.exports = errorHandler;
