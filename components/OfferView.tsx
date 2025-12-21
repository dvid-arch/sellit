
import React, { useState, useMemo } from 'react';
import { 
  X, Check, MessageSquare, ArrowRight, UserCheck, 
  Loader2, PartyPopper, TrendingDown, Scale, 
  Handshake, ShieldCheck, Zap, Info
} from 'lucide-react';
import { Offer } from '../types';
import { useToast } from '../context/ToastContext';

interface OfferViewProps {
  offer: Offer;
  onClose: () => void;
  onAccept: (offer: Offer) => void;
}

export const OfferView: React.FC<OfferViewProps> = ({ offer, onClose, onAccept }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [view, setView] = useState<'review' | 'counter'>('review');
  const { showToast } = useToast();

  const priceDiff = offer.originalPrice - offer.offeredPrice;
  const percentDiff = Math.round((priceDiff / offer.originalPrice) * 100);
  
  // Smart counter-offer logic
  const splitDifference = useMemo(() => {
    return Math.round((offer.originalPrice + offer.offeredPrice) / 2);
  }, [offer]);

  const handleAccept = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        onAccept(offer);
      }, 1500);
    }, 1200);
  };

  const handleSendCounter = (price: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      showToast('Counter Sent', `You suggested ₦${price.toLocaleString()}`, 'success');
      onClose();
    }, 1000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-sellit/30 backdrop-blur-2xl animate-in fade-in duration-500" />
        <div className="relative bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 max-w-sm w-full border border-white/20">
           <div className="w-24 h-24 bg-sellit text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
              <PartyPopper size={48} />
           </div>
           <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Deal Locked!</h2>
           <p className="text-gray-500 font-medium leading-relaxed">Transitioning to chat with <span className="text-gray-900 font-bold">{offer.buyerName}</span> to finalize.</p>
           <div className="mt-8 flex justify-center">
             <Loader2 className="animate-spin text-sellit" size={24} />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-[#F8FAFB] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-400 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 bg-white border-b border-gray-100 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-sellit/10 text-sellit p-1 rounded-md"><Handshake size={14} /></span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Negotiation Table</h2>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Decision Required</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide">
          {/* Price Comparison Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Scale size={80} />
            </div>
            
            <div className="grid grid-cols-2 gap-8 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Asking Price</p>
                <p className="text-2xl font-black text-gray-400 line-through decoration-2">₦{offer.originalPrice.toLocaleString()}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-black text-sellit uppercase tracking-widest">Their Best Offer</p>
                <p className="text-4xl font-black text-sellit tracking-tighter">₦{offer.offeredPrice.toLocaleString()}</p>
              </div>
            </div>

            {/* Visual Gap Indicator */}
            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Value Gap</span>
                <span className="text-orange-500">-{percentDiff}% of asking</span>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-1">
                <div 
                  className="h-full bg-sellit rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${100 - percentDiff}%` }}
                />
              </div>
            </div>
          </div>

          {/* Buyer Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 flex items-center gap-4 shadow-sm">
              <img src={offer.buyerAvatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sellit/10" alt="" />
              <div>
                <p className="font-black text-gray-900 leading-tight">{offer.buyerName}</p>
                <div className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] mt-1 uppercase tracking-widest">
                  <ShieldCheck size={12} />
                  <span>Campus Verified</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-50/50 rounded-[2rem] p-6 border border-orange-100 flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-1">
                 <TrendingDown size={14} className="text-orange-500" />
                 <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Savings Context</p>
               </div>
               <p className="text-xs font-bold text-gray-600">
                 Accepting this saves you <span className="text-orange-600 font-black">₦{priceDiff.toLocaleString()}</span> in time & potential reposts.
               </p>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
               <MessageSquare size={16} className="text-gray-400" />
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Buyer's Message</p>
            </div>
            <p className="text-gray-600 font-medium leading-relaxed italic border-l-4 border-sellit/20 pl-4">
              "{offer.message}"
            </p>
          </div>
        </div>

        {/* Dynamic Action Footer */}
        <div className="p-8 md:p-10 bg-white border-t border-gray-100 shrink-0">
          {view === 'review' ? (
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleAccept}
                disabled={isProcessing}
                className="w-full bg-sellit text-white py-5 rounded-[1.75rem] font-black text-lg shadow-2xl shadow-sellit/30 hover:bg-sellit-dark transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} strokeWidth={3} />}
                <span>Accept & Move to Chat</span>
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setView('counter')}
                  className="bg-gray-50 text-gray-900 border border-gray-200 py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <TrendingDown size={16} /> Counter Offer
                </button>
                <button 
                  onClick={onClose}
                  className="bg-white text-gray-400 border border-transparent py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Select Counter Strategy</h3>
                 <button onClick={() => setView('review')} className="text-xs font-bold text-sellit hover:underline">Cancel</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleSendCounter(splitDifference)}
                  className="group flex flex-col items-center justify-center p-6 bg-sellit/[0.03] border-2 border-sellit/10 rounded-[2rem] hover:border-sellit hover:bg-sellit/5 transition-all text-center"
                >
                  <span className="text-[10px] font-black text-sellit uppercase tracking-widest mb-1">Fair Middle</span>
                  <span className="text-2xl font-black text-sellit mb-1">₦{splitDifference.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-gray-400">Splits the ₦{priceDiff.toLocaleString()} gap</span>
                </button>
                
                <button 
                  onClick={() => handleSendCounter(offer.originalPrice)}
                  className="group flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-transparent rounded-[2rem] hover:border-gray-900 hover:bg-gray-100 transition-all text-center"
                >
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Keep Price</span>
                  <span className="text-2xl font-black text-gray-900 mb-1">₦{offer.originalPrice.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-gray-400">Firm on asking price</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 justify-center">
                 <Info size={12} />
                 <span>Suggesting a counter keeps the buyer engaged.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
