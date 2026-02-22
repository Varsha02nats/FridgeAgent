import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { aiService } from '../services/ai';
import { motion, AnimatePresence } from 'motion/react';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I\'m FridgeAgent. How can I help you with your kitchen today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    "Used 2 eggs",
    "What can I cook?",
    "Do I need milk?",
    "What's expiring soon?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await aiService.chat(text, history);
      
      // Check for consumption JSON
      if (response.includes('{"action": "consume"')) {
        try {
          const jsonMatch = response.match(/\{[\s\S]*"action":\s*"consume"[\s\S]*\}/);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            await fetch('/api/inventory/consume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: data.item, quantity: data.quantity })
            });
          }
        } catch (e) {
          console.error("Failed to process consumption", e);
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card-light dark:bg-card-dark rounded-3xl border border-black/5 dark:border-white/10 overflow-hidden shadow-xl">
      <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-text-primary-light dark:text-text-primary-dark">AI Kitchen Assistant</h2>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Powered by Gemini AI</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-bg-light dark:bg-bg-dark text-text-secondary-light dark:text-text-secondary-dark'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-bg-light dark:bg-bg-dark p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark text-sm">
              <Loader2 size={16} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-black/5 dark:border-white/10 space-y-4">
        <div className="flex flex-wrap gap-2">
          {quickActions.map(action => (
            <button
              key={action}
              onClick={() => handleSend(action)}
              className="px-3 py-1.5 bg-bg-light dark:bg-bg-dark border border-black/5 dark:border-white/10 rounded-full text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:border-primary hover:text-primary transition-all"
            >
              {action}
            </button>
          ))}
        </div>
        
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="relative"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your fridge..."
            className="w-full pl-4 pr-14 py-4 rounded-2xl bg-bg-light dark:bg-bg-dark border border-black/5 dark:border-white/10 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 w-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
