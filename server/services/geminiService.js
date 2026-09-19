const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Access GEMINI_API_KEY strictly from server environment variables
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
let genAI = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * System Instructions for Saarthi AI Senior Companion Persona
 */
const SAARTHI_PERSONA_PROMPT = `
You are Saarthi, a warm, patient, and deeply respectful daily companion for senior citizens (65+).
Your goal is to help older adults navigate daily tasks, health reminders, and technology with zero anxiety.

RULES:
1. Warm & Reassuring: Speak softly and gently.
2. Short & Scannable: Max 4 sentences or a 3-bullet list.
3. NO TECH JARGON: Never use terms like "interface", "URL", "cloud", "authentication". Use "screen", "web page", "safe storage", "sign in".
4. Step-by-Step: Max 3 simple numbered steps.
5. End with ONE single, clear follow-up question.
`;

/**
 * Generates AI Companion Chat Response
 */
async function generateChatResponse(userQuery, userLanguage = 'en-US') {
  if (!apiKey || !genAI) {
    // Intelligent Fallback Persona Response when key is missing or testing
    return getFallbackChatResponse(userQuery);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SAARTHI_PERSONA_PROMPT
    });

    const prompt = `User Query: "${userQuery}". Respond as Saarthi AI companion in ${userLanguage === 'hi-IN' ? 'Hindi' : 'English'}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error('[Gemini API Chat Error]:', err.message);
    return getFallbackChatResponse(userQuery);
  }
}

/**
 * Analyzes Medical Documents & Prescriptions
 */
async function simplifyDocumentText(documentText) {
  if (!apiKey || !genAI) {
    return getFallbackDocumentAnalysis();
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      Act as Saarthi AI Document Assistant for seniors.
      Analyze this text: "${documentText}".
      Return JSON strictly in this format:
      {
        "doctorOrIssuer": "Doctor or Clinic Name",
        "plainEnglishSummary": "2 short sentences explaining the document simply without jargon.",
        "steps": [
          {"stepNumber": 1, "title": "Morning Routine", "instruction": "Take Metformin 1 tablet after breakfast."},
          {"stepNumber": 2, "title": "Night Routine", "instruction": "Take Amlodipine 1 tablet at 8 PM."}
        ],
        "refillDueDays": 28
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (err) {
    console.error('[Gemini Document Error]:', err.message);
    return getFallbackDocumentAnalysis();
  }
}

/**
 * Verifies SMS / Link for Phishing Scams (Trust Shield)
 */
async function verifyScamMessage(messageContent) {
  if (!apiKey || !genAI) {
    return getFallbackScamAnalysis(messageContent);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      Act as Saarthi Trust Shield Scam Analyzer.
      Inspect message: "${messageContent}".
      Return JSON strictly in this format:
      {
        "isSuspicious": true,
        "riskScore": 92,
        "threatLevel": "DANGER_PAUSE",
        "headlineWarning": "PAUSE — This message looks unsafe.",
        "plainTextExplanation": "Creates artificial urgency and contains an unverified bank link.",
        "suspiciousSignals": ["Uses urgent phrase 'suspended today'", "Unverified bit.ly link"],
        "recommendedActions": [
          {"label": "Delete & Block Sender", "actionType": "DELETE_BLOCK"},
          {"label": "Call Anita (Daughter)", "actionType": "CALL_CAREGIVER", "targetPhone": "9876543210"}
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (err) {
    console.error('[Gemini Trust Shield Error]:', err.message);
    return getFallbackScamAnalysis(messageContent);
  }
}

// Fallback logic for offline testing & missing API keys
function getFallbackChatResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('medicine') || q.includes('pill')) {
    return "You have taken your morning Metformin at 8:00 AM. Your blood pressure medication is scheduled for 6:00 PM. Would you like me to set a soft reminder chime for you?";
  }
  if (q.includes('scam') || q.includes('bank') || q.includes('link')) {
    return "Hold on a moment! Real banks will almost never ask you to unlock your account through a text message. Please do not tap that link. Would you like me to inspect it together in Safety Shield?";
  }
  return "Hello Mrs. Sharma! I am Saarthi, your digital companion. I am here to help make your day easy and peaceful. What can I do for you right now?";
}

function getFallbackDocumentAnalysis() {
  return {
    doctorOrIssuer: "Dr. R. Kapoor, MD",
    plainEnglishSummary: "This prescription note lists two daily tablets for blood sugar and blood pressure. Everything is simple and on schedule.",
    steps: [
      { stepNumber: 1, title: "Morning Routine", instruction: "Metformin (1 tablet) after breakfast with water." },
      { stepNumber: 2, title: "Night Routine", instruction: "Amlodipine (1 tablet) at 8:00 PM before sleep." },
      { stepNumber: 3, title: "Pharmacy Refill", instruction: "Refill due in 28 days." }
    ],
    refillDueDays: 28
  };
}

function getFallbackScamAnalysis(content) {
  const isUrgent = content.toLowerCase().includes('urgent') || content.toLowerCase().includes('suspend') || content.toLowerCase().includes('bit.ly');
  return {
    isSuspicious: isUrgent,
    riskScore: isUrgent ? 95 : 15,
    threatLevel: isUrgent ? 'DANGER_PAUSE' : 'SAFE',
    headlineWarning: isUrgent ? "PAUSE — This message looks unsafe." : "This message looks safe.",
    plainTextExplanation: isUrgent ? "Creates artificial urgency and uses a suspicious unverified bank link." : "No suspicious urgency or phishing links detected.",
    suspiciousSignals: isUrgent ? ["Creates panic with 'suspended today'", "Unverified shortened link"] : [],
    recommendedActions: [
      { label: "Delete & Block Sender", actionType: "DELETE_BLOCK" },
      { label: "Call Anita (Daughter)", actionType: "CALL_CAREGIVER", targetPhone: "9876543210" }
    ]
  };
}

module.exports = {
  generateChatResponse,
  simplifyDocumentText,
  verifyScamMessage
};
