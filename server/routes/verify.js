const express = require('express');
const router = express.Router();
const { verifyScamMessage } = require('../services/geminiService');

/**
 * POST /api/verify
 * Analyzes SMS, caller text, or web links for phishing threats and artificial urgency.
 */
router.post('/', async (req, res, next) => {
  try {
    const { messageText = '' } = req.body;

    if (!messageText || typeof messageText !== 'string' || !messageText.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid SMS text message or link to inspect.",
        timestamp: new Date().toISOString()
      });
    }

    const verificationResult = await verifyScamMessage(messageText);

    return res.json({
      success: true,
      data: verificationResult,
      voiceTextPrompt: `${verificationResult.headlineWarning} ${verificationResult.plainTextExplanation}`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
