
import React, { useState, useMemo } from 'react';
import { Search, Phone, Smile, Send, Info, MessageSquare, ChevronLeft, ShieldCheck, Headphones, Clock, Users, Zap, Bell, Handshake } from 'lucide-react';
import { Chat } from '../types';

interface ChatViewProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string | null) => void;
  onSendMessage: (chatId: string, text: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ chats, activeChatId, onSelectChat, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [notifyOnJoin, setNotifyOnJoin] = useState(false);

  const selectedChat = useMemo(() => 
    chats.find(c => c.id === activeChatId), 
  [chats, activeChatId]);

  const handleSend = (textOverride?: string) => {
    const finalMsg = textOverride || inputText;
    if (!finalMsg.trim() || !selectedChat) return;
    onSendMessage(selectedChat.id, finalMsg);
    if (!textOverride) setInputText('');
  };

  const showDetailOnMobile = !!activeChatId;

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      if (a.isSupport && !b.isSupport) return -1;
      if (!a.isSupport && b.isSupport) return 1;
      return 0;
    });
  }, [chats]);

  const negotiationChips = useMemo(() => {
    if (!selectedChat?.product) return [];
    const price = selectedChat.product.price;
    return [
      { label: `₦${Math.round(price * 0.9).toLocaleString()}`, text: `Hi! Would you take ₦${Math.round(price * 0.9).toLocaleString()}? (-10%)` },
      { label: `₦${Math.round(price * 0.95).toLocaleString()}`, text: `Can we do ₦${Math.round(price * 0.95).toLocaleString()}? (-5%)` },
      { label: "Is it available?", text: "Hi! Is this item still available for pickup?" },
      { label: "Where to meet?", text: "Where is the best place to meet for inspection?" }
    ];
  }, [selectedChat]);

  return (
    <div className="flex h-full bg-white overflow-hidden relative">
      <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-gray-100 flex flex-col bg-[#F9FAFB]/50 transition-all duration-300 ${
        showDetailOnMobile ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-6 lg:p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-6">Messages</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-2xl focus:ring-4 focus:ring-sellit/5 font-medium text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 lg:px-4 space-y-1 scrollbar-hide pb-24 md:pb-4">
          {sortedChats.filter(c => c.contactName.toLowerCase().includes(sidebarSearch.toLowerCase())).map((chat) => (
            <div 
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center gap-3 p-4 rounded-3xl cursor-pointer transition-all ${
                activeChatId === chat.id ? 'bg-white shadow-md ring-1 ring-sellit/5' : 'hover:bg-gray-100/50'
              } ${chat.isSupport ? 'border border-sellit/10 bg-sellit/[0.02]' : ''}`}
            >
              <div className="relative shrink-0">
                <img src={chat.contactAvatar} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                {chat.isSupport ? (
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${chat.supportMeta?.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                ) : (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className={`font-bold text-sm md:text-base truncate flex items-center gap-1.5 ${chat.isSupport ? 'text-sellit' : 'text-gray-900'}`}>
                    {chat.contactName}
                    {chat.isSupport && <ShieldCheck size={14} className="text-sellit" />}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400">{chat.lastMessageTime}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 truncate font-medium">
                   {chat.isSupport && <span className="text-sellit font-black mr-1">[Official]</span>}
                   {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex flex-col h-full bg-white fixed inset-0 z-50 md:relative md:z-0 transition-transform duration-300 ease-out ${
        showDetailOnMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        {!selectedChat ? (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400 text-center gap-6 p-8">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center border border-dashed border-gray-200">
               <MessageSquare size={40} className="text-gray-200" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Select a Conversation</h3>
              <p className="font-medium text-gray-400 max-w-xs">Start a chat from a listing or broadcast to see messages here.</p>
            </div>
          </div>
        ) : (
          <>
            <header className={`px-4 md:px-8 py-3 md:py-4 border-b flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20 ${selectedChat.isSupport ? 'border-sellit/20' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => onSelectChat(null)} className="md:hidden p-1.5 -ml-1 text-gray-500 hover:bg-gray-50 rounded-lg"><ChevronLeft size={24} /></button>
                <div className="relative">
                  <img src={selectedChat.contactAvatar} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-100" />
                  {selectedChat.isSupport && (
                    <div className="absolute -top-1 -right-1 bg-sellit text-white p-1 rounded-full border-2 border-white shadow-sm">
                      <ShieldCheck size={12} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm md:text-lg leading-tight truncate flex items-center gap-2">
                    {selectedChat.contactName}
                    {selectedChat.isSupport && <span className="bg-sellit/10 text-sellit text-[9px] px-2 py-0.5 rounded-full uppercase font-black tracking-widest">Official Desk</span>}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${selectedChat.isSupport && selectedChat.supportMeta?.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                      {selectedChat.isSupport 
                        ? (selectedChat.supportMeta?.isOnline ? 'Human Agents Active' : 'Support Desk Closed')
                        : 'Online'}
                    </p>
                    {selectedChat.isSupport && selectedChat.supportMeta?.isOnline && (
                      <span className="flex items-center gap-1 bg-sellit/5 px-2 py-0.5 rounded-lg text-[9px] font-black text-sellit border border-sellit/10 uppercase">
                        <Clock size={10} /> ~{selectedChat.supportMeta.estimatedWaitMinutes}m wait
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                {selectedChat.isSupport && (
                  <button 
                    onClick={() => setNotifyOnJoin(!notifyOnJoin)}
                    className={`p-2 rounded-xl transition-all flex items-center gap-2 ${notifyOnJoin ? 'bg-sellit text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:text-sellit'}`}
                  >
                    <Bell size={20} className={notifyOnJoin ? 'animate-bounce' : ''} />
                    <span className="text-[9px] font-black uppercase hidden sm:block">{notifyOnJoin ? 'Notifying' : 'Ping Me'}</span>
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-sellit transition-colors"><Phone size={20} /></button>
              </div>
            </header>

            {selectedChat.isSupport && selectedChat.supportMeta?.queuePosition! > 0 && (
              <div className="px-4 md:px-8 py-3 bg-sellit/[0.03] border-b border-sellit/10 animate-in slide-in-from-top duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sellit/10 flex items-center justify-center text-sellit">
                      <Users size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase">You're in queue</p>
                      <p className="text-[10px] font-bold text-sellit uppercase">Position #{selectedChat.supportMeta.queuePosition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 italic">Typing notified...</span>
                    <div className="w-1.5 h-1.5 bg-sellit rounded-full animate-bounce delay-75" />
                    <div className="w-1.5 h-1.5 bg-sellit rounded-full animate-bounce delay-150" />
                    <div className="w-1.5 h-1.5 bg-sellit rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}

            {selectedChat.product && (
              <div className="px-4 md:px-8 py-2 md:py-3 border-b border-gray-50 bg-[#F9FAFB]/50 flex items-center gap-3 shrink-0">
                <img src={selectedChat.product.imageUrl} className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover border border-gray-100 shadow-sm" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-[10px] md:text-sm truncate leading-tight">{selectedChat.product.title}</h4>
                  <p className="text-[10px] md:text-xs font-black text-sellit">₦{selectedChat.product.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                   <ShieldCheck size={14} className="text-sellit" />
                   <span className="text-[9px] font-black text-sellit uppercase tracking-widest">Escrow Protected</span>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 scrollbar-hide pb-6">
              {selectedChat.isSupport && (
                <div className="bg-sellit/5 border border-sellit/10 p-5 rounded-[2rem] flex flex-col gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Headphones className="text-sellit" size={18} />
                    <span className="text-[10px] font-black uppercase text-sellit tracking-widest">Safety Guidelines</span>
                  </div>
                  <p className="text-[11px] font-bold text-sellit leading-relaxed">
                    A campus advocate is usually online between 9AM - 8PM. Current wait is ~3 mins.
                    For your security, support will never ask for your 4-digit Release Code or Bank PIN.
                  </p>
                </div>
              )}
              {selectedChat.messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}>
                  {msg.agentName && msg.senderId !== 'me' && (
                    <span className="text-[9px] font-black text-sellit uppercase tracking-widest mb-1 ml-4 flex items-center gap-1">
                      <Zap size={10} fill="#00687F" /> {msg.agentName}
                    </span>
                  )}
                  <div className={`max-w-[85%] md:max-w-[70%] px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-[2rem] text-sm md:text-base font-medium shadow-sm relative ${
                    msg.senderId === 'me' ? 'bg-sellit text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/30'
                  } ${selectedChat.isSupport && msg.senderId !== 'me' ? 'border-l-4 border-l-sellit bg-white' : ''}`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-gray-300 mt-1 uppercase px-2">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="p-4 md:p-8 shrink-0 bg-white border-t border-gray-100 sticky bottom-0 z-10 pb-6 md:pb-8">
              {/* Negotiation Chips */}
              {!selectedChat.isSupport && selectedChat.product && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 -mx-2 px-2">
                   {negotiationChips.map((chip, idx) => (
                     <button 
                       key={idx}
                       onClick={() => handleSend(chip.text)}
                       className="shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600 hover:border-sellit hover:text-sellit transition-all whitespace-nowrap"
                     >
                       <Handshake size={12} />
                       {chip.label}
                     </button>
                   ))}
                </div>
              )}
              
              {selectedChat.isSupport && !selectedChat.supportMeta?.isOnline && (
                <div className="mb-4 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Support is currently offline. You can leave a message and we'll notify you!</p>
                </div>
              )}
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-1 flex items-center shadow-inner">
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><Smile size={24} /></button>
                <input 
                  type="text" 
                  placeholder={selectedChat.isSupport && !selectedChat.supportMeta?.isOnline ? "Leave a message..." : "Message..."}
                  className="flex-1 bg-transparent border-none py-3 text-sm md:text-base focus:ring-0 font-medium"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={() => handleSend()} disabled={!inputText.trim()} className="p-3 text-sellit disabled:opacity-20 active:scale-90 transition-transform">
                  <Send size={24} className="fill-current" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
