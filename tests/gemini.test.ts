import { describe, it, expect } from 'vitest';
import { generateChatResponse, simplifyDocumentText, verifyScamMessage } from '../server/services/geminiService';

describe('Gemini API Integration & Persona Constraints Unit Tests', () => {
  it('returns Saarthi persona response for medication queries', async () => {
    const response = await generateChatResponse('When should I take my medicine?');
    
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(10);
    expect(response.toLowerCase()).toContain('metformin');
  });

  it('correctly simplifies prescription notes into plain words', async () => {
    const docText = 'Rx: Metformin 500mg tab, Amlodipine 5mg tab. Refill in 28 days.';
    const result = await simplifyDocumentText(docText);

    expect(result).toHaveProperty('doctorOrIssuer');
    expect(result).toHaveProperty('plainEnglishSummary');
    expect(Array.isArray(result.steps)).toBe(true);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('detects phishing urgency and scam threats in SMS messages', async () => {
    const scamText = 'URGENT: Your State Bank account will be suspended today due to KYC. Click http://bit.ly/bank-kyc-update immediately.';
    const scamResult = await verifyScamMessage(scamText);

    expect(scamResult.isSuspicious).toBe(true);
    expect(scamResult.threatLevel).toBe('DANGER_PAUSE');
    expect(scamResult.headlineWarning).toContain('PAUSE');
    expect(Array.isArray(scamResult.recommendedActions)).toBe(true);
  });

  it('handles empty inputs safely without crashing', async () => {
    const safeResult = await verifyScamMessage('Hello how are you');
    expect(safeResult).toHaveProperty('isSuspicious');
    expect(typeof safeResult.isSuspicious).toBe('boolean');
  });
});
