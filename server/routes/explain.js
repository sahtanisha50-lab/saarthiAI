const express = require('express');
const router = express.Router();
const { simplifyDocumentText } = require('../services/geminiService');

/**
 * POST /api/explain
 * Parses prescription notes, bills, or letters into plain senior-friendly routines.
 */
router.post('/', async (req, res, next) => {
  try {
    const { documentText = '' } = req.body;

    const analysis = await simplifyDocumentText(documentText);

    return res.json({
      success: true,
      data: analysis,
      voiceTextPrompt: `${analysis.plainEnglishSummary} Here are your steps: ${analysis.steps.map(s => s.title + ': ' + s.instruction).join('. ')}`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
