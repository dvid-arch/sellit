
import React from 'react';
import { X, Check, MessageSquare, ArrowRight, UserCheck } from 'lucide-react';
import { Offer } from '../types';
import { useToast } from '../context/ToastContext';

interface OfferViewProps {
  offer: Offer;
  onClose: () => void;
  onAccept: (offer: Offer) => void;
}

export const OfferView: React.FC<OfferViewProps> = ({ offer, onClose, onAccept }) => {
  const { showToast } = useToast();

  const handleAccept = () => {
    onAccept(offer);
    showToast('Offer Accepted!', `You can now chat with ${offer.buyerName} to finalize the deal.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end p-4 md:p-6 lg:p-8">
      <div 
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-500 ease-out flex flex-col h-full">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Review Offer</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Product Summary */}
          <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
            <img src={offer.listingImage} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{offer.listingTitle}</h3>
              <p className="text-gray-400 font-bold text-sm">Listed for ₦{offer.originalPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Offer Details */}
          <div className="text-center space-y-4">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Proposed Price</p>
            <div className="inline-flex flex-col items-center">
              <span className="text-6xl font-black text-sellit tracking-tighter">₦{offer.offeredPrice.toLocaleString()}</span>
              <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-extrabold uppercase">
                {Math.round((1 - offer.offeredPrice / offer.originalPrice) * 100)}% below asking
              </div>
            </div>
          </div>

          {/* Buyer Profile */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={offer.buyerAvatar} className="w-14 h-14 rounded-full border border-gray-100" alt="" />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">{offer.buyerName}</h4>
                  <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs mt-0.5">
                    <UserCheck size={14} className="text-[#00A36C]" />
                    University Verified
                  </div>
                </div>
              </div>
              <button className="p-3 bg-gray-50 text-gray-400 hover:text-sellit rounded-2xl transition-all">
                <MessageSquare size={20} />
              </button>
            </div>
            
            <div className="h-px bg-gray-50 w-full" />
            
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Buyer's Message</p>
              <p className="text-gray-600 font-medium leading-relaxed italic bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                "{offer.message}"
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 pt-4">
            <button 
              onClick={handleAccept}
              className="w-full bg-sellit text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <Check size={24} />
              Accept & Start Chat
            </button>
            <button 
              onClick={() => {
                onClose();
                showToast('Offer Declined', 'The buyer has been notified.', 'info');
              }}
              className="w-full bg-white text-gray-500 border border-gray-200 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-gray-50 transition-all"
            >
              Decline Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
