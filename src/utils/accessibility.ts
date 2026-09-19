/**
 * Accessibility and Web Speech API Helper Utilities for Saarthi AI.
 * Ensures WCAG AAA compliance and senior-first ease of use.
 */

/**
 * Strips HTML tags for safe screen reader utterance
 */
export function stripHtml(html: string): string {
  if (typeof document === 'undefined') return html.replace(/<[^>]*>?/gm, '');
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

/**
 * Announces dynamic status messages to screen readers using aria-live region.
 */
export function announceToScreenReader(message: string): void {
  if (typeof document === 'undefined') return;

  let liveRegion = document.getElementById('saarthi-aria-live');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'saarthi-aria-live';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = message;
}

/**
 * Speaks text using browser SpeechSynthesis API at senior-friendly comfortable pace (rate ~ 0.88).
 */
export function speakSeniorVoice(
  text: string,
  rate = 0.88,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel(); // Clear pending utterances
  const cleanText = stripHtml(text);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = rate;
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Stops any ongoing SpeechSynthesis audio
 */
export function stopSeniorVoice(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
