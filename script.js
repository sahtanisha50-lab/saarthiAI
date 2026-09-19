"use strict";

document.addEventListener('DOMContentLoaded', () => {
  // Update Clock & Date
  const clockEl = document.getElementById('clock');
  const dateEl = document.getElementById('date');

  function updateTime() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dateEl.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  }
  setInterval(updateTime, 1000);
  updateTime();

  // Chat Interface Logic
  const chatWindow = document.getElementById('chat-window');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const micBtn = document.getElementById('mic-btn');
  const promptChips = document.querySelectorAll('.prompt-chip');

  // Simple Mock AI Responses based on Saarthi Persona
  const mockResponses = [
    { 
      keywords: ["bigger", "text", "large", "font"], 
      response: "I can help with that! Here is the easiest way to do it:<br><br>1. Tap the Gear icon on your screen called <strong>Settings</strong>.<br>2. Tap on <strong>Display</strong>.<br>3. Move the slider to make the text as large as you like.<br><br>Would you like me to walk you through this step-by-step?" 
    },
    { 
      keywords: ["bank", "locked", "link", "scam", "suspicious"], 
      response: "Please do not tap that link! Banks will almost never ask you to unlock your account through a text message. This looks like a scam message designed to trick you. Would you like to check this message using our Scam Shield tool?" 
    },
    { 
      keywords: ["weather", "rain", "sun"], 
      response: "It is a beautiful 72 degrees and sunny outside today. Would you like me to set a reminder for a short walk?" 
    },
    { 
      keywords: ["call", "john", "family"], 
      response: "I have saved a reminder for you to call John at 5 PM. I will gently remind you when it is time. Is there anyone else you would like to call today?" 
    },
    { 
      keywords: ["joke", "funny"], 
      response: "Why did the scarecrow win an award? Because he was outstanding in his field! Would you like to hear another one?" 
    },
    { 
      keywords: ["medication", "pill"], 
      response: "Let's check your schedule. You need to take your Blood Pressure medication after dinner around 6:30 PM. Would you like me to set an alarm for you?" 
    },
    { 
      keywords: ["default"], 
      response: "Hello! I am Saarthi, your digital companion. I am here to help make things simple and easy for you. How can I help you today?" 
    }
  ];

  function getAIResponse(text) {
    text = text.toLowerCase();
    for (const rule of mockResponses) {
      if (rule.keywords.some(kw => text.includes(kw))) {
        return rule.response;
      }
    }
    return mockResponses.find(r => r.keywords.includes("default")).response;
  }

  function stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;

    let innerHTML = `<div class="message-content">${text}</div>`;
    
    // Add Read Aloud button for AI messages
    if (sender === 'ai') {
      const cleanText = stripHtml(text).replace(/'/g, "\\'").replace(/"/g, "&quot;");
      innerHTML += `<button class="read-aloud-btn" aria-label="Read message aloud" onclick="speakText('${cleanText}')"><i class="fa-solid fa-volume-high"></i></button>`;
    }

    msgDiv.innerHTML = innerHTML;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    if (sender === 'ai') {
      speakText(stripHtml(text)); // Auto speak new AI responses
    }
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getAIResponse(text);
      appendMessage(response, 'ai');
    }, 1000);
  }

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chatInput.value = chip.textContent;
      handleSend();
    });
  });

  // Web Speech API for Text-to-Speech
  window.speakText = function(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for seniors
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Mock Voice Input (Speech-to-Text)
  let isListening = false;
  micBtn.addEventListener('click', () => {
    if (isListening) return;
    
    isListening = true;
    micBtn.classList.add('listening');
    chatInput.placeholder = "Listening...";
    
    // Simulate Speech Recognition delay
    setTimeout(() => {
      isListening = false;
      micBtn.classList.remove('listening');
      chatInput.placeholder = "Type your question here...";
      chatInput.value = "What is the weather today?";
      handleSend();
    }, 2500);
  });

  // Modals and Quick Actions
  const modal = document.getElementById('tool-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  function openModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;
    modal.classList.add('active');
  }

  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Simplify Document
  document.getElementById('btn-simplify').addEventListener('click', () => {
    openModal("Simplify Document", \`
      <div class="form-group">
        <label>Paste complex text here (e.g. medical bill, legal notice):</label>
        <textarea id="simplify-input" rows="6" placeholder="Paste your text here..."></textarea>
      </div>
      <button class="btn-large" id="run-simplify">Simplify It For Me</button>
      <div id="simplify-result" class="result-box">
        <strong>Simple Summary:</strong><br>
        This letter says you need to renew your vehicle registration by October 15th. The cost is $120. You can pay online or by mail.
      </div>
    \`);

    document.getElementById('run-simplify').addEventListener('click', (e) => {
      const input = document.getElementById('simplify-input').value;
      if (input.trim()) {
        e.target.textContent = "Processing...";
        setTimeout(() => {
          e.target.textContent = "Simplify It For Me";
          const resBox = document.getElementById('simplify-result');
          resBox.style.display = 'block';
          speakText("This letter says you need to renew your vehicle registration by October 15th. The cost is $120. You can pay online or by mail.");
        }, 1500);
      }
    });
  });

  // Scam Checker
  document.getElementById('btn-scam').addEventListener('click', () => {
    openModal("Scam Checker", \`
      <div class="form-group">
        <label>Paste the suspicious email, text message, or website here:</label>
        <textarea id="scam-input" rows="6" placeholder="Example: You have won $1,000,000! Click here to claim your prize..."></textarea>
      </div>
      <button class="btn-large" id="run-scam" style="background: var(--danger-red);">Check for Danger</button>
      <div id="scam-result" class="result-box error-box">
        <strong style="color: var(--danger-red);"><i class="fa-solid fa-triangle-exclamation"></i> Warning: Likely a Scam</strong><br>
        This message creates fake urgency and asks you to click an unknown link. <strong>Do not click it.</strong> Delete the message.
      </div>
    \`);

    document.getElementById('run-scam').addEventListener('click', (e) => {
      const input = document.getElementById('scam-input').value;
      if (input.trim()) {
        e.target.textContent = "Analyzing...";
        setTimeout(() => {
          e.target.textContent = "Check for Danger";
          const resBox = document.getElementById('scam-result');
          resBox.style.display = 'block';
          speakText("Warning. This is likely a scam. This message creates fake urgency and asks you to click an unknown link. Do not click it. Delete the message.");
        }, 1500);
      }
    });
  });

  // Medications
  document.getElementById('btn-meds').addEventListener('click', () => {
    openModal("Daily Medications", \`
      <div class="reminders-list" style="padding: 0; max-height: 250px;">
        <div class="reminder-item">
          <div class="reminder-time">8:00 AM</div>
          <div class="reminder-text">Lisinopril (Blood Pressure) - 1 Pill</div>
          <div class="reminder-status"><i class="fa-solid fa-check-circle" style="color: var(--success-green);"></i></div>
        </div>
        <div class="reminder-item">
          <div class="reminder-time">1:00 PM</div>
          <div class="reminder-text">Vitamin D - 1 Pill</div>
          <div class="reminder-status"><i class="fa-solid fa-check-circle" style="color: var(--success-green);"></i></div>
        </div>
        <div class="reminder-item">
          <div class="reminder-time">6:30 PM</div>
          <div class="reminder-text">Atorvastatin (Cholesterol) - 1 Pill</div>
          <div class="reminder-status pending"><i class="fa-regular fa-clock"></i></div>
        </div>
      </div>
      <br>
      <button class="btn-large" onclick="alert('Medication marked as taken!')">Mark Evening Meds as Taken</button>
    \`);
  });

  // Call Family
  document.getElementById('btn-call').addEventListener('click', () => {
    openModal("Call Family", \`
      <div class="quick-actions-grid" style="margin-bottom: 1rem;">
        <button class="action-card color-blue" onclick="alert('Calling Daughter (Sarah)...')">
          <div class="card-icon" style="background: url('https://i.pravatar.cc/150?img=5') center/cover;"></div>
          <h4>Sarah (Daughter)</h4>
        </button>
        <button class="action-card color-blue" onclick="alert('Calling Son (Michael)...')">
          <div class="card-icon" style="background: url('https://i.pravatar.cc/150?img=11') center/cover;"></div>
          <h4>Michael (Son)</h4>
        </button>
      </div>
    \`);
  });

});
