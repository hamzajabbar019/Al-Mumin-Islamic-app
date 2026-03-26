import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, ChevronLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getChatResponse } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Assalamu Alaikum! I am your Al-Mumin assistant. How can I help you today with your Islamic queries?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    const currentMessages = [...messages];
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const botMsg = await getChatResponse(userMsg, currentMessages);
      setMessages(prev => [...prev, { role: 'bot', text: botMsg }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="font-bold text-zinc-900 dark:text-white">Al-Mumin AI</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600' : 'bg-emerald-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' 
                  : 'bg-emerald-50 dark:bg-emerald-900/20 text-zinc-900 dark:text-zinc-100 border border-emerald-100 dark:border-emerald-900/30'
              }`}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex gap-1">
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 pb-safe border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask anything about Islam..." 
            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-emerald-600 text-white rounded-xl disabled:opacity-50 transition-opacity"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
