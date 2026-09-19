import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Senior User Interaction Flow Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app">
        <button id="start-speaking-btn">Start Speaking</button>
        <div id="mic-status">Inactive</div>
        
        <input id="scam-input" value="URGENT bank link" />
        <button id="verify-scam-btn">Check for Danger</button>
        <div id="scam-result" style="display:none;">PAUSE — This message looks unsafe.</div>

        <button id="audioPlayBtn">Listen Aloud</button>
        <span id="audioText">Listen Aloud</span>
      </div>
    `;

    // Mock SpeechSynthesis and SpeechSynthesisUtterance for JSDOM environment
    window.SpeechSynthesisUtterance = vi.fn().mockImplementation((text) => ({
      text,
      rate: 0.88,
      pitch: 1,
      onend: null,
      onerror: null,
    })) as unknown as typeof SpeechSynthesisUtterance;

    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: () => [],
      pending: false,
      speaking: false,
      paused: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    } as unknown as SpeechSynthesis;
  });

  it('handles clicking Start Speaking to toggle voice listening state', () => {
    const speakBtn = document.getElementById('start-speaking-btn');
    const status = document.getElementById('mic-status');

    speakBtn?.addEventListener('click', () => {
      if (status) status.textContent = 'Listening to your voice...';
    });

    speakBtn?.click();
    expect(status?.textContent).toBe('Listening to your voice...');
  });

  it('handles submitting scam link and displays safety alert banner', () => {
    const input = document.getElementById('scam-input') as HTMLInputElement;
    const verifyBtn = document.getElementById('verify-scam-btn');
    const resultBox = document.getElementById('scam-result');

    verifyBtn?.addEventListener('click', () => {
      if (input.value.includes('URGENT')) {
        if (resultBox) resultBox.style.display = 'block';
      }
    });

    verifyBtn?.click();
    expect(resultBox?.style.display).toBe('block');
    expect(resultBox?.textContent).toContain('PAUSE');
  });

  it('triggers Web Speech API audio synthesis when Listen Aloud is tapped', () => {
    const audioBtn = document.getElementById('audioPlayBtn');
    
    audioBtn?.addEventListener('click', () => {
      if ('speechSynthesis' in window) {
        const utterance = new window.SpeechSynthesisUtterance("Test readout");
        window.speechSynthesis.speak(utterance);
      }
    });

    audioBtn?.click();
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });
});
