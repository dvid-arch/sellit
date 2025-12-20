
import React, { useEffect, useState, useRef } from 'react';
import { 
  X, MapPin, MessageSquare, CheckCircle2, Tag, Loader2, Clock, 
  Edit3, Check, BarChart3, ShieldCheck, CreditCard, ArrowRightLeft, 
  Zap, Key, ShieldAlert, Lock
} from 'lucide-react';
import { Listing, Offer, Chat } from '../types';
import { useToast } from '../context/ToastContext';

interface ProductDetailProps {
  listing: Listing;
  userOffer?: Offer;
  receivedOffers?: Offer[]; 
  existingChat?: Chat;
  lastViewedPrice?: number;
  isOwner?: boolean;
  isSaved?: boolean;
  onClose: () => void;
  onContact?: () => void;
  onMakeOffer?: (amount: number, message: string) => void;
  onWithdrawOffer?: (offerId: string) => void;
  onToggleSave?: (id: string) => void;
  onMarkSold?: (id: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCommitToBuy?: (amount: number) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  listing, 
  onClose, 
  onContact, 
  onMarkSold,
  onEdit,
  onCommitToBuy,
  isOwner
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [releaseCodeInput, setReleaseCodeInput] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  
  // Closing sequence state
  const [isClosing, setIsClosing] = useState(false);
  
  // Gesture states
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  
  const productImages = listing.images && listing.images.length > 0 ? listing.images : [listing.imageUrl];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      if (index !== currentIdx) setCurrentIdx(index);
    }
  };

  const handleStartClose = () => {
    setIsClosing(true);
    // Wait for animation duration (0.3s) before calling the parent's close function
    setTimeout(onClose, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    
    // Only allow dragging downwards
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If dragged more than 15% of the viewport height, close the sheet
    if (dragOffset > window.innerHeight * 0.15) {
      handleStartClose();
    } else {
      // Snap back to top
      setDragOffset(0);
    }
  };

  const handleCommitPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      if (onCommitToBuy) onCommitToBuy(listing.price);
    }, 2000);
  };

  const triggerPayout = () => {
    if (onMarkSold) onMarkSold(listing.id);
    showToast('Funds Released!', `₦${listing.price.toLocaleString()} is headed to the seller.`, 'success');
    handleStartClose();
  };

  const handleVerifyReleaseCode = () => {
    if (isLocked) return;
    setIsVerifyingCode(true);
    setTimeout(() => {
      setIsVerifyingCode(false);
      if (releaseCodeInput === '8291') {
        triggerPayout();
      } else {
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);
        setReleaseCodeInput('');
        if (remaining <= 0) {
          setIsLocked(true);
          showToast('Security Lock', 'Transaction frozen for safety.', 'error');
        } else {
          showToast('Invalid Code', `Incorrect code. ${remaining} attempts left.`, 'warning');
        }
      }
    }, 1500);
  };

  const renderActionArea = () => {
    if (listing.status === 'sold') return null;

    if (listing.status === 'committed' && isOwner) {
      return (
        <div className="space-y-6">
          <div className={`rounded-[2.5rem] p-8 border-2 border-dashed transition-all ${
            isLocked ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mb-4 transition-colors ${
                isLocked ? 'bg-white text-red-600' : 'bg-white text-blue-600'
              }`}>
                {isLocked ? <Lock size={32} /> : <Key size={32} />}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                {isLocked ? 'Transaction Frozen' : 'Claim Your Payout'}
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {isLocked 
                  ? 'The buyer must manually release these funds from their dashboard.' 
                  : 'Enter the 4-digit code provided by the buyer to receive your money.'}
              </p>
            </div>
            {!isLocked && (
              <div className="space-y-4">
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="0 0 0 0"
                  className="w-full bg-white border-2 border-blue-100 rounded-2xl py-4 px-6 text-center text-2xl font-black tracking-[0.5em] text-blue-600 focus:border-blue-400 outline-none transition-all placeholder:text-blue-100"
                  value={releaseCodeInput}
                  onChange={(e) => setReleaseCodeInput(e.target.value.replace(/[^0-9]/g, ''))}
                />
                <button 
                  onClick={handleVerifyReleaseCode}
                  disabled={releaseCodeInput.length < 4 || isVerifyingCode}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isVerifyingCode ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                  <span>Verify Code</span>
                </button>
              </div>
            )}
          </div>
          <button onClick={onContact} className="w-full bg-white border-2 border-gray-100 text-gray-900 py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
            <MessageSquare size={22} />
            <span>Chat with Buyer</span>
          </button>
        </div>
      );
    }

    if (listing.status === 'committed') {
      return (
        <div className="space-y-6">
          <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-[2.5rem] p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600 mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Item Secured!</h3>
            <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">Give the seller this code after you've inspected the item:</p>
            <div className="bg-white py-6 px-4 rounded-[2rem] border-2 border-green-100 shadow-sm relative overflow-hidden mb-6">
              <span className="text-5xl font-black text-green-600 tracking-[0.2em] block">8291</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-orange-600 bg-orange-50 py-3 px-4 rounded-xl border border-orange-100">
              <ShieldAlert size={14} className="shrink-0" />
              <span>Only share the code ONCE YOU HAVE THE ITEM.</span>
            </div>
          </div>
          <button onClick={onContact} className="w-full bg-sellit text-white py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-sellit/20 active:scale-95 transition-all">
            <MessageSquare size={22} />
            <span>Message Seller</span>
          </button>
        </div>
      );
    }

    if (isOwner) {
      return (
        <div className="space-y-6">
          <div className="bg-sellit/5 rounded-[2.5rem] p-8 border border-sellit/10 text-center">
             <BarChart3 size={24} className="text-sellit mx-auto mb-3" />
             <p className="text-sm font-black text-gray-900">{listing.viewCount || 0} students have viewed your ad.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={onEdit} className="bg-white border-2 border-gray-100 text-gray-900 py-4.5 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
              <Edit3 size={18} /> Edit Ad
            </button>
            <button onClick={() => onMarkSold?.(listing.id)} className="bg-gray-900 text-white py-4.5 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
              <CheckCircle2 size={18} /> Mark Sold
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <button onClick={() => setShowPaymentModal(true)} className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-gray-900/20 hover:bg-black transition-all active:scale-95">
          <CreditCard size={22} />
          <span>Commit to Buy (Escrow)</span>
        </button>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white text-sellit py-4 rounded-[1.5rem] font-bold text-sm flex items-center justify-center gap-2 border-2 border-sellit/20 transition-all active:scale-95">
            <Tag size={18} />
            <span>Make Offer</span>
          </button>
          <button onClick={onContact} className="bg-sellit text-white py-4 rounded-[1.5rem] font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-sellit/20 transition-all active:scale-95">
            <MessageSquare size={18} />
            <span>Chat Seller</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:justify-end pointer-events-none">
      {/* Background Overlay */}
      <div 
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] pointer-events-auto transition-all ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`} 
        onClick={handleStartClose} 
      />
      
      {/* Product Drawer / Bottom Sheet */}
      <div 
        style={{ 
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
        className={`relative w-full h-[92vh] md:h-[calc(100vh-2rem)] md:m-4 md:max-w-xl bg-white shadow-2xl flex flex-col pointer-events-auto rounded-t-[3rem] md:rounded-[2.5rem] overflow-hidden ${
          isClosing 
            ? 'animate-slide-down md:animate-slide-out-right' 
            : 'animate-slide-up md:animate-slide-in-right'
        }`}
      >
        
        {/* Drag Handle & Header Area */}
        <div 
          className="w-full pt-3 pb-3 shrink-0 cursor-grab active:cursor-grabbing touch-none flex flex-col items-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Visual Handle Bar */}
          <div className="md:hidden w-12 h-1.5 bg-gray-200 rounded-full mb-2" />
          
          <div className="w-full flex items-center justify-between px-6 py-2 md:px-8 md:py-4">
            <h2 className="text-xl md:text-2xl font-black text-gray-900">Product Info</h2>
            <button onClick={handleStartClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors pointer-events-auto">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 md:pb-8 p-4 md:p-8">
           <div className="relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden mb-8 bg-gray-50 shadow-inner">
              <div ref={scrollRef} onScroll={handleScroll} className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {productImages.map((img, i) => (
                  <div key={i} className="min-w-full h-full snap-center">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {productImages.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${currentIdx === i ? 'bg-white w-4' : 'bg-white/40'}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">{listing.title}</h1>
                <div className="flex items-center gap-4 text-gray-400 font-bold text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><MapPin size={14} /><span>{listing.location}</span></div>
                  <div className="flex items-center gap-1.5"><Clock size={14} /><span>Verified Ad</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Price</span>
                  <span className="text-2xl md:text-4xl font-black text-sellit tracking-tight">₦{listing.price.toLocaleString()}</span>
                </div>
                {listing.isNegotiable && listing.status === 'available' && <span className="bg-sellit/10 text-sellit px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Open to Offers</span>}
              </div>

              <div className="prose prose-sm max-w-none">
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-3">Item Description</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{listing.description}</p>
              </div>

              {renderActionArea()}
            </div>
        </div>
      </div>

      {/* Payment Modal Overlay */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowPaymentModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {paymentStep === 'checkout' && (
              <div className="flex flex-col">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black">S</div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">Secure Checkout</p>
                      <p className="text-[10px] font-bold text-gray-400">Escrow Protection</p>
                    </div>
                  </div>
                  <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-8 text-center">
                   <div>
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total to Secure</p>
                     <p className="text-5xl font-black text-gray-900 tracking-tighter">₦{listing.price.toLocaleString()}</p>
                   </div>
                   <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-left">
                     <p className="text-[10px] font-bold text-amber-800 leading-relaxed">Safety Protocol: Funds are held by Sellit. Release to seller only after you confirm pickup.</p>
                   </div>
                   <button onClick={handleCommitPayment} className="w-full bg-sellit text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98]">
                      Pay Now
                   </button>
                </div>
              </div>
            )}
            {paymentStep === 'processing' && (
              <div className="p-20 text-center space-y-6">
                 <Loader2 className="w-16 h-16 text-sellit animate-spin mx-auto" />
                 <h2 className="text-2xl font-black text-gray-900">Securing Funds...</h2>
              </div>
            )}
            {paymentStep === 'success' && (
              <div className="p-12 text-center space-y-8">
                 <div className="w-24 h-24 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
                    <Check size={56} strokeWidth={3} />
                 </div>
                 <h2 className="text-4xl font-black text-gray-900">Success!</h2>
                 <p className="text-gray-500 font-medium leading-relaxed">Your payment is safe. Use code <span className="font-black text-gray-900 bg-gray-100 px-2 py-1 rounded">8291</span> at meetup.</p>
                 <button onClick={() => { setShowPaymentModal(false); handleStartClose(); }} className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl active:scale-95 transition-all">
                    Done
                 </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
