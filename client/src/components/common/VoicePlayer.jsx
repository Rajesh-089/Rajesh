import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function VoicePlayer({ text, language = 'en' }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
  }, []);

  const handleToggleSpeak = () => {
    if (!supported || !text) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate locale
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'kn') {
      utterance.lang = 'kn-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
        speaking
          ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
          : 'bg-white text-forest-700 hover:bg-forest-50 border border-forest-200'
      }`}
      title={speaking ? 'Stop Audio' : 'Listen to Advisory'}
    >
      {speaking ? (
        <>
          <VolumeX className="w-4 h-4 text-amber-700" />
          <span>Stop Listening</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-forest-600" />
          <span>Listen (ಧ್ವನಿ / सुनें)</span>
        </>
      )}
    </button>
  );
}
