const logAction = (message, meta = {}) => {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, level: 'info', message, ...meta }));
};

const logError = (error, meta = {}) => {
  const timestamp = new Date().toISOString();
  const payload = {
    timestamp,
    level: 'error',
    message: error.message || String(error),
    stack: error.stack || null,
    ...meta,
  };
  console.error(JSON.stringify(payload));
};

module.exports = {
  logAction,
  logError,
};
