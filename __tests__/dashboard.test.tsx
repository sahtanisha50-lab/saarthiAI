import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../src/App';

describe('Saarthi AI Dashboard Unit Tests', () => {
  beforeEach(() => {
    // Mock window.alert to prevent jsdom errors
    window.alert = vi.fn();
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders Saarthi AI title and taglines in header', () => {
    render(<App />);
    const headerTitle = screen.getByRole('heading', { level: 1, name: /Saarthi AI/i });
    expect(headerTitle).toBeInTheDocument();
    expect(screen.getByText(/Your Caring Senior Companion/i)).toBeInTheDocument();
  });

  it('renders all 4 main senior action buttons on dashboard', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Open Document and Prescription Reader/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go to Scam Safety Shield/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Medication Reminders/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Call Family Health Contact/i })).toBeInTheDocument();
  });

  it('renders voice assistant hero button with speak prompt', () => {
    render(<App />);
    const voiceBtn = screen.getByRole('button', { name: /Talk to Saarthi AI Assistant/i });
    expect(voiceBtn).toBeInTheDocument();
    expect(screen.getByText(/TAP HERE TO SPEAK/i)).toBeInTheDocument();
  });

  it('toggles High Contrast Mode when requested by senior user', () => {
    render(<App />);
    const contrastBtn = screen.getByRole('button', { name: /Toggle High Contrast Mode/i });
    expect(contrastBtn).toBeInTheDocument();

    fireEvent.click(contrastBtn);
    expect(screen.getByText(/Standard View/i)).toBeInTheDocument();
  });

  it('triggers emergency SOS alert button click handler', () => {
    render(<App />);
    const sosBtn = screen.getByRole('button', { name: /Emergency SOS button/i });
    expect(sosBtn).toBeInTheDocument();

    fireEvent.click(sosBtn);
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("SOS Emergency Triggered!"));
  });
});
