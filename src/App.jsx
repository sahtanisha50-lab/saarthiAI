import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Sun, Volume2, ShieldCheck, FileText, 
  Clock, Plus, CheckCircle2, AlertTriangle, X, Play, 
  Pause, Send, Sparkles, ChevronRight, PhoneCall, Calendar,
  RefreshCw, Check, Upload, HelpCircle, HeartHandshake, Eye
} from 'lucide-react';

/**
 * @typedef {Object} ScheduleItem
 * @property {string} id
 * @property {string} time
 * @property {string} title
 * @property {string} category - 'med' | 'call' | 'walk' | 'other'
 * @property {boolean} completed
 */

const INITIAL_SCHEDULE = [
  { id: '1', time: '08:00 AM', title: 'Morning Blood Pressure Medicine (Amlodipine 5mg)', category: 'med', completed: true },
  { id: '2', time: '11:00 AM', title: 'Video Call with Granddaughter (Riya)', category: 'call', completed: false },
  { id: '3', time: '01:30 PM', title: 'Take Post-Lunch Diabetes Pill (Metformin 500mg)', category: 'med', completed: false },
  { id: '4', time: '05:00 PM', title: 'Evening Park Walk & Breathing Exercises', category: 'walk', completed: false },
];

const PRESET_VOICE_QUESTIONS = [
  "How do I take my meds today?",
  "Check a suspicious SMS message for scam",
  "Read today's schedule aloud to me",
  "Call my emergency contact"
];

export default function App() {
  // Schedule state
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('');

  // Voice Modal state
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState([
    { sender: 'ai', text: 'Namaste Mrs. Sharma! I am Saarthi. How can I assist you today?' }
  ]);
  const [voiceInput, setVoiceInput] = useState('');

  // Document Scanner Drawer state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedDoc, setScannedDoc] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [parsedSummary, setParsedSummary] = useState(null);

  // Scam Shield state
  const [scamText, setScamText] = useState('');
  const [scamAnalysis, setScamAnalysis] = useState(null);
  const [isAnalyzingScam, setIsAnalyzingScam] = useState(false);

  // Audio Player state
  const [isPlayingAudioSummary, setIsPlayingAudioSummary] = useState(false);

  // Text size preferences
  const [highContrast, setHighContrast] = useState(false);

  const handleStartVoice = () => {
    setIsListening(true);
    // Simulate speech-to-text input after short delay
    setTimeout(() => {
      setIsListening(false);
      handleSendVoiceMessage("What is my schedule for this afternoon?");
    }, 2500);
  };

  const handleSendVoiceMessage = (textToSend) => {
    const query = textToSend || voiceInput;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setVoiceMessages(prev => [...prev, userMsg]);
    if (!textToSend) setVoiceInput('');

    // Generate simulated AI Response or Server Call
    setTimeout(() => {
      let replyText = "I have checked your details. You have lunch medicines at 1:30 PM and a park walk at 5:00 PM.";
      const lower = query.toLowerCase();
      if (lower.includes('med')) {
        replyText = "You need to take Metformin 500mg after lunch at 1:30 PM with warm water.";
      } else if (lower.includes('scam') || lower.includes('message')) {
        replyText = "You can open the Scam Shield Guard from the main screen and paste the text. I will check if it is safe!";
      } else if (lower.includes('call') || lower.includes('riya')) {
        replyText = "Your video call with Riya is scheduled for 11:00 AM. I will remind you 5 minutes before!";
      }
      setVoiceMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    }, 1000);
  };

  const handleSampleScan = () => {
    setIsScanning(true);
    setScannedDoc(null);
    setParsedSummary(null);

    setTimeout(() => {
      setIsScanning(false);
      setScannedDoc("PRESCRIPTION: Dr. Mehta | Patient: Mrs. Sharma | Med: Atorvastatin 10mg - 1 Pill before sleep at 9:00 PM.");
      setParsedSummary({
        medicine: "Atorvastatin (10mg)",
        instruction: "Take 1 pill every night right before going to sleep at 9:00 PM.",
        purpose: "Helps keep your cholesterol levels healthy.",
        time: "09:00 PM"
      });
    }, 1800);
  };

  const handleSyncToSchedule = () => {
    if (!parsedSummary) return;
    const newItem = {
      id: Date.now().toString(),
      time: parsedSummary.time,
      title: `Take ${parsedSummary.medicine} - ${parsedSummary.instruction}`,
      category: 'med',
      completed: false
    };
    setSchedule(prev => [...prev, newItem].sort((a,b) => a.time.localeCompare(b.time)));
    alert("✅ Success! New reminder synced to your schedule.");
    setIsScannerOpen(false);
    setScannedDoc(null);
    setParsedSummary(null);
  };

  const handleAnalyzeScam = () => {
    if (!scamText.trim()) return;
    setIsAnalyzingScam(true);
    setScamAnalysis(null);

    setTimeout(() => {
      setIsAnalyzingScam(false);
      const text = scamText.toLowerCase();
      if (text.includes('bank') || text.includes('urgent') || text.includes('otp') || text.includes('winner') || text.includes('click link')) {
        setScamAnalysis({
          status: 'DANGER',
          score: 92,
          reason: "SUSPICIOUS SCAM DETECTED! Banks never ask for OTPs or urgent payments via SMS link. Do not click or reply.",
          action: "Do not transfer money or click any link. Call your family or bank directly."
        });
      } else {
        setScamAnalysis({
          status: 'SAFE',
          score: 12,
          reason: "Looks like a normal message from a contact or verified updates.",
          action: "No immediate threat detected. Still practice safe sharing."
        });
      }
    }, 1200);
  };

  const toggleScheduleComplete = (id) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-yellow-300' : 'bg-[#FAF8F5] text-slate-900'} font-sans antialiased transition-colors duration-200`}>
      
      {/* HEADER */}
      <header className="border-b-2 border-slate-200 bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-emerald-700 rounded-xl flex items-center justify-center text-white shadow-md">
              <HeartHandshake className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saarthi AI</h1>
              <p className="text-sm font-semibold text-emerald-800">Your Caring Senior Companion</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setHighContrast(!highContrast)}
              aria-label="Toggle High Contrast Mode for easier reading"
              className="px-4 py-2.5 rounded-lg border-2 border-slate-300 bg-slate-50 hover:bg-slate-100 font-bold text-slate-800 flex items-center space-x-2 focus:ring-4 focus:ring-blue-600 focus:outline-none transition-all"
            >
              <Eye className="w-5 h-5" aria-hidden="true" />
              <span>{highContrast ? "Standard View" : "High Contrast"}</span>
            </button>

            <button
              onClick={() => alert("SOS Emergency Triggered! Alerting your emergency contact (Rahul: +91 98765 43210).")}
              aria-label="Emergency SOS button to alert family"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg shadow-md flex items-center space-x-2 focus:ring-4 focus:ring-red-400 focus:outline-none animate-pulse"
            >
              <PhoneCall className="w-5 h-5" aria-hidden="true" />
              <span>EMERGENCY SOS</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN */}
          <section className="lg:col-span-5 space-y-6" aria-label="Daily Overview and Voice Hero">
            
            {/* Greeting & Weather Widget */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                    Saturday, Sep 19
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 mt-2">Good morning, Mrs. Sharma</h2>
                  <p className="text-lg text-slate-700 font-medium mt-1">Ready for a comfortable and safe day ahead?</p>
                </div>
                <div className="flex flex-col items-center bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <Sun className="w-8 h-8 text-amber-600" aria-hidden="true" />
                  <span className="text-xl font-bold text-slate-900 mt-1">24°C</span>
                  <span className="text-xs font-semibold text-slate-600">Sunny</span>
                </div>
              </div>

              {/* Audio Daily Summary Player */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsPlayingAudioSummary(!isPlayingAudioSummary)}
                      aria-label={isPlayingAudioSummary ? "Pause Morning Summary" : "Play Morning Summary Aloud"}
                      className="w-12 h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center shadow-md focus:ring-4 focus:ring-blue-400 focus:outline-none transition-transform active:scale-95"
                    >
                      {isPlayingAudioSummary ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                    <div>
                      <p className="font-bold text-slate-900 text-base">Listen to Morning Briefing</p>
                      <p className="text-sm text-slate-600">1 min 20 sec summary of your day</p>
                    </div>
                  </div>
                  {isPlayingAudioSummary && (
                    <span className="flex items-center space-x-1 text-emerald-700 font-bold text-sm animate-pulse">
                      <Volume2 className="w-5 h-5" />
                      <span>Playing...</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Voice Hero Card */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-7 text-white shadow-xl border-2 border-emerald-700 relative overflow-hidden">
              <div className="relative z-10">
                <span className="inline-flex items-center space-x-2 bg-emerald-600/60 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-emerald-400/40">
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>AI Voice Assistant</span>
                </span>

                <h3 className="text-2xl font-black mt-3">Speak with Saarthi</h3>
                <p className="text-emerald-100 text-base mt-1 font-medium leading-relaxed">
                  Have a question? Tap the big mic below to talk in plain English or Hindi.
                </p>

                <div className="mt-6 flex flex-col items-center justify-center">
                  <button
                    onClick={() => { setIsVoiceOpen(true); handleStartVoice(); }}
                    aria-label="Talk to Saarthi AI Assistant"
                    className="group relative w-24 h-24 bg-white text-emerald-800 rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-50 focus:ring-8 focus:ring-emerald-300 focus:outline-none transition-transform active:scale-95"
                  >
                    <span className="absolute inset-0 rounded-full bg-white opacity-40 animate-ping"></span>
                    <Mic className="w-12 h-12 text-emerald-800 group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="text-center font-extrabold text-lg mt-4 tracking-wide text-white">
                    TAP HERE TO SPEAK
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200 font-semibold">
                  <span>Supported: English, Hindi</span>
                  <span>Press spacebar or tap button</span>
                </div>
              </div>
            </div>

          </section>

          {/* RIGHT COLUMN */}
          <section className="lg:col-span-7 space-y-6" aria-label="Action Cards and Schedule">
            
            {/* Intent Cards Grid */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-4">What would you like to do?</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Intent Card 1: Document Scanner */}
                <button
                  onClick={() => setIsScannerOpen(true)}
                  aria-label="Open Document and Prescription Reader"
                  className="p-5 text-left rounded-xl border-2 border-slate-200 bg-emerald-50/50 hover:bg-emerald-100/60 hover:border-emerald-500 focus:ring-4 focus:ring-emerald-400 focus:outline-none transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-900">Scan & Read Document</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1">Read medicine prescriptions, bills & letters in simple words.</p>
                </button>

                {/* Intent Card 2: Scam Safety Shield */}
                <button
                  onClick={() => {
                    const el = document.getElementById('scam-shield-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-label="Go to Scam Safety Shield"
                  className="p-5 text-left rounded-xl border-2 border-slate-200 bg-amber-50/50 hover:bg-amber-100/60 hover:border-amber-500 focus:ring-4 focus:ring-amber-400 focus:outline-none transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-900">Scam Shield Guard</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1">Check if suspicious SMS or messages are safe before clicking.</p>
                </button>

                {/* Intent Card 3: Medication Reminders */}
                <button
                  onClick={() => {
                    const el = document.getElementById('schedule-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-label="View Medication Reminders"
                  className="p-5 text-left rounded-xl border-2 border-slate-200 bg-blue-50/50 hover:bg-blue-100/60 hover:border-blue-500 focus:ring-4 focus:ring-blue-400 focus:outline-none transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-900">Medication Schedule</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1">View your timely pill reminders and daily activities.</p>
                </button>

                {/* Intent Card 4: Family Health Call */}
                <button
                  onClick={() => alert("Calling your primary caregiver: Rahul Sharma (+91 98765 43210)...")}
                  aria-label="Call Family Health Contact"
                  className="p-5 text-left rounded-xl border-2 border-slate-200 bg-purple-50/50 hover:bg-purple-100/60 hover:border-purple-500 focus:ring-4 focus:ring-purple-400 focus:outline-none transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-700 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-purple-900">Family Health Call</h3>
                  <p className="text-sm text-slate-600 font-medium mt-1">One-tap voice or video call with family and doctors.</p>
                </button>

              </div>
            </div>

            {/* Today's Schedule Timeline Section */}
            <div id="schedule-section" className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-emerald-800" />
                  <h2 className="text-2xl font-black text-slate-900">Today's Schedule</h2>
                </div>
                <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {schedule.filter(s => s.completed).length} of {schedule.length} Completed
                </span>
              </div>

              <div className="space-y-3">
                {schedule.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                      item.completed 
                        ? 'bg-slate-50 border-slate-200 opacity-75' 
                        : 'bg-white border-slate-300 hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleScheduleComplete(item.id)}
                        aria-label={`Mark task '${item.title}' as ${item.completed ? 'incomplete' : 'complete'}`}
                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center focus:ring-4 focus:ring-emerald-400 focus:outline-none transition-colors ${
                          item.completed ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-slate-400 hover:border-emerald-600 bg-white'
                        }`}
                      >
                        {item.completed && <Check className="w-5 h-5 stroke-[3]" />}
                      </button>
                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.time}
                        </span>
                        <p className={`text-lg font-bold mt-1 ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Scam Shield Guard Section */}
            <div id="scam-shield-section" className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Scam Safety Shield</h2>
                  <p className="text-sm font-semibold text-slate-600">Paste any message below to check if it is fake or dangerous.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="scam-input-text" className="sr-only">Paste message to analyze</label>
                <textarea
                  id="scam-input-text"
                  rows={3}
                  value={scamText}
                  onChange={(e) => setScamText(e.target.value)}
                  placeholder="Paste SMS here (e.g., 'URGENT: Your bank account will be blocked today! Click link to update OTP...')"
                  className="w-full p-4 rounded-xl border-2 border-slate-300 text-slate-900 font-medium focus:ring-4 focus:ring-amber-400 focus:border-amber-500 focus:outline-none text-base"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setScamText("URGENT: Your Electricity power will be cut off tonight at 9:30 PM. Call immediate officer on 9812345678 to clear bill.")}
                    className="text-sm font-bold text-slate-600 underline hover:text-slate-900 focus:ring-2 focus:ring-slate-400 rounded px-1"
                  >
                    Try Sample Scam Message
                  </button>

                  <button
                    onClick={handleAnalyzeScam}
                    disabled={isAnalyzingScam || !scamText.trim()}
                    aria-label="Check message for safety risk"
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-extrabold rounded-xl shadow-md focus:ring-4 focus:ring-amber-300 focus:outline-none flex items-center space-x-2 transition-all"
                  >
                    {isAnalyzingScam ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Check Safety Now</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Scam Result Box */}
                {scamAnalysis && (
                  <div className={`p-5 rounded-xl border-2 mt-4 transition-all ${
                    scamAnalysis.status === 'DANGER'
                      ? 'bg-red-50 border-red-300 text-red-950'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {scamAnalysis.status === 'DANGER' ? (
                        <AlertTriangle className="w-7 h-7 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="text-xl font-black">
                          {scamAnalysis.status === 'DANGER' ? "⚠️ SCAM RISK DETECTED!" : "✅ MESSAGE IS SAFE"}
                        </h4>
                        <p className="text-base font-bold mt-1 leading-relaxed">{scamAnalysis.reason}</p>
                        <p className="text-sm font-extrabold mt-2 underline">{scamAnalysis.action}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </section>
        </div>
      </main>

      {/* VOICE MODAL */}
      {isVoiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-4 border-emerald-700 shadow-2xl max-w-2xl w-full p-6 space-y-4 relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-700 text-white rounded-lg flex items-center justify-center">
                  <Mic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Talking to Saarthi AI</h3>
                  <p className="text-xs font-bold text-emerald-700">Empathetic Voice & Text Assistant</p>
                </div>
              </div>

              <button
                onClick={() => setIsVoiceOpen(false)}
                aria-label="Close Voice Assistant Dialog"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-4 focus:ring-slate-400 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Voice Listening Animation Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-emerald-600'}`}></div>
                <span className="font-extrabold text-slate-900 text-base">
                  {isListening ? "Listening to your voice..." : "Saarthi is ready to listen"}
                </span>
              </div>
              <button
                onClick={handleStartVoice}
                aria-label="Re-activate Microphone"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-sm flex items-center space-x-1 focus:ring-4 focus:ring-emerald-300 focus:outline-none"
              >
                <Mic className="w-4 h-4" />
                <span>{isListening ? "Listening..." : "Tap to Speak"}</span>
              </button>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-50 rounded-xl border border-slate-200 min-h-[220px]">
              {voiceMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl max-w-[85%] text-base font-bold leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-700 text-white ml-auto rounded-br-none shadow-sm'
                      : 'bg-white text-slate-900 border-2 border-slate-200 mr-auto rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Preset Quick Questions */}
            <div className="space-y-2">
              <p className="text-xs font-black uppercase text-slate-500 tracking-wider">Tap a quick question:</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_VOICE_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendVoiceMessage(q)}
                    aria-label={`Ask preset question: ${q}`}
                    className="text-xs font-extrabold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 border border-slate-300 text-slate-800 px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Text input fallback */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={voiceInput}
                onChange={(e) => setVoiceInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendVoiceMessage()}
                placeholder="Or type your message here..."
                aria-label="Type message for Saarthi"
                className="flex-1 p-3 rounded-xl border-2 border-slate-300 text-slate-900 font-bold focus:ring-4 focus:ring-emerald-400 focus:outline-none"
              />
              <button
                onClick={() => handleSendVoiceMessage()}
                aria-label="Send Message"
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl focus:ring-4 focus:ring-emerald-400 focus:outline-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DOCUMENT SCANNER MODAL */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-4 border-emerald-700 shadow-2xl max-w-2xl w-full p-6 space-y-5 relative">
            
            <div className="flex items-center justify-between border-b pb-4 border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-700 text-white rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Scan Prescription or Document</h3>
                  <p className="text-xs font-bold text-slate-600">Simulate reading doctor prescriptions in easy words</p>
                </div>
              </div>

              <button
                onClick={() => setIsScannerOpen(false)}
                aria-label="Close Document Reader Modal"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-4 focus:ring-slate-400 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 bg-slate-50 p-6 rounded-xl text-center space-y-3">
                <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-base font-bold text-slate-800">Tap below to scan a sample doctor prescription</p>
                <button
                  onClick={handleSampleScan}
                  disabled={isScanning}
                  aria-label="Scan Sample Doctor Prescription"
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-extrabold rounded-xl shadow-md focus:ring-4 focus:ring-emerald-400 focus:outline-none transition-all inline-flex items-center space-x-2"
                >
                  {isScanning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  <span>{isScanning ? "Scanning & Parsing..." : "Load Sample Prescription"}</span>
                </button>
              </div>

              {parsedSummary && (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-xl space-y-3 animate-fade-in">
                  <h4 className="text-lg font-black text-emerald-950 flex items-center space-x-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                    <span>Plain English Explanation (4th-Grade Level)</span>
                  </h4>
                  
                  <div className="space-y-2 text-slate-900 font-bold text-base">
                    <p><span className="text-slate-600">Medicine Name:</span> {parsedSummary.medicine}</p>
                    <p><span className="text-slate-600">How to take:</span> {parsedSummary.instruction}</p>
                    <p><span className="text-slate-600">Why taking:</span> {parsedSummary.purpose}</p>
                  </div>

                  <button
                    onClick={handleSyncToSchedule}
                    aria-label="Add scanned medicine to schedule"
                    className="w-full mt-2 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl shadow focus:ring-4 focus:ring-emerald-400 focus:outline-none flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Sync & Add Reminder to Today's Schedule</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-600 font-bold space-y-2 md:space-y-0">
          <p>© 2026 Saarthi AI Senior Companion. WCAG AAA Compliant Interface.</p>
          <div className="flex space-x-6">
            <button onClick={() => alert("Caregiver Contact: Rahul (+91 98765 43210)")} className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1">Caregiver Hotline</button>
            <button onClick={() => alert("High Legibility Font Mode Active.")} className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1">Accessibility Help</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
