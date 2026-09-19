const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware: Limits requests to 60 requests per 15 minutes window per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    error: "Too many requests from this device. Please take a rest and try again shortly.",
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Global Error Fallback Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('[Saarthi Error Handler]:', err.stack || err.message || err);
  res.status(500).json({
    success: false,
    error: "Saarthi is having a brief moment. Everything is safe. Please try again.",
    voiceTextPrompt: "Saarthi is having a brief moment. Everything is safe. Please try again.",
    timestamp: new Date().toISOString()
  });
}

module.exports = { apiLimiter, errorHandler };
