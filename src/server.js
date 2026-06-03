const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const { logAction, logError } = require('./utils/logger');

dotenv.config();

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
  logAction('Server started', { port: PORT });
});

server.on('error', (error) => {
  logError(error, { message: 'Server error' });
  process.exit(1);
});
