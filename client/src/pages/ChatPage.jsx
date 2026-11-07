import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { api } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { BotMessageSquare, Send, User, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import VoicePlayer from '../components/common/VoicePlayer.jsx';

export default function ChatPage() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: {
        answer:
          'Namaste! I am AgriGuide AI, your dedicated agricultural assistant. Ask me anything about crop selection for your soil, fertilizer dosages, irrigation, or pest prevention.',
        suggestions: [
          'Which crops grow best in black soil with low water?',
          'How can I fix nitrogen deficiency organically?',
          'What is the ideal intercrop for sugarcane in Karnataka?',
          'How do I control pod borer in chickpea without heavy chemicals?'
        ]
      }
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageToSend = inputMsg) => {
    const text = (messageToSend || '').trim();
    if (!text || loading) return;

    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await api.sendMessage({
        message: text,
        language
      });
      const assistantMsg = {
        role: 'assistant',
        content: res.data
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: {
            answer: `I could not process your query (${err.message}). Please ensure your Gemini API key is configured.`,
            suggestions: []
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <BotMessageSquare className="w-6 h-6 text-purple-600" />
              <span>AI Krishi Chat Assistant</span>
            </h1>
            <p className="text-xs text-gray-500">
              Interactive agronomic decision support in English, ಕನ್ನಡ, and हिन्दी
            </p>
          </div>
        </div>

        {/* Message Window */}
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 space-y-4 shadow-sm">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-sm ${
                    isUser
                      ? 'bg-forest-600 text-white'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-forest-600 text-white font-medium rounded-tr-none'
                      : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none space-y-3'
                  }`}
                >
                  {isUser ? (
                    <span>{msg.content}</span>
                  ) : (
                    <>
                      <p>{msg.content.answer}</p>

                      <div className="flex items-center justify-between pt-1">
                        <VoicePlayer text={msg.content.answer} language={language} />
                      </div>

                      {msg.content.suggestions && msg.content.suggestions.length > 0 && (
                        <div className="pt-2 border-t border-gray-200/60 space-y-1.5">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            Related Inquiries
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.content.suggestions.map((sug, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleSend(sug)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-forest-400 hover:text-forest-700 text-gray-600 text-xs text-left transition-colors"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 w-fit">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
              <span>AgriGuide is formulating response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ask an agricultural question (e.g. Best cotton fertilizer for black soil?)..."
            className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
          />
          <button
            type="submit"
            disabled={loading || !inputMsg.trim()}
            className="p-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
