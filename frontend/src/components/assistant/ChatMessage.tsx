import React from 'react';
import { Bot, User, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectSuggestion?: (question: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectSuggestion,
}) => {
  const isAssistant = message.role === 'assistant';

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
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {message.content}
        </p>

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
