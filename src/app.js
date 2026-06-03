const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const { logAction } = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logAction('Incoming request', { method: req.method, path: req.originalUrl });
  next();
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use(errorHandler);

module.exports = app;
