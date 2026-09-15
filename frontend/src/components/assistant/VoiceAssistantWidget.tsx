import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { apiRequest } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

type VoiceState = 'ready' | 'listening' | 'processing' | 'speaking' | 'error';

interface VoiceAssistantWidgetProps {
  onNewMessage?: (role: 'user' | 'assistant', text: string, sources?: string[], suggested?: string[]) => void;
}

export const VoiceAssistantWidget: React.FC<VoiceAssistantWidgetProps> = ({ onNewMessage }) => {
  const { t, i18n } = useTranslation();
  const { language } = useAuthStore();
  const [voiceState, setVoiceState] = useState<VoiceState>('ready');
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Select speech language
      if (i18n.language === 'hi') {
        recognition.lang = 'hi-IN';
      } else if (i18n.language === 'mr') {
        recognition.lang = 'mr-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setVoiceState('listening');
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setVoiceState('error');
          setErrorMessage('Microphone not recognized or access denied. You can type your query below.');
        } else {
          setVoiceState('ready');
        }
      };

      recognition.onend = () => {
        // Will be triggered when user finishes speaking
        setVoiceState((prev) => (prev === 'listening' ? 'processing' : prev));
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [i18n.language]);

  // When transcript completes and state moves to processing
  useEffect(() => {
    if (voiceState === 'processing' && transcript.trim()) {
      handleSendQuery(transcript);
    }
  }, [voiceState]);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) {
      setVoiceState('ready');
      return;
    }

    if (onNewMessage) {
      onNewMessage('user', queryText);
    }

    try {
      const res = await apiRequest('/api/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: queryText,
          language: i18n.language || 'en',
        }),
      });

      if (onNewMessage) {
        onNewMessage('assistant', res.reply, res.sources, res.suggested_questions);
      }

      speakAnswer(res.reply);
    } catch {
      setVoiceState('error');
      setErrorMessage('Could not retrieve advice right now. Please try again or type your question.');
    }
  };

  const speakAnswer = (text: string) => {
    if (!synthRef.current) {
      setVoiceState('ready');
      return;
    }

    synthRef.current.cancel();
    // Clean text of markdown asterisks for natural voice
    const cleanedText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanedText);

    if (i18n.language === 'hi') utterance.lang = 'hi-IN';
    else if (i18n.language === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95; // Slightly slower for clarity in rural regions

    utterance.onstart = () => {
      setVoiceState('speaking');
    };

    utterance.onend = () => {
      setVoiceState('ready');
      setTranscript('');
    };

    utterance.onerror = () => {
      setVoiceState('ready');
    };

    synthRef.current.speak(utterance);
  };

  const handleToggleMic = () => {
    if (voiceState === 'listening') {
      if (recognitionRef.current) recognitionRef.current.stop();
      setVoiceState('ready');
    } else if (voiceState === 'speaking') {
      if (synthRef.current) synthRef.current.cancel();
      setVoiceState('ready');
    } else {
      if (!recognitionRef.current) {
        setErrorMessage('Speech recognition is not supported in this browser. Please use text chat below.');
        setVoiceState('error');
        return;
      }
      try {
        setTranscript('');
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  const stateLabels = {
    ready: t('assistant.ready', 'Ready to help'),
    listening: t('assistant.listening', 'Listening to your voice...'),
    processing: t('assistant.processing', 'Consulting verified knowledge base...'),
    speaking: t('assistant.speaking', 'Speaking answer...'),
    error: 'Notice',
  };

  return (
    <div className="bg-gradient-to-b from-amber-50/70 to-brand-50/40 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm text-center space-y-5">
      
      {/* Mic Trigger with dynamic pulse circles */}
      <div className="relative inline-flex items-center justify-center">
        {voiceState === 'listening' && (
          <>
            <span className="absolute w-28 h-28 bg-red-400/30 rounded-full animate-ping" />
            <span className="absolute w-24 h-24 bg-red-400/20 rounded-full animate-pulse" />
          </>
        )}
        {voiceState === 'speaking' && (
          <span className="absolute w-28 h-28 bg-brand-400/30 rounded-full animate-pulse" />
        )}

        <button
          onClick={handleToggleMic}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 transform active:scale-95 ${
            voiceState === 'listening'
              ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30 scale-105'
              : voiceState === 'speaking'
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
              : 'bg-brand-700 hover:bg-brand-800 shadow-brand-700/30 hover:scale-105'
          }`}
          aria-label="Voice Assistant Microphone"
        >
          {voiceState === 'listening' ? (
            <Mic className="w-10 h-10 animate-pulse" />
          ) : voiceState === 'speaking' ? (
            <Volume2 className="w-10 h-10 animate-bounce" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>
      </div>

      {/* State Status Banner */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
          {voiceState === 'listening' && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
          {voiceState === 'speaking' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
          {voiceState === 'processing' && <RefreshCw className="w-3 h-3 animate-spin text-brand-600" />}
          <span>{stateLabels[voiceState]}</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          {voiceState === 'speaking'
            ? 'Click to stop audio'
            : voiceState === 'listening'
            ? transcript || 'Speak now in Hindi, Marathi, or English...'
            : t('assistant.micHelp', 'Click microphone to speak in Hindi, Marathi, or English')}
        </p>
      </div>

      {/* Error / Fallback info */}
      {errorMessage && (
        <div className="p-3 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-xl text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
          <span>{errorMessage}</span>
        </div>
      )}

    </div>
  );
};
