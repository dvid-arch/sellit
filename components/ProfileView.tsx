
import React, { useState, useMemo } from 'react';
import { 
  User, Package, History, Radio, Settings, Edit2, 
  MapPin, Star, CheckCircle2, MoreVertical, Trash2, 
  Eye, ExternalLink, Calendar, Plus, Lock, X, EyeOff, Loader2, Check,
  ChevronRight, Camera, GraduationCap, BarChart3, Clock, XCircle, Edit3, MessageSquare, Handshake,
  Building2, CreditCard, Info, Zap, ShieldCheck, ArrowRightLeft, ShoppingCart, AlertCircle
} from 'lucide-react';
import { User as UserType, Listing, Offer, OfferStatus, BankDetails, Transaction } from '../types';
import { useToast } from '../context/ToastContext';
import { OfferView } from './OfferView';

interface ProfileViewProps {
  user: UserType | null;
  listings: Listing[];
  offers: Offer[];
  onEditListing: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  onMarkSold: (id: string) => void;
  onBoostListing: (id: string) => void;
  onAddProductClick: () => void;
  onOpenListing: (listing: Listing) => void;
  onAcceptOffer: (offer: Offer) => void;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    listingId: '2',
    listingTitle: 'HP Laptop',
    amount: 250000,
    type: 'sell',
    status: 'released',
    timestamp: Date.now() - 86400000 * 2,
    partnerName: 'Tunde James'
  },
  {
    id: 'tx_2',
    listingId: '5',
    listingTitle: 'Engineering Textbooks',
    amount: 12000,
    type: 'buy',
    status: 'released',
    timestamp: Date.now() - 86400000 * 5,
    partnerName: 'Prof. Adebayo'
  }
];

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  listings, 
  offers,
  onEditListing, 
  onDeleteListing, 
  onMarkSold,
  onBoostListing,
  onAddProductClick,
  onOpenListing,
  onAcceptOffer
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'offers' | 'history' | 'settings'>('listings');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  const [showBoostCheckout, setShowBoostCheckout] = useState<Listing | null>(null);
  const [boostPaymentStep, setBoostPaymentStep] = useState<'selection' | 'processing' | 'success'>('selection');
  
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  const { showToast } = useToast();

  const [bankForm, setBankForm] = useState<BankDetails>(user?.bankDetails || {
    bankName: 'GT Bank',
    accountNumber: '0123456789',
    accountName: user?.name || 'Obokobong'
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Obokobong',
    hostel: 'NDDC Hostel',
    campus: 'University of Lagos',
    phone: user?.phone || '+234 812 345 6789'
  });

  const activeListings = listings.filter(l => l.status === 'available' || l.status === 'committed');
  const receivedOffers = useMemo(() => offers.filter(o => o.status === 'pending' && listings.some(l => l.id === o.listingId)), [offers, listings]);

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBank(true);
    setTimeout(() => {
      setIsSavingBank(false);
      showToast('Payout Details Saved', 'Funds from sales will be sent to this account.', 'success');
    }, 1200);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setTimeout(() => {
      setIsUpdatingProfile(false);
      setShowEditProfileModal(false);
      showToast('Profile Updated', 'Your campus identity has been refreshed.', 'success');
    }, 1200);
  };

  const processBoostPayment = () => {
    if (!showBoostCheckout) return;
    setBoostPaymentStep('processing');
    setTimeout(() => {
        setBoostPaymentStep('success');
        onBoostListing(showBoostCheckout.id);
    }, 1800);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-28 md:pb-12">
      <div className="relative bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8">
        <div className="h-32 md:h-48 bg-sellit relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-sellit-dark via-sellit to-sellit opacity-90" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>
        
        <div className="px-6 md:px-12 pb-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden bg-white">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300" className="w-full h-full object-cover" alt="Profile" />
              </div>
              <button className="absolute bottom-2 right-2 p-2.5 bg-white rounded-2xl shadow-xl text-sellit hover:scale-110 transition-transform border border-gray-100">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="flex-1 md:pb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">{profileForm.name}</h1>
                <div className="bg-sellit/10 text-sellit p-1.5 rounded-xl" title="Campus Verified"><ShieldCheck size={20} /></div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 font-bold text-sm">
                <div className="flex items-center gap-2"><MapPin size={16} /><span>{profileForm.hostel}</span></div>
                <div className="flex items-center gap-2"><GraduationCap size={16} /><span>{profileForm.campus}</span></div>
                <div className="flex items-center gap-2 text-sellit bg-sellit/5 px-3 py-1 rounded-lg"><Star size={14} className="fill-current" /><span>4.9 Seller Rating</span></div>
              </div>
            </div>

            <div className="md:pb-4 flex gap-3">
              <button onClick={() => setShowEditProfileModal(true)} className="px-6 py-4 bg-gray-50 text-gray-900 rounded-[1.25rem] font-black text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all active:scale-95">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8 bg-gray-100/50 p-2 rounded-[1.5rem] w-full md:w-fit overflow-x-auto scrollbar-hide">
        {[
          { id: 'listings', label: 'My Ads', icon: Package },
          { id: 'offers', label: 'Offers', icon: Handshake, count: receivedOffers.length },
          { id: 'history', label: 'Transactions', icon: History },
          { id: 'settings', label: 'Payouts', icon: Building2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 md:px-8 py-3 rounded-[1.25rem] text-xs md:text-sm font-black transition-all whitespace-nowrap relative ${
              activeSubTab === tab.id 
                ? 'bg-white text-sellit shadow-lg shadow-sellit/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sellit text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-500">
        {activeSubTab === 'listings' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {activeListings.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div onClick={() => onOpenListing(item)} className="relative aspect-square cursor-pointer overflow-hidden bg-gray-50">
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onEditListing(item); }} className="p-2 bg-white/90 rounded-xl text-gray-600 hover:text-sellit shadow-sm backdrop-blur-sm transition-all"><Edit2 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteListing(item.id); }} className="p-2 bg-white/90 rounded-xl text-gray-600 hover:text-red-500 shadow-sm backdrop-blur-sm transition-all"><Trash2 size={16} /></button>
                  </div>
                  {item.status === 'committed' && (
                    <div className="absolute inset-0 bg-blue-600/40 backdrop-blur-[2px] flex items-center justify-center">
                       <div className="bg-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
                          <Clock size={16} className="text-blue-600 animate-pulse" />
                          <span className="text-[10px] font-black text-blue-600 uppercase">Awaiting Pickup</span>
                       </div>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
                    {item.isUrgent && <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
                  </div>
                  <p className="text-xl font-black text-sellit mt-auto">₦{item.price.toLocaleString()}</p>
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <button 
                      onClick={() => setShowBoostCheckout(item)}
                      disabled={item.isBoosted || item.status !== 'available'}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        item.isBoosted 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : item.status !== 'available'
                          ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                          : 'bg-sellit/[0.05] text-sellit border-sellit/10 hover:bg-sellit hover:text-white'
                      }`}
                    >
                      {item.isBoosted ? <Check size={12} /> : <Zap size={12} fill="currentColor" />}
                      {item.isBoosted ? 'Boost Active' : 'Boost Ad'}
                    </button>
                    {item.status === 'available' && (
                      <button onClick={() => onMarkSold(item.id)} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100 hover:bg-gray-50 transition-all">
                        <CheckCircle2 size={12} /> Mark as Sold
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAddProductClick} className="aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-sellit hover:text-sellit hover:bg-sellit/[0.02] transition-all bg-white/50 group">
               <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center group-hover:bg-sellit/10 transition-all">
                 <Plus size={32} />
               </div>
               <span className="font-black text-xs uppercase tracking-widest">New Listing</span>
            </button>
          </div>
        )}

        {activeSubTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-black text-gray-900">Received Offers</h2>
              <span className="bg-sellit/10 text-sellit px-3 py-1 rounded-full text-xs font-black">{receivedOffers.length}</span>
            </div>
            {receivedOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {receivedOffers.map(offer => (
                   <div key={offer.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <img src={offer.buyerAvatar} className="w-12 h-12 rounded-full border border-gray-50 shadow-sm" alt="" />
                           <div>
                              <p className="font-black text-gray-900 leading-tight">{offer.buyerName}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{offer.timestamp}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-gray-400 uppercase mb-1">Offered</p>
                           <p className="text-2xl font-black text-sellit leading-tight">₦{offer.offeredPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-4 border border-gray-100/50">
                        <img src={offer.listingImage} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                        <div className="min-w-0">
                           <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-tight">{offer.listingTitle}</p>
                           <p className="text-[10px] font-bold text-gray-400">Listed at ₦{offer.originalPrice.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                         <button onClick={() => setSelectedOffer(offer)} className="flex-1 bg-sellit text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-95">Review</button>
                      </div>
                   </div>
                 ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center bg-white border border-dashed border-gray-200 rounded-[3rem]">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6">
                  <Handshake size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No active offers</h3>
                <p className="text-gray-400 font-medium max-w-xs">When students bid on your items, they'll show up here for review.</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'history' && (
          <div className="space-y-4">
             {MOCK_TRANSACTIONS.map(tx => (
               <div key={tx.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-sellit/20 transition-all animate-in slide-in-from-left duration-500">
                 <div className="flex items-center gap-5">
                   <div className={`p-4 rounded-[1.5rem] ${tx.type === 'sell' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                     {tx.type === 'sell' ? <ArrowRightLeft size={24} /> : <ShoppingCart size={24} />}
                   </div>
                   <div>
                     <p className="font-black text-gray-900 text-lg leading-tight">{tx.listingTitle}</p>
                     <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                       {tx.type === 'sell' ? `Sold to ${tx.partnerName}` : `Bought from ${tx.partnerName}`} 
                       <span className="w-1 h-1 bg-gray-300 rounded-full" />
                       {new Date(tx.timestamp).toLocaleDateString()}
                     </p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className={`text-xl font-black ${tx.type === 'sell' ? 'text-green-600' : 'text-gray-900'}`}>
                     {tx.type === 'sell' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                   </p>
                   <div className="mt-1 inline-flex items-center gap-1.5 bg-sellit/5 px-2.5 py-1 rounded-lg border border-sellit/10 text-[9px] font-black text-sellit uppercase tracking-widest">
                      <ShieldCheck size={10} /> Escrow Released
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-sellit/5 text-sellit rounded-2xl"><Building2 size={32} /></div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Payout Details</h3>
                  <p className="text-gray-500 font-medium">Configure where your campus earnings go.</p>
                </div>
              </div>

              <form onSubmit={handleSaveBankDetails} className="space-y-6">
                <div className="space-y-6">
                   <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3 mb-4">
                      <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-[10px] font-bold text-blue-700 leading-relaxed">Payments are automatically disbursed to this account once the buyer releases the 4-digit code.</p>
                   </div>
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">Bank Name</label>
                    <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-bold text-gray-900 appearance-none" value={bankForm.bankName} onChange={e => setBankForm({...bankForm, bankName: e.target.value})}>
                        <option>GT Bank</option>
                        <option>Access Bank</option>
                        <option>First Bank</option>
                        <option>Zenith Bank</option>
                        <option>Kuda MFB</option>
                        <option>OPay</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">Account Number</label>
                      <input required type="text" maxLength={10} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-bold text-gray-900 tracking-wider" value={bankForm.accountNumber} onChange={e => setBankForm({...bankForm, accountNumber: e.target.value.replace(/[^0-9]/g, '')})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">Account Name</label>
                      <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-bold text-gray-900" value={bankForm.accountName} onChange={e => setBankForm({...bankForm, accountName: e.target.value})} />
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={isSavingBank} className="w-full bg-sellit text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                  {isSavingBank ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} />}
                  <span>Save Payout Account</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {showEditProfileModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowEditProfileModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
               <h2 className="text-2xl font-black text-gray-900">Edit Identity</h2>
               <button onClick={() => setShowEditProfileModal(false)} className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">Full Name</label>
                    <input required type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-bold text-gray-900" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">Campus Location</label>
                    <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-bold text-gray-900 appearance-none" value={profileForm.campus} onChange={e => setProfileForm({...profileForm, campus: e.target.value})}>
                        <option>University of Lagos</option>
                        <option>UNIBEN</option>
                        <option>UI Ibadan</option>
                        <option>Lagos State University</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">Hostel / Hall</label>
                    <input required type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-bold text-gray-900" value={profileForm.hostel} onChange={e => setProfileForm({...profileForm, hostel: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">Phone Number</label>
                    <input required type="tel" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sellit/10 transition-all font-bold text-gray-900" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                  </div>
                </div>
                <button type="submit" disabled={isUpdatingProfile} className="w-full bg-sellit text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98] disabled:opacity-50">
                  {isUpdatingProfile ? <Loader2 size={24} className="animate-spin" /> : 'Update Identity'}
                </button>
            </form>
          </div>
        </div>
      )}

      {showBoostCheckout && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowBoostCheckout(null)} />
              <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  {boostPaymentStep === 'selection' && (
                      <div className="p-10 space-y-8">
                          <div className="text-center">
                              <div className="w-16 h-16 bg-sellit/10 text-sellit rounded-2xl flex items-center justify-center mx-auto mb-4">
                                  <Zap size={32} fill="currentColor" />
                              </div>
                              <h2 className="text-3xl font-black text-gray-900 mb-2">Priority Boost</h2>
                              <p className="text-gray-500 font-medium text-sm leading-relaxed">Get featured placement and reach more students instantly for 7 days.</p>
                          </div>

                          <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-sm truncate">{showBoostCheckout.title}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">7-Day Premium Placement</p>
                              </div>
                              <span className="text-2xl font-black text-sellit ml-4">₦100</span>
                          </div>

                          <div className="space-y-3">
                             {['Pin to top of feed', 'Priority in search results', 'Highlight in campus newsletter'].map((f, i) => (
                               <div key={i} className="flex items-center gap-3 text-gray-500 font-bold text-xs">
                                  <div className="w-5 h-5 bg-green-50 text-green-500 rounded-full flex items-center justify-center"><Check size={12} /></div>
                                  <span>{f}</span>
                               </div>
                             ))}
                          </div>

                          <button onClick={processBoostPayment} className="w-full bg-sellit text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98]">
                              Secure Boost
                          </button>
                          
                          <button onClick={() => setShowBoostCheckout(null)} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Maybe later</button>
                      </div>
                  )}

                  {boostPaymentStep === 'processing' && (
                      <div className="p-20 text-center space-y-6">
                          <Loader2 className="w-16 h-16 text-sellit animate-spin mx-auto" />
                          <h2 className="text-2xl font-black text-gray-900">Setting up boost...</h2>
                          <p className="text-sm font-medium text-gray-400">Talking to our campus banking partner</p>
                      </div>
                  )}

                  {boostPaymentStep === 'success' && (
                      <div className="p-12 text-center space-y-8">
                          <div className="w-20 h-20 bg-sellit text-white rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-sellit/20">
                              <Check size={40} strokeWidth={3} />
                          </div>
                          <div>
                              <h2 className="text-4xl font-black text-gray-900 mb-2">Boosted!</h2>
                              <p className="text-gray-500 font-medium text-sm">Your ad "{showBoostCheckout.title}" is now priority on campus.</p>
                          </div>
                          <button onClick={() => setShowBoostCheckout(null)} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg active:scale-95 transition-all">
                              Continue
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {selectedOffer && (
        <OfferView 
          offer={selectedOffer} 
          onClose={() => setSelectedOffer(null)} 
          onAccept={(o) => {
            onAcceptOffer(o);
            setSelectedOffer(null);
          }} 
        />
      )}
    </div>
  );
};
