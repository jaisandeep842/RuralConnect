import React, { useState } from 'react';
import { Bot, User, Sparkles, ShieldCheck, Volume2, Square } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';
import { useTranslation } from 'react-i18next';

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectSuggestion?: (question: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectSuggestion,
}) => {
  const { i18n } = useTranslation();
  const isAssistant = message.role === 'assistant';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[*_#`~>•]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleaned = cleanTextForSpeech(message.content);
    const utterance = new SpeechSynthesisUtterance(cleaned);

    let targetLang = 'en-IN';
    if (i18n.language === 'hi') targetLang = 'hi-IN';
    else if (i18n.language === 'mr') targetLang = 'mr-IN';

    utterance.lang = targetLang;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`flex items-start gap-3.5 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {isAssistant && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-700/20">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm ${
          isAssistant
            ? 'bg-white border border-slate-200/90 text-slate-800'
            : 'bg-brand-700 text-white font-medium'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line flex-1">
            {message.content}
          </div>
          {isAssistant && (
            <button
              onClick={handleToggleSpeak}
              className={`p-1.5 rounded-lg border text-xs shrink-0 transition-colors ${
                isSpeaking
                  ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isSpeaking ? 'Stop voice reading' : 'Listen to this response'}
              aria-label="Text to speech"
            >
              {isSpeaking ? (
                <Square className="w-4 h-4 fill-current" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Verified Sources if provided */}
        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className="pt-2 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-400 flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Knowledge Sources:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {message.sources.map((src, i) => (
                <span
                  key={i}
                  className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-md font-semibold border border-emerald-200 text-[11px]"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested follow-up questions */}
        {isAssistant && message.suggested_questions && message.suggested_questions.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Related Questions:
            </span>
            <div className="flex flex-col gap-1.5">
              {message.suggested_questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSuggestion && onSelectSuggestion(q)}
                  className="text-left text-xs bg-amber-50/80 hover:bg-amber-100 text-slate-800 p-2 rounded-xl border border-amber-200/60 font-medium transition-colors"
                >
                  👉 {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-md">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
