const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const { logAction } = require('./utils/logger');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logAction('Incoming request', { method: req.method, path: req.originalUrl });
  next();
});

app.use('/api', routes);

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', '..', 'Frontend', 'dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use(errorHandler);

module.exports = app;
