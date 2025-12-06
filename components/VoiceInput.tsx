
import React, { useState, useEffect } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // @ts-ignore - WebkitSpeechRecognition not in standard TS lib
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const handleToggleListen = () => {
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Try Chrome/Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false); // Stop handled by onend
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech error", event);
        setIsListening(false);
        setError("Mic Error");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setError("Failed");
    }
  };

  return (
    <button
      onClick={handleToggleListen}
      disabled={disabled}
      className={`p-2 rounded-full transition-all duration-300 relative group ${
        isListening 
        ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500' 
        : 'hover:bg-gray-700 text-gray-400 hover:text-white'
      }`}
      title={isListening ? "Listening..." : "Voice Input"}
    >
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      
      {/* Mic Icon */}
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      
      {error && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-900 text-red-200 text-[9px] px-2 py-1 rounded whitespace-nowrap">{error}</span>}
    </button>
  );
};
