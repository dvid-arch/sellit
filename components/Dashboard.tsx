
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Plus, Search, MapPin, Bell, MessageSquare, Home,
  ChevronDown, Filter, PackageX, LogOut, PanelLeftClose, PanelLeftOpen,
  ArrowUpDown, Radio, UserCircle, Settings, Heart, TrendingUp, Sparkles, Tag,
  ArrowRight, Bot, ShieldQuestion, Clock, Zap, RefreshCw, AlertCircle
} from 'lucide-react';
import { Logo } from '../appConstants.tsx';
import { User, Listing, Chat, Offer, ViewRecord, Notification, Broadcast } from '../types.ts';
import { ListingForm } from './ListingForm.tsx';
import { ProductDetail } from './ProductDetail.tsx';
import { BroadcastForm } from './BroadcastForm.tsx';
import { BroadcastsView } from './BroadcastsView.tsx';
import { ChatView } from './ChatView.tsx';
import { NotificationsView } from './NotificationsView.tsx';
import { ProfileView } from './ProfileView.tsx';
import { AIAssistant } from './AIAssistant.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { geminiService } from '../services/gemini.ts';
import { storageService } from '../services/storageService.ts';
import { SEED_LISTINGS, SEED_NOTIFICATIONS, SEED_SUPPORT_CHAT, SEED_BROADCASTS } from '../data/seedData.ts';

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

const SUPPORT_CHAT_ID = 'chat_support';

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Home');

  // Initialize data from localStorage or use seed data for first-time users
  const [listings, setListings] = useState<Listing[]>(() => {
    if (storageService.isFirstTimeUser()) {
      storageService.saveListings(SEED_LISTINGS);
      storageService.saveNotifications(SEED_NOTIFICATIONS);
      storageService.saveChats([SEED_SUPPORT_CHAT]);
      return SEED_LISTINGS;
    }
    return storageService.getListings();
  });

  const [chats, setChats] = useState<Chat[]>(() => storageService.getChats() || [SEED_SUPPORT_CHAT]);
  const [notifications, setNotifications] = useState<Notification[]>(() => storageService.getNotifications() || []);
  const [allOffers, setAllOffers] = useState<Offer[]>(() => storageService.getOffers() || []);
  const [savedItems, setSavedItems] = useState<string[]>(() => storageService.getSavedListings() || []);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(() => {
    const stored = storageService.getBroadcasts();
    if (!stored || stored.length === 0) return SEED_BROADCASTS;
    return stored;
  });
  const [viewHistory, setViewHistory] = useState<ViewRecord[]>([]);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Newest');

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const { showToast } = useToast();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => ['All Categories', 'Electronics', 'Books', 'Fashion', 'Kitchen', 'Home and furniture'], []);
  const sortOptions = useMemo(() => ['Newest', 'Price: Low to High', 'Price: High to Low', 'Urgent First'], []);

  const recentlyViewedItems = useMemo(() => {
    return viewHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(v => listings.find(l => l.id === v.listingId))
      .filter((l): l is Listing => !!l)
      .slice(0, 8);
  }, [viewHistory, listings]);

  const filteredListings = useMemo(() => {
    let result = [...listings];
    if (selectedCategory !== 'All Categories') {
      result = result.filter(l => l.category === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query)
      );
    }

    const sorted = [...result];
    if (sortBy === 'Price: Low to High') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Urgent First') {
      sorted.sort((a, b) => (b.isUrgent ? -1 : 1) - (a.isUrgent ? -1 : 1));
    } else {
      sorted.sort((a, b) => {
        if (a.isBoosted && !b.isBoosted) return -1;
        if (!a.isBoosted && b.isBoosted) return 1;
        return b.id.localeCompare(a.id);
      });
    }
    return sorted;
  }, [listings, selectedCategory, searchQuery, sortBy]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const suggestions: { label: string; type: 'category' | 'listing' | 'ai' | 'trending'; extra?: string }[] = [];

    const categoryMatches = categories.filter(c =>
      c !== 'All Categories' && c.toLowerCase().includes(searchQuery.toLowerCase())
    );
    categoryMatches.forEach(c => suggestions.push({ label: c, type: 'category' }));

    const listingMatches = listings.filter(l =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);
    listingMatches.forEach(l => suggestions.push({ label: l.title, type: 'listing', extra: `₦${l.price.toLocaleString()}` }));

    if (searchQuery.length > 2) {
      suggestions.push({ label: `Ask AI: "${searchQuery}"`, type: 'ai' });
    }

    return suggestions;
  }, [searchQuery, listings, categories]);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setLoadError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    const sidebarTimer = setTimeout(() => setIsSidebarExpanded(false), 1500);
    loadData();
    return () => clearTimeout(sidebarTimer);
  }, [loadData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Persistence Effects - Automatically save data to localStorage when state changes
  useEffect(() => {
    storageService.saveListings(listings);
  }, [listings]);

  useEffect(() => {
    storageService.saveChats(chats);
  }, [chats]);

  useEffect(() => {
    storageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    storageService.saveOffers(allOffers);
  }, [allOffers]);

  useEffect(() => {
    storageService.saveSavedListings(savedItems);
  }, [savedItems]);

  useEffect(() => {
    storageService.saveBroadcasts(broadcasts);
  }, [broadcasts]);

  const scrollToGrid = useCallback(() => {
    if (productGridRef.current) {
      const offset = 80;
      const elementPosition = productGridRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + (scrollContainerRef.current?.scrollTop || 0) - offset;

      scrollContainerRef.current?.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 100);
  };

  const handleOpenProduct = (listing: Listing) => {
    setListings(prev => prev.map(l => l.id === listing.id ? { ...l, viewCount: (l.viewCount || 0) + 1 } : l));
    setSelectedListing(listing);
    setViewHistory(prev => {
      const exists = prev.find(v => v.listingId === listing.id);
      if (exists) {
        return prev.map(v => v.listingId === listing.id ? { ...v, timestamp: Date.now() } : v);
      }
      return [{ listingId: listing.id, lastViewedPrice: listing.price, timestamp: Date.now() }, ...prev];
    });
  };

  const toggleSave = (id: string) => {
    setSavedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const startChat = useCallback((contactName: string, avatar: string, product?: { title: string, price: number, imageUrl: string }) => {
    const existingChat = chats.find(c => c.contactName === contactName && c.product?.title === product?.title);
    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      const newChat: Chat = {
        id: `chat_${Date.now()}`,
        contactName,
        contactAvatar: avatar,
        lastSeen: 'Active now',
        lastMessage: 'Starting conversation...',
        lastMessageTime: 'Just now',
        product,
        messages: []
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }
    setActiveTab('Messages');
  }, [chats]);

  const handleAcceptOffer = useCallback((offer: Offer) => {
    // Immediate state update for smooth UX
    setAllOffers(prev => prev.map(o => o.id === offer.id ? { ...o, status: 'accepted' } : o));
    setListings(prev => prev.map(l => l.id === offer.listingId ? { ...l, status: 'committed' } : l));

    // Auto-create chat specifically for this negotiation to close the deal
    const chatId = `chat_negotiation_${offer.id}`;
    const buyerFirstName = offer.buyerName.split(' ')[0];

    const newChat: Chat = {
      id: chatId,
      contactName: offer.buyerName,
      contactAvatar: offer.buyerAvatar,
      lastSeen: 'Negotiating',
      lastMessage: `Offer of ₦${offer.offeredPrice.toLocaleString()} accepted!`,
      lastMessageTime: 'Just now',
      product: {
        title: offer.listingTitle,
        price: offer.offeredPrice,
        imageUrl: offer.listingImage
      },
      messages: [
        {
          id: `sys_${Date.now()}`,
          text: `You accepted ${buyerFirstName}'s offer! Chat now to arrange a meetup location.`,
          timestamp: 'now',
          senderId: 'them'
        },
        {
          id: `m_${Date.now()}`,
          text: `Hi ${buyerFirstName}, I've accepted your offer. When can you meet at the student union for inspection?`,
          timestamp: 'now',
          senderId: 'me'
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setActiveTab('Messages');
    showToast('Offer Accepted', `Starting checkout chat with ${buyerFirstName}`, 'success');
  }, [showToast]);

  const handleSwitchToSupport = () => {
    setIsAssistantOpen(false);
    setActiveChatId(SUPPORT_CHAT_ID);
    setActiveTab('Messages');
    showToast('Connecting to Support', 'A human agent will be with you in ~3 mins.', 'info');
  };

  const handleNotificationAction = (payload: any) => {
    switch (payload.type) {
      case 'view_listing':
        const listing = listings.find(l => l.id === payload.id);
        if (listing) handleOpenProduct(listing);
        else showToast('Not Found', 'This item is no longer available.', 'error');
        break;
      case 'view_offer':
        setActiveTab('Profile');
        showToast('Reviewing Offer', 'Scroll to your active offers below.', 'info');
        break;
      case 'navigate_tab':
        setActiveTab(payload.tab);
        if (payload.tab === 'Home') scrollToGrid();
        break;
      default:
        console.warn('Unhandled notification action', payload);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.label);
      setSearchQuery('');
    } else if (suggestion.type === 'listing') {
      setSearchQuery(suggestion.label);
    } else if (suggestion.type === 'ai') {
      setIsAssistantOpen(true);
    }
    setShowSearchSuggestions(false);
  };

  const handleNewBroadcast = (data: any) => {
    const newBroadcast: Broadcast = {
      id: `b_${Date.now()}`,
      author: user?.name || 'Student',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      need: data.need,
      details: data.details,
      budgetMin: parseFloat(data.minPrice) || 0,
      budgetMax: parseFloat(data.maxPrice) || 0,
      location: data.radius,
      time: 'Just now',
      isBoosted: data.boostEnabled,
      category: 'General'
    };
    setBroadcasts(prev => [newBroadcast, ...prev]);
    // Do not close immediately, let BroadcastForm handle the delay for success view
  };

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Broadcasts', icon: Radio },
    { name: 'Add Product', icon: Plus, isPrimary: true },
    { name: 'Notifications', icon: Bell, count: notifications.filter(n => !n.isRead).length },
    { name: 'Messages', icon: MessageSquare },
  ];

  const renderContent = () => {
    if (showBroadcastForm) return <div className="p-4 md:p-8"><BroadcastForm onBack={() => setShowBroadcastForm(false)} onSubmit={handleNewBroadcast} /></div>;
    if (editingListing) return <ListingForm initialData={editingListing} onClose={() => setEditingListing(null)} onSubmit={(l) => { setListings(prev => prev.map(old => old.id === l.id ? l : old)); setEditingListing(null); }} />;

    switch (activeTab) {
      case 'Broadcasts':
        return <div className="p-4 md:p-8"><BroadcastsView broadcasts={broadcasts} onRespond={(b) => startChat(b.author, b.authorAvatar, { title: b.need, price: b.budgetMax, imageUrl: b.authorAvatar })} /></div>;
      case 'Add Product':
        return <ListingForm onClose={() => setActiveTab('Home')} onSubmit={(l) => { setListings([{ ...l, id: Date.now().toString(), status: 'available', seller: user?.name || 'Obokobong', viewCount: 0, offerCount: 0 }, ...listings]); setActiveTab('Home'); }} />;
      case 'Notifications':
        return (
          <NotificationsView
            notifications={notifications}
            onAction={handleNotificationAction}
            onMarkAllRead={handleMarkAllRead}
            onDelete={handleDeleteNotification}
            onMarkRead={handleMarkRead}
            onClearAll={handleClearNotifications}
          />
        );
      case 'Messages':
        return <ChatView chats={chats} activeChatId={activeChatId} onSelectChat={setActiveChatId} onSendMessage={(chatId, text) => {
          setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { id: Date.now().toString(), text, timestamp: 'now', senderId: 'me' }], lastMessage: text } : c));
        }} />;
      case 'Profile':
        return <ProfileView
          user={user}
          listings={listings.filter(l => l.seller === (user?.name || 'Obokobong'))}
          offers={allOffers}
          onEditListing={(l) => { setEditingListing(l); }}
          onDeleteListing={(id) => setListings(prev => prev.filter(l => l.id !== id))}
          onMarkSold={(id) => setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'sold' } : l))}
          onBoostListing={(id) => setListings(prev => prev.map(l => l.id === id ? { ...l, isBoosted: true } : l))}
          onAddProductClick={() => setActiveTab('Add Product')}
          onOpenListing={handleOpenProduct}
          onAcceptOffer={handleAcceptOffer}
        />;
      default:
        return (
          <div className="p-4 md:p-8">
            <div className="relative w-full h-44 md:h-80 rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-8 md:mb-12 bg-sellit text-white shadow-2xl shadow-sellit/20 flex flex-col justify-center px-6 md:px-16 group">
              <div className="absolute inset-0 bg-gradient-to-r from-sellit-dark via-sellit to-transparent opacity-90 z-10" />
              <div className="relative z-20 max-w-xl">
                <h1 className="text-2xl md:text-5xl font-black mb-3 md:mb-5 leading-tight tracking-tight text-white drop-shadow-sm">Need something?<br />Broadcast to Campus.</h1>
                <p className="text-white/80 text-xs md:text-lg mb-4 md:mb-8 font-medium leading-relaxed hidden sm:block drop-shadow-sm">Post your request and let fellow students find you. Simple, fast, and local.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowBroadcastForm(true)} className="bg-white text-sellit px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">Start Broadcast</button>
                  <button onClick={() => setActiveTab('Broadcasts')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-white/20 transition-all">View Needs</button>
                </div>
              </div>
            </div>

            {recentlyViewedItems.length > 0 && (
              <div className="mb-10 animate-in fade-in slide-in-from-left duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} className="text-sellit" /> Recently Viewed
                  </h3>
                  <button onClick={() => setViewHistory([])} className="text-[10px] font-black text-gray-300 hover:text-red-400 uppercase tracking-widest transition-colors">Clear</button>
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
                  {recentlyViewedItems.map(item => (
                    <div key={item.id} onClick={() => handleOpenProduct(item)} className="shrink-0 group cursor-pointer w-24 md:w-32">
                      <div className="aspect-square rounded-2xl overflow-hidden mb-2 border border-gray-100 group-hover:border-sellit transition-colors relative">
                        <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                        {item.status === 'sold' && <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-black text-[10px] text-gray-500 uppercase">Sold</div>}
                      </div>
                      <p className="text-[10px] md:text-xs font-black text-gray-900 truncate">{item.title}</p>
                      <p className="text-[10px] font-black text-sellit">₦{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={productGridRef} className={`sticky top-[-1px] z-30 transition-all duration-300 py-4 -mx-4 md:-mx-8 px-4 md:px-8 bg-[#F8FAFB]/95 backdrop-blur-md mb-6 md:mb-10 ${isScrolled ? 'border-b border-gray-100 shadow-sm' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
                  <div className="relative shrink-0">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-xs md:text-sm font-black text-gray-700 hover:border-sellit transition-all shadow-sm outline-none cursor-pointer"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative shrink-0">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-xs md:text-sm font-black text-gray-700 hover:border-sellit transition-all shadow-sm outline-none cursor-pointer"
                    >
                      {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ArrowUpDown size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">{filteredListings.length} items found</span>
                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-sellit bg-sellit/5 px-3 py-1.5 rounded-lg border border-sellit/10">
                    <MapPin size={12} />
                    <span>NDDC Hostel</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 pb-20 md:pb-12">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] h-64 md:h-96 animate-pulse border border-gray-100 p-4">
                    <div className="bg-gray-50 h-2/3 rounded-2xl mb-4" />
                    <div className="h-4 bg-gray-50 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-50 rounded w-1/2" />
                  </div>
                ))
              ) : loadError ? (
                <div className="col-span-full py-24 md:py-40 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mb-8">
                    <AlertCircle size={40} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Failed to load feed</h2>
                  <p className="text-gray-400 font-medium max-w-sm px-4 mb-8">A technical hitch occurred while talking to our campus server.</p>
                  <button onClick={loadData} className="px-8 py-3 bg-sellit text-white rounded-xl font-black flex items-center gap-3">
                    <RefreshCw size={18} /> Retry Sync
                  </button>
                </div>
              ) : filteredListings.length > 0 ? (
                filteredListings.map((item) => {
                  const isSaved = savedItems.includes(item.id);
                  const isOwner = item.seller === (user?.name || 'Obokobong');

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleOpenProduct(item)}
                      className={`group bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-sellit/5 transition-all duration-500 cursor-pointer relative ${item.status !== 'available' ? 'opacity-70' : ''}`}
                    >
                      <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50">
                        <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                          {item.isBoosted && (
                            <div className="bg-sellit text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                              <Zap size={10} fill="white" /> Priority
                            </div>
                          )}
                          {item.status === 'sold' ? (
                            <div className="bg-gray-900 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg">Sold</div>
                          ) : item.status === 'committed' ? (
                            <div className="bg-blue-600 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg">Committed</div>
                          ) : item.isUrgent && (
                            <div className="bg-orange-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg animate-pulse">Urgent</div>
                          )}
                        </div>
                        {!isOwner && item.status === 'available' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }}
                            className={`absolute top-3 left-3 p-2 rounded-xl transition-all z-10 ${isSaved ? 'bg-sellit text-white shadow-lg' : 'bg-white/80 text-gray-400 hover:text-sellit'}`}
                          >
                            <Heart size={16} fill={isSaved ? 'white' : 'none'} />
                          </button>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                      </div>
                      <div className="p-4 md:p-6">
                        <h3 className="font-black text-gray-900 text-sm md:text-lg leading-tight truncate group-hover:text-sellit transition-colors">{item.title}</h3>
                        <p className="text-[10px] md:text-xs text-gray-400 font-bold mt-1 md:mt-2 line-clamp-1">{item.description}</p>
                        <div className="flex items-center justify-between mt-3 md:mt-5 pt-3 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm md:text-xl font-black ${item.status !== 'available' ? 'text-gray-400' : 'text-gray-900'}`}>₦{item.price.toLocaleString()}</span>
                          </div>
                          {isOwner ? (
                            <span className="text-[8px] md:text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md uppercase border border-gray-100">Mine</span>
                          ) : (
                            item.isNegotiable && item.status === 'available' && <span className="text-[8px] md:text-[10px] font-black text-sellit bg-sellit/10 px-2 py-0.5 rounded-md uppercase">Negotiable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-24 md:py-40 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-8 border border-dashed border-gray-200">
                    <PackageX size={40} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">No items found</h2>
                  <p className="text-gray-400 font-medium max-w-sm px-4">Try changing your filters or broadcasting what you're looking for!</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8FAFB] overflow-hidden">
      <aside className={`hidden md:flex bg-white border-r border-gray-100 flex-col shrink-0 z-40 transition-all duration-500 ${isSidebarExpanded ? 'w-64' : 'w-24'}`}>
        <div className={`p-6 flex ${isSidebarExpanded ? 'items-center justify-between' : 'flex-col items-center gap-8'}`}>
          {!isSidebarExpanded && (
            <button onClick={() => setIsSidebarExpanded(true)} className="p-3 bg-gray-100/50 text-gray-500 hover:text-gray-900 rounded-2xl transition-all">
              <PanelLeftOpen size={24} />
            </button>
          )}
          <div className="transition-all duration-500">
            {isSidebarExpanded ? (
              <div className="flex items-center justify-between w-full">
                <Logo />
                <button onClick={() => setIsSidebarExpanded(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors ml-4">
                  <PanelLeftClose size={20} />
                </button>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-sellit/10 flex items-center justify-center text-sellit font-black text-2xl shadow-sm border border-sellit/5">S</div>
            )}
          </div>
        </div>
        <nav className={`flex-1 px-4 space-y-3 mt-6 ${!isSidebarExpanded ? 'flex flex-col items-center' : ''}`}>
          {navItems.map((item) => {
            const isActive = activeTab === item.name && !showBroadcastForm && !editingListing;
            const Icon = item.icon;
            return (
              <button key={item.name} onClick={() => { setActiveTab(item.name); setShowBroadcastForm(false); setEditingListing(null); setSelectedListing(null); }} className={`relative flex items-center font-black transition-all duration-300 ${isSidebarExpanded ? `w-full p-4 rounded-2xl gap-4 ${isActive ? 'bg-sellit text-white shadow-xl shadow-sellit/20 translate-x-1' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}` : `p-4 rounded-2xl justify-center ${isActive ? 'bg-sellit text-white shadow-xl shadow-sellit/20 scale-110' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}`}>
                <Icon size={24} className="shrink-0" />
                {isSidebarExpanded && <span className="text-sm uppercase tracking-wider">{item.name}</span>}
                {item.count !== undefined && item.count > 0 && (
                  <span className={`absolute ${isSidebarExpanded ? 'right-4' : 'top-2 right-2'} w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.08)] rounded-t-[2.5rem] pt-2 pb-5">
        <div className="flex justify-between items-center h-14 px-8 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name && !showBroadcastForm && !editingListing;
            if (item.isPrimary) {
              return (
                <div key={item.name} className="relative -top-2 flex flex-col items-center">
                  <button onClick={() => { setActiveTab(item.name); setShowBroadcastForm(false); setEditingListing(null); setSelectedListing(null); }} className="w-16 h-16 bg-sellit text-white rounded-[1.75rem] shadow-2xl shadow-sellit/40 flex items-center justify-center active:scale-90 transition-transform border-[6px] border-white">
                    <Plus size={32} className="stroke-[3]" />
                  </button>
                </div>
              );
            }
            return (
              <button key={item.name} onClick={() => { setActiveTab(item.name); setShowBroadcastForm(false); setEditingListing(null); setSelectedListing(null); }} className={`flex flex-col items-center justify-center transition-all relative ${isActive ? 'text-sellit' : 'text-gray-400'}`}>
                <div className="p-1">
                  <Icon size={28} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'} />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-black border border-white">
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-10 shrink-0 z-50">
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${showSearchSuggestions ? 'text-sellit' : 'text-gray-400'}`} size={18} />
            <input type="text" placeholder="Search anything on campus..." value={searchQuery} onFocus={() => setShowSearchSuggestions(true)} onChange={(e) => { setSearchQuery(e.target.value); setShowSearchSuggestions(true); }} className="w-full pl-12 pr-4 py-2.5 md:py-3.5 bg-gray-50 border-none rounded-2xl text-sm md:text-base outline-none focus:ring-4 focus:ring-sellit/5 transition-all font-bold text-gray-900 placeholder:text-gray-400 shadow-inner" />
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Sparkles size={12} className="text-sellit" /> Smart Search</p>
                  <button onClick={() => setShowSearchSuggestions(false)} className="text-[10px] font-black text-gray-300 hover:text-gray-500 uppercase">Dismiss</button>
                </div>
                <div className="max-h-[350px] overflow-y-auto scrollbar-hide py-2">
                  {searchSuggestions.map((suggestion, idx) => (
                    <button key={`${suggestion.type}-${idx}`} onClick={() => handleSelectSuggestion(suggestion)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-sellit/5 transition-colors group border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-4 text-left">
                        <div className={`p-2.5 rounded-xl ${suggestion.type === 'category' ? 'bg-sellit/10 text-sellit' : suggestion.type === 'listing' ? 'bg-orange-50 text-orange-500' : suggestion.type === 'ai' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-500'}`}>
                          {suggestion.type === 'category' ? <Tag size={16} /> : suggestion.type === 'listing' ? <PackageX size={16} /> : suggestion.type === 'ai' ? <Bot size={16} /> : <TrendingUp size={16} />}
                        </div>
                        <div><p className="text-sm font-bold text-gray-900 group-hover:text-sellit transition-colors">{suggestion.label}</p><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{suggestion.type}</p></div>
                      </div>
                      <div className="flex items-center gap-2">{suggestion.extra && <span className="text-xs font-black text-sellit bg-sellit/5 px-3 py-1 rounded-lg border border-sellit/10">{suggestion.extra}</span>}<ArrowRight size={14} className="text-gray-200 group-hover:text-sellit group-hover:translate-x-1 transition-all" /></div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="ml-4 flex items-center gap-2 md:gap-5 relative" ref={profileDropdownRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 group focus:outline-none">
              <div className="hidden sm:flex flex-col items-end transition-opacity group-hover:opacity-80"><span className="text-xs font-black text-gray-900">{user?.name || 'Obokobong'}</span><span className="text-[9px] font-black text-sellit uppercase tracking-widest">NDDC Hostel</span></div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden ring-1 ring-gray-100 group-hover:ring-sellit/30 transition-all"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-full h-full object-cover" alt="Profile" /></div>
            </button>
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100] ring-1 ring-black/5">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p><p className="text-sm font-black text-gray-900 truncate">{user?.email || 'ubokobong@gmail.com'}</p></div>
                <div className="p-2">
                  <button onClick={() => { setIsProfileOpen(false); setActiveTab('Profile'); setSelectedListing(null); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"><UserCircle size={18} className="text-gray-400" /> My Profile</button>
                  <button onClick={() => { setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"><Settings size={18} className="text-gray-400" /> Settings</button>
                  <div className="h-px bg-gray-50 my-1 mx-2" />
                  <button onClick={() => { setIsProfileOpen(false); onLogout(); setSelectedListing(null); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"><LogOut size={18} /> Sign Out</button>
                </div>
              </div>
            )}
          </div>
        </header>
        <main ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#F8FAFB] scroll-smooth">{renderContent()}</main>

        {/* Hide floating AI button on Messages tab to avoid collision and redundancy with Human Desk */}
        {!isAssistantOpen && activeTab !== 'Messages' && (
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="fixed transition-all duration-500 ease-in-out z-[100] bg-sellit text-white w-14 h-14 md:w-16 md:h-16 rounded-[1.75rem] shadow-2xl shadow-sellit/40 flex items-center justify-center hover:scale-110 active:scale-90 group bottom-24 right-6 md:bottom-10 md:right-10 animate-in slide-in-from-right-8 duration-500"
          >
            <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
          </button>
        )}

        <AIAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} onSwitchToSupport={handleSwitchToSupport} />
      </div>
      {selectedListing && (
        <ProductDetail
          listing={selectedListing}
          isOwner={selectedListing.seller === (user?.name || 'Obokobong')}
          onClose={() => setSelectedListing(null)}
          onContact={() => { startChat(selectedListing.seller, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', { title: selectedListing.title, price: selectedListing.price, imageUrl: selectedListing.imageUrl }); setSelectedListing(null); }}
          onMarkSold={(id) => { setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'sold' } : l)); setSelectedListing(null); showToast('Success', 'Item marked as sold.', 'success'); }}
          onEdit={() => { setEditingListing(selectedListing); setSelectedListing(null); }}
        />
      )}
    </div>
  );
};
