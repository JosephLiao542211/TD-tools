const requestLogger = (logger) => {
  return (req, res, next) => {
    const startTime = Date.now();

    logger.logRequest(req);

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.logResponse(req, res, duration);
    });

    next();
  };
};

module.exports = requestLogger;
