/**
 * @file saarthi.ts
 * @description Core TypeScript Data Definitions and Schema Contracts for Saarthi AI.
 * 
 * PROBLEM STATEMENT ALIGNMENT:
 * "GenAI-powered senior citizen daily companion (Saarthi AI) providing voice/vision assistance,
 * scam defense, document simplification, and medication reminders."
 */

/**
 * Senior User Context representing user state, accessibility preferences, and care circle connections.
 */
export interface SeniorUserContext {
  userId: string;
  name: string;
  age: number;
  speechRate: number; // e.g. 0.85 for slower pace
  highContrastMode: boolean;
  caregiverName: string;
  caregiverPhone: string;
  languagePreference: 'en-US' | 'hi-IN';
}

/**
 * Medication Reminder entity generated automatically via Gemini vision scan or manual entry.
 */
export interface MedicationReminder {
  id: string;
  medicineName: string;
  dosage: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  scheduledTime: string; // e.g. "08:00 AM"
  instructions: string;
  isTaken: boolean;
  takenAt?: string;
  category: 'medication' | 'doctor_appointment' | 'hydration';
}

/**
 * Result structure returned by Gemini Vision Document Simplification Pipeline.
 */
export interface DocumentAnalysisResult {
  documentType: 'prescription' | 'medical_bill' | 'official_letter' | 'general';
  doctorOrIssuer: string;
  plainEnglishSummary: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    instruction: string;
    timingNote?: string;
  }>;
  createdReminders: MedicationReminder[];
  refillDueDays?: number;
  careCircleNotified: boolean;
}

/**
 * Risk Assessment Result returned by Trust Shield Scam Detection Service.
 */
export interface ScamVerificationResult {
  isSuspicious: boolean;
  riskScore: number; // 0 to 100
  threatLevel: 'SAFE' | 'CAUTION' | 'DANGER_PAUSE';
  headlineWarning: string;
  plainTextExplanation: string;
  suspiciousSignals: string[];
  recommendedActions: Array<{
    label: string;
    actionType: 'DELETE_BLOCK' | 'CALL_CAREGIVER' | 'IGNORE';
    targetPhone?: string;
  }>;
}

/**
 * Voice & Chatbot Query Request parameters sent to backend server route /api/chat.
 */
export interface VoiceQueryRequest {
  userSpeechInput: string;
  language: 'en-US' | 'hi-IN';
  seniorUserContext?: Partial<SeniorUserContext>;
}

/**
 * Standard API Response envelope for server routes.
 */
export interface GeminiApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  voiceTextPrompt?: string; // Text formatted for Web Speech API TTS
  timestamp: string;
}
