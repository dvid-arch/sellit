
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, MapPin, Clock, 
  MessageCircle, Zap, PackageX, ChevronDown,
  ArrowRight
} from 'lucide-react';
import { Broadcast } from '../types';
import { useToast } from '../context/ToastContext';

const MOCK_BROADCASTS: Broadcast[] = [
  {
    id: 'b1',
    author: 'Daniel Udoh',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    need: 'CASIO fx-991EX Calculator',
    details: 'Looking for a Casio scientific calculator for my engineering exam next week.',
    budgetMin: 5000,
    budgetMax: 8000,
    location: 'Engineering Faculty',
    time: '12 mins ago',
    isBoosted: true,
    category: 'Books'
  },
  {
    id: 'b2',
    author: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    need: 'Mini Fridge / Chiller',
    details: 'Need a small fridge for my room in Moremi. Budget is flexible.',
    budgetMin: 40000,
    budgetMax: 60000,
    location: 'Moremi Hall',
    time: '1 hour ago',
    isBoosted: false,
    category: 'Electronics'
  },
  {
    id: 'b4',
    author: 'Jessica Ama',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    need: 'Pink Hoodie (L)',
    details: 'Need a warm pink hoodie for the cold mornings. Large size preferred.',
    budgetMin: 3000,
    budgetMax: 5000,
    location: 'Management Science',
    time: '5 hours ago',
    isBoosted: true,
    category: 'Fashion'
  }
];

interface BroadcastsViewProps {
  onRespond: (broadcast: Broadcast) => void;
}

export const BroadcastsView: React.FC<BroadcastsViewProps> = ({ onRespond }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const { showToast } = useToast();

  const filteredBroadcasts = useMemo(() => {
    return MOCK_BROADCASTS.filter(b => {
      const matchesSearch = b.need.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           b.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'All Categories' || b.category === category;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => (b.isBoosted ? 1 : 0) - (a.isBoosted ? 1 : 0));
  }, [searchQuery, category]);

  const categories = ['All Categories', 'Electronics', 'Books', 'Fashion', 'Kitchen'];

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">Campus Needs</h1>
        <p className="text-gray-500 text-sm md:text-lg font-medium">See what students are looking for and make a sale!</p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search needs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-[1.25rem] focus:ring-4 focus:ring-sellit/5 font-medium shadow-sm"
          />
        </div>

        <div className="relative group shrink-0">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-auto appearance-none px-10 py-3.5 bg-white border border-gray-100 rounded-[1.25rem] text-sm font-bold text-gray-500 shadow-sm outline-none pr-12"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {filteredBroadcasts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredBroadcasts.map((b) => (
            <div 
              key={b.id} 
              className={`bg-white rounded-[2rem] p-6 md:p-8 border transition-all duration-300 relative overflow-hidden flex flex-col ${
                b.isBoosted ? 'border-sellit/20 bg-sellit/[0.01]' : 'border-gray-100'
              }`}
            >
              {b.isBoosted && (
                <div className="absolute top-0 right-0">
                  <div className="bg-sellit text-white px-3 py-1 rounded-bl-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Zap size={10} fill="white" />
                    Boosted
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <img src={b.authorAvatar} className="w-12 h-12 rounded-2xl object-cover border border-gray-50 shadow-sm" alt="" />
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{b.author}</h3>
                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                    <MapPin size={10} /> {b.location}
                  </div>
                </div>
              </div>

              <div className="flex-1 mb-6">
                <h4 className="text-lg font-black text-gray-900 mb-2 leading-snug">" {b.need} "</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">{b.details}</p>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Max Budget</span>
                  <span className="text-xl font-black text-gray-900">₦{b.budgetMax.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => {
                    onRespond(b);
                    showToast('Ready to sell?', `Starting chat with ${b.author.split(' ')[0]}...`, 'info');
                  }}
                  className="p-3 md:px-5 md:py-3 bg-sellit text-white rounded-xl font-bold text-sm shadow-xl shadow-sellit/20 hover:bg-sellit-dark active:scale-95 transition-all flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  <span className="hidden sm:inline">Respond</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-dashed border-gray-200 rounded-[3rem]">
          <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6"><PackageX size={40} /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-400 font-medium max-w-sm">Try adjusting your filters or search keywords.</p>
        </div>
      )}
    </div>
  );
};
