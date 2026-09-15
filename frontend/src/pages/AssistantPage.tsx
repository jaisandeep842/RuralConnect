import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, Bot, Sparkles, RefreshCw, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';
import { apiRequest } from '../api/client';
import { VoiceAssistantWidget } from '../components/assistant/VoiceAssistantWidget';
import { ChatMessage } from '../components/assistant/ChatMessage';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuthStore } from '../store/authStore';

export const AssistantPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const { language } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        i18n.language === 'mr'
          ? 'नमस्कार! मी रुरल कनेक्टचा एआय सहाय्यक आहे. आपण मला ग्रामीण व्यवसाय कसा सुरू करावा, शासकीय योजना (उदा. मुद्रा किंवा PMEGP कर्ज), डिजिटल मार्केटिंग किंवा मेंटर्सबद्दल कोणताही प्रश्न विचारू शकता.'
          : i18n.language === 'hi'
          ? 'नमस्ते! मैं ग्रामीण कनेक्ट का एआई सहायक हूँ। आप मुझसे ग्रामीण व्यवसाय शुरू करने, सरकारी योजनाओं (जैसे मुद्रा अथवा PMEGP ऋण), डिजिटल मार्केटिंग या मेंटर्स के बारे में कोई भी प्रश्न पूछ सकते हैं।'
          : 'Namaste! I am RuralConnect’s AI Business Assistant. Ask me how to start a rural business, discover verified government schemes (PMEGP, Mudra, PMFME), or learn WhatsApp marketing.',
      sources: ['RuralConnect Verified Knowledge Base'],
      suggested_questions: [
        'How can I start a small food business from home?',
        'What subsidy does PMEGP give to rural women?',
        'How can I promote my products on WhatsApp Business?',
      ],
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch suggested questions based on selected language
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await apiRequest(`/api/assistant/suggested?language=${i18n.language || 'en'}`);
        setSuggestedQuestions(res.questions || []);
      } catch {
        // Fallback
      }
    };
    fetchSuggested();
  }, [i18n.language]);

  // Query param from other pages (e.g. from SchemeCard "Ask AI About This Scheme")
  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      handleSendMessage(query);
    }
  }, [searchParams]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const res = await apiRequest('/api/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text.trim(),
          language: i18n.language || 'en',
        }),
      });

      const assistantMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply,
        sources: res.sources,
        suggested_questions: res.suggested_questions,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Verified information is currently unavailable. Please check the Government Schemes section or try again later.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceWidgetMessage = (
    role: 'user' | 'assistant',
    content: string,
    sources?: string[],
    suggested?: string[]
  ) => {
    const msg: ChatMessageType = {
      id: Date.now().toString(),
      role,
      content,
      sources,
      suggested_questions: suggested,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Multilingual Voice & Text AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          {t('assistant.title', 'AI Business Assistant')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t(
            'assistant.subtitle',
            'Get verified guidance on rural business planning, marketing, finance, and schemes.'
          )}
        </p>
      </div>

      {/* Voice Assistant Interactive Widget */}
      <VoiceAssistantWidget onNewMessage={handleVoiceWidgetMessage} />

      {/* Suggested Quick Questions Pills */}
      {suggestedQuestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            {t('assistant.suggestedQuestions', 'Suggested Questions')}
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-xs font-semibold bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Stream Container */}
      <div className="bg-slate-50/70 rounded-3xl border border-slate-200 p-4 sm:p-6 space-y-6 min-h-[360px] max-h-[550px] overflow-y-auto shadow-inner">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSelectSuggestion={(q) => handleSendMessage(q)}
          />
        ))}

        {isSending && (
          <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold animate-pulse pl-2">
            <Bot className="w-5 h-5 text-brand-600" />
            <span>Consulting verified knowledge base...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-300 shadow-md focus-within:ring-2 focus-within:ring-brand-600"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t(
            'assistant.askPlaceholder',
            'Ask any business question in Hindi, Marathi, or English...'
          )}
          className="flex-1 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
        />

        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask</span>
        </Button>
      </form>

    </div>
  );
};
