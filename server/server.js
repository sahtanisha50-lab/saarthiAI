const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sanitizeInput } = require('./middleware/sanitize');
const { apiLimiter, errorHandler } = require('./middleware/rateLimiter');

const chatRouter = require('./routes/chat');
const explainRouter = require('./routes/explain');
const verifyRouter = require('./routes/verify');

const app = express();
const PORT = process.env.PORT || 8080;

// Security & Parsing Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Input sanitization against XSS
app.use(sanitizeInput);

// Rate Limiter for API endpoints
app.use('/api', apiLimiter);

// API Routes (GEMINI_API_KEY is isolated strictly on the server side)
app.use('/api/chat', chatRouter);
app.use('/api/explain', explainRouter);
app.use('/api/verify', verifyRouter);

// Serve Frontend Static Web Files
app.use(express.static(path.join(__dirname, '..')));

// Fallback Route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Saarthi AI Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;
