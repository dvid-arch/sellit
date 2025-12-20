
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, ExternalLink, Bot, User, Trash2, Headphones } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { AssistantMessage } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSupport: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, onSwitchToSupport }) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { id: '1', role: 'assistant', content: "Hi! I'm your Sellit Assistant. Need help finding a deal or pricing your items?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: AssistantMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
    const result = await geminiService.getSmartAdvice(input, history);

    const botMsg: AssistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.text,
      timestamp: Date.now(),
      sources: result.sources
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[100] w-[calc(100vw-3rem)] md:w-[400px] h-[540px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
      <div className="p-6 bg-sellit text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold">Sellit Assistant</h3>
            <p className="text-[10px] opacity-70 uppercase tracking-widest font-black">AI Powered</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onSwitchToSupport}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group relative"
            title="Talk to Human Support"
          >
            <Headphones size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-sellit" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 ${
              msg.role === 'user' 
                ? 'bg-sellit text-white rounded-tr-none' 
                : 'bg-gray-50 text-gray-800 rounded-tl-none'
            }`}>
              <div className="shrink-0 mt-1">
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-sellit" />}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 space-y-1 pt-2 border-t border-gray-200/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sources</p>
                    {msg.sources.map((s: any, i: number) => (
                      <a key={i} href={s.web?.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-sellit hover:underline">
                        <ExternalLink size={10} /> {s.web?.title || 'Web Result'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-sellit" />
              <span className="text-xs font-bold text-gray-400">Analyzing campus data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="mb-3 px-1 flex items-center justify-between">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">AI can make mistakes</span>
          <button onClick={onSwitchToSupport} className="text-[9px] font-black text-sellit uppercase tracking-widest hover:underline flex items-center gap-1">
            <Headphones size={10} /> Talk to Human Assistant
          </button>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-2xl p-1 shadow-inner border border-gray-100">
          <input 
            type="text" 
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent border-none py-3 px-3 text-sm focus:ring-0 font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-sellit text-white rounded-xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sellit/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
