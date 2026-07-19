function log(level, message, meta = {}) {
  const logObj = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  console.log(JSON.stringify(logObj));
}

const logger = {
  info: (msg, meta) => log('INFO', msg, meta),
  warn: (msg, meta) => log('WARN', msg, meta),
  error: (msg, error, meta = {}) => {
    const errorMeta = error instanceof Error 
      ? { error: error.message, stack: error.stack } 
      : { error };
    log('ERROR', msg, { ...errorMeta, ...meta });
  }
};

module.exports = logger;
