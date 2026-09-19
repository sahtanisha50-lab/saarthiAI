const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../services/geminiService');

/**
 * POST /api/chat
 * Handles voice & text queries for senior citizens.
 */
router.post('/', async (req, res, next) => {
  try {
    const { userSpeechInput, language = 'en-US' } = req.body;

    if (!userSpeechInput || typeof userSpeechInput !== 'string' || !userSpeechInput.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid question or voice input.",
        timestamp: new Date().toISOString()
      });
    }

    const aiReply = await generateChatResponse(userSpeechInput, language);

    return res.json({
      success: true,
      data: {
        reply: aiReply,
        language
      },
      voiceTextPrompt: aiReply.replace(/<[^>]*>?/gm, ''), // Clean TTS voice text
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
