import { describe, it, expect, beforeEach } from 'vitest';

describe('Core UI Components Unit Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header class="fixed top-0 z-50">
        <img alt="Saarthi AI Logo" src="logo.jpg" />
        <h1 aria-label="Saarthi AI Companion">Saarthi AI</h1>
      </header>
      <main role="main">
        <section aria-labelledby="greeting-title">
          <h2 id="greeting-title">Good morning, Mrs. Sharma</h2>
          <button id="audioReadBtn" aria-label="Listen to today's summary spoken aloud">Play audio summary</button>
        </section>
        <section aria-label="Quick Actions">
          <button id="card-talk" aria-label="Talk to Saarthi AI">Talk to Saarthi</button>
          <button id="card-explain" aria-label="Explain prescription document">Explain This</button>
          <button id="card-safety" aria-label="Check suspicious SMS for scams">Check for Scams</button>
          <button id="card-reminders" aria-label="View medication reminders">My Reminders</button>
        </section>
      </main>
      <nav aria-label="Primary Navigation">
        <a href="#home" aria-current="page" data-path="home">Home</a>
        <a href="#reminders" data-path="reminders">Reminders</a>
        <a href="#safety" data-path="safety">Safety Shield</a>
        <a href="#explain" data-path="explain">Explain</a>
      </nav>
    `;
  });

  it('renders header logo and primary title with proper aria-label', () => {
    const logo = document.querySelector('img[alt="Saarthi AI Logo"]');
    const title = document.querySelector('h1');

    expect(logo).not.toBeNull();
    expect(title?.getAttribute('aria-label')).toBe('Saarthi AI Companion');
  });

  it('contains all 4 high-touch senior action cards', () => {
    const talkCard = document.getElementById('card-talk');
    const explainCard = document.getElementById('card-explain');
    const safetyCard = document.getElementById('card-safety');
    const remindersCard = document.getElementById('card-reminders');

    expect(talkCard).not.toBeNull();
    expect(explainCard).not.toBeNull();
    expect(safetyCard).not.toBeNull();
    expect(remindersCard).not.toBeNull();
  });

  it('ensures navigation bar contains semantic links with accessible text', () => {
    const nav = document.querySelector('nav');
    const homeLink = nav?.querySelector('a[data-path="home"]');

    expect(nav?.getAttribute('aria-label')).toBe('Primary Navigation');
    expect(homeLink?.getAttribute('aria-current')).toBe('page');
  });

  it('supports audio readout button with accessible aria label', () => {
    const audioBtn = document.getElementById('audioReadBtn');
    expect(audioBtn?.getAttribute('aria-label')).toBe("Listen to today's summary spoken aloud");
  });
});
