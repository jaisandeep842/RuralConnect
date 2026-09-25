import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, RefreshCw, Play, Square } from 'lucide-react';
import { apiRequest } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

type VoiceState = 'ready' | 'listening' | 'processing' | 'speaking' | 'error';

interface VoiceAssistantWidgetProps {
  onNewMessage?: (role: 'user' | 'assistant', text: string, sources?: string[], suggested?: string[]) => void;
}

export const VoiceAssistantWidget: React.FC<VoiceAssistantWidgetProps> = ({ onNewMessage }) => {
  const { t, i18n } = useTranslation();
  const [voiceState, setVoiceState] = useState<VoiceState>('ready');
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const latestTranscriptRef = useRef('');
  const keepAliveIntervalRef = useRef<any>(null);

  // Initialize Speech Synthesis and Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

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
          latestTranscriptRef.current = '';
          setTranscript('');
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            latestTranscriptRef.current = currentTranscript;
            setTranscript(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition status:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setVoiceState('error');
            setErrorMessage('Microphone access is blocked. Please enable microphone permissions in your browser or click any question chip below.');
          } else if (event.error === 'no-speech') {
            setVoiceState('ready');
          } else {
            setVoiceState('ready');
          }
        };

        recognition.onend = () => {
          const spokenText = latestTranscriptRef.current.trim();
          if (spokenText.length > 0) {
            setVoiceState('processing');
            handleSendQuery(spokenText);
          } else {
            setVoiceState('ready');
          }
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Recognition init warning:', err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
    };
  }, [i18n.language]);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) {
      setVoiceState('ready');
      return;
    }

    if (onNewMessage) {
      onNewMessage('user', queryText);
    }

    setVoiceState('processing');

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
      setErrorMessage('Could not retrieve advice right now. Please try again or type your question below.');
    }
  };

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove markdown links [name](url) -> name
      .replace(/https?:\/\/\S+/g, '') // remove urls
      .replace(/[*_#`~>•]/g, ' ') // remove markdown syntax
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speakAnswer = (text: string) => {
    if (!synthRef.current) {
      setVoiceState('ready');
      return;
    }

    try {
      synthRef.current.cancel();
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }

      const cleanedText = cleanTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanedText);

      // Select voice
      const voices = synthRef.current.getVoices();
      let targetLang = 'en-IN';
      if (i18n.language === 'hi') targetLang = 'hi-IN';
      else if (i18n.language === 'mr') targetLang = 'mr-IN';

      utterance.lang = targetLang;

      // Find best regional voice if available
      const regionalVoice = voices.find(
        (v) => v.lang === targetLang || v.lang.startsWith(targetLang.slice(0, 2))
      );
      if (regionalVoice) {
        utterance.voice = regionalVoice;
      }

      utterance.rate = 0.95; // clear, comfortable pace for rural accessibility
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setVoiceState('speaking');
        // Chrome 15s keep-alive fix
        keepAliveIntervalRef.current = setInterval(() => {
          if (synthRef.current && synthRef.current.speaking) {
            synthRef.current.pause();
            synthRef.current.resume();
          }
        }, 12000);
      };

      utterance.onend = () => {
        if (keepAliveIntervalRef.current) {
          clearInterval(keepAliveIntervalRef.current);
        }
        setVoiceState('ready');
        setTranscript('');
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis notice:', e);
        if (keepAliveIntervalRef.current) {
          clearInterval(keepAliveIntervalRef.current);
        }
        setVoiceState('ready');
      };

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
      setVoiceState('ready');
    }
  };

  const handleToggleMic = () => {
    if (voiceState === 'listening') {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    } else if (voiceState === 'speaking') {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setVoiceState('ready');
    } else {
      if (!recognitionRef.current) {
        setErrorMessage('Voice input is not directly supported by this browser. You can click any of the voice prompt buttons below or type below.');
        return;
      }
      try {
        setTranscript('');
        latestTranscriptRef.current = '';
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Could not start recognition:', err);
        // If already started or reset needed
        try {
          recognitionRef.current.abort();
          setTimeout(() => recognitionRef.current.start(), 200);
        } catch {
          setVoiceState('ready');
        }
      }
    }
  };

  const handleStopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }
    setVoiceState('ready');
  };

  const quickVoicePrompts = {
    mr: [
      'व्हॉट्सअॅप बिझनेसवर उत्पादनांचा प्रसार कसा करावा?',
      'PMEGP योजनेतून महिलांना किती सबसिडी मिळते?',
      'घरून खाद्य व्यवसाय कसा सुरू करावा?',
      'कडकनाथ कुक्कुटपालन मार्गदर्शन',
      'गांडूळ खत व सेंद्रिय शेती कशी करावी?'
    ],
    hi: [
      'व्हाट्सएप बिजनेस पर उत्पादों का प्रचार कैसे करें?',
      'PMEGP योजना में 35% सब्सिडी कैसे मिलती है?',
      'घर से खाद्य प्रसंस्करण व्यापार कैसे शुरू करें?',
      'कड़कनाथ मुर्गीपालन की संपूर्ण जानकारी',
      'जैविक खाद और वर्मीकंपोस्ट कैसे बनाएं?'
    ],
    en: [
      'How to promote products on WhatsApp Business?',
      'What subsidy does PMEGP give to rural women?',
      'How can I start a small food business from home?',
      'How to start Kadaknath poultry farming?',
      'How to make organic vermicompost for farming?'
    ]
  };

  const currentPrompts = (quickVoicePrompts as any)[i18n.language || 'en'] || quickVoicePrompts.en;

  const stateLabels = {
    ready: t('assistant.ready', 'Tap Mic to Speak'),
    listening: t('assistant.listening', 'Listening to your voice... Speak now'),
    processing: t('assistant.processing', 'Consulting verified knowledge base...'),
    speaking: t('assistant.speaking', 'Speaking answer out loud...'),
    error: 'Voice Assistant Ready',
  };

  return (
    <div className="bg-gradient-to-b from-amber-50/80 via-white to-brand-50/50 rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-md text-center space-y-6">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Multilingual Voice AI ({i18n.language === 'mr' ? 'मराठी' : i18n.language === 'hi' ? 'हिन्दी' : 'English'})
          </span>
        </div>
        {voiceState === 'speaking' && (
          <button
            onClick={handleStopSpeech}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Audio</span>
          </button>
        )}
      </div>

      {/* Mic Trigger with dynamic pulse circles */}
      <div className="relative inline-flex items-center justify-center pt-2">
        {voiceState === 'listening' && (
          <>
            <span className="absolute w-32 h-32 bg-red-500/20 rounded-full animate-ping" />
            <span className="absolute w-28 h-28 bg-red-500/30 rounded-full animate-pulse" />
          </>
        )}
        {voiceState === 'speaking' && (
          <>
            <span className="absolute w-32 h-32 bg-amber-500/20 rounded-full animate-ping" />
            <span className="absolute w-28 h-28 bg-amber-500/30 rounded-full animate-pulse" />
          </>
        )}

        <button
          onClick={handleToggleMic}
          className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 ${
            voiceState === 'listening'
              ? 'bg-red-600 hover:bg-red-700 shadow-red-600/40 scale-105 ring-4 ring-red-300'
              : voiceState === 'speaking'
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/40 ring-4 ring-amber-300'
              : voiceState === 'processing'
              ? 'bg-brand-600 animate-pulse'
              : 'bg-brand-700 hover:bg-brand-800 shadow-brand-700/30 hover:scale-105 ring-4 ring-brand-200'
          }`}
          aria-label="Voice Assistant Microphone"
        >
          {voiceState === 'listening' ? (
            <Mic className="w-12 h-12 animate-pulse text-white" />
          ) : voiceState === 'speaking' ? (
            <Volume2 className="w-12 h-12 animate-bounce text-white" />
          ) : voiceState === 'processing' ? (
            <RefreshCw className="w-10 h-10 animate-spin text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </button>
      </div>

      {/* Voice Visualizer Waves */}
      {(voiceState === 'listening' || voiceState === 'speaking') && (
        <div className="flex items-center justify-center gap-1.5 h-6">
          <span className="w-1.5 h-4 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-6 bg-brand-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.25s]" />
          <span className="w-1.5 h-7 bg-brand-600 rounded-full animate-bounce [animation-delay:0s]" />
          <span className="w-1.5 h-4 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.2s]" />
        </div>
      )}

      {/* State Status Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-sm">
          {voiceState === 'listening' && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />}
          {voiceState === 'speaking' && <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
          {voiceState === 'processing' && <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />}
          <span>{stateLabels[voiceState]}</span>
        </div>

        <p className="text-sm font-semibold text-slate-700 min-h-[24px]">
          {voiceState === 'speaking'
            ? 'Speaking verified response in your language (Tap mic or Stop to end)'
            : voiceState === 'listening'
            ? transcript || 'Speak now into your microphone in Marathi, Hindi, or English...'
            : voiceState === 'processing'
            ? 'Analyzing question with verified rural knowledge base...'
            : 'Click microphone to speak or click any quick voice prompt below'}
        </p>
      </div>

      {/* Quick Voice Prompt Chips */}
      <div className="pt-2 border-t border-amber-100">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Quick Voice Questions (Click to Ask & Listen)</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {currentPrompts.map((q: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-200/90 text-amber-950 font-semibold border border-amber-300/80 transition-all hover:scale-102 flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3 h-3 text-brand-700 fill-brand-700" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error / Notice info */}
      {errorMessage && (
        <div className="p-3.5 bg-amber-100/90 border border-amber-300 text-amber-950 rounded-2xl text-xs flex items-center justify-center gap-2.5 text-left font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
          <span>{errorMessage}</span>
        </div>
      )}

    </div>
  );
};
