
import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Trash2, X, Check, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  preview: string;
}

interface BroadcastFormProps {
  onBack: () => void;
}

export const BroadcastForm: React.FC<BroadcastFormProps> = ({ onBack }) => {
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostEnabled, setBoostEnabled] = useState(false);
  const [radius, setRadius] = useState('Entire Campus');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    need: '',
    details: '',
    minPrice: '',
    maxPrice: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleBoost = () => {
    if (!boostEnabled) {
      setShowBoostModal(true);
    } else {
      setBoostEnabled(false);
    }
  };

  const confirmBoost = () => {
    setBoostEnabled(true);
    setShowBoostModal(false);
    showToast('Broadcast Boosted!', 'Your request will now get priority placement on campus.', 'success');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        preview: URL.createObjectURL(file)
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    const removed = files.find(f => f.id === id);
    if (removed) URL.revokeObjectURL(removed.preview);
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleBroadcast = () => {
    if (!formData.need) return;
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast('Broadcast Sent!', `Your request is now visible to students in ${radius}.`, 'success');
      setTimeout(() => onBack(), 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-32 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-[#E6F7F0] text-[#00A36C] rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-[#00A36C]/10">
          <Check size={48} className="stroke-[3]" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Broadcast Sent!</h2>
        <p className="text-gray-500 text-xl font-medium max-w-md">Your request has been sent to the {radius}. You'll be notified when someone responds.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="p-2 mb-4 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Broadcast Your Need</h1>
        <p className="text-gray-500 text-lg font-medium">Can't find what you need? Send a broadcast to your campus!</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm relative">
        <div className="space-y-10">
          
          {/* Main Question */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-3">What do you need?</label>
            <input 
              type="text" 
              placeholder="e.g. iPhone 13 pro max 256 GB"
              className="w-full px-6 py-4.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sellit/5 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
              value={formData.need}
              onChange={e => setFormData({...formData, need: e.target.value})}
            />
          </div>

          {/* Details */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-3">Add more details</label>
            <textarea 
              rows={4}
              placeholder="Describe specific requirements, condition preferences, features needed, etc"
              className="w-full px-6 py-4.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sellit/5 transition-all text-gray-900 placeholder:text-gray-400 font-medium resize-none"
              value={formData.details}
              onChange={e => setFormData({...formData, details: e.target.value})}
            />
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Min Price</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter min budget"
                  className="w-full px-6 py-4.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sellit/5 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                  value={formData.minPrice}
                  onChange={e => setFormData({...formData, minPrice: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">Max Price</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter max budget"
                  className="w-full px-6 py-4.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sellit/5 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                  value={formData.maxPrice}
                  onChange={e => setFormData({...formData, maxPrice: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Radius & Boost */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-base font-bold text-gray-800">Choose your Broadcast Radius</label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-500">Boost Broadcast</span>
                <button 
                  onClick={handleToggleBoost}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${boostEnabled ? 'bg-sellit' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${boostEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['My Hostel', 'My Faculty', 'Entire Campus'].map((item) => (
                <button
                  key={item}
                  onClick={() => setRadius(item)}
                  className={`flex items-center gap-4 px-6 py-5 rounded-2xl border transition-all ${
                    radius === item 
                    ? 'border-sellit bg-sellit/5 ring-1 ring-sellit' 
                    : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    radius === item ? 'border-sellit bg-sellit' : 'border-gray-300'
                  }`}>
                    {radius === item && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className={`font-bold ${radius === item ? 'text-sellit' : 'text-gray-600'}`}>{item}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reference Image Upload */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-3">Reference Image</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              multiple 
              accept="image/png, image/jpeg" 
              className="hidden" 
            />
            <div 
              onClick={triggerFileInput}
              className="relative border-2 border-dashed border-[#00687F]/30 rounded-[2rem] p-12 text-center bg-[#F9FBFC] hover:bg-white hover:border-sellit transition-all group cursor-pointer"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-sellit">
                  <Upload size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-gray-900 font-bold">Add Photo (optional)</p>
                  <p className="text-gray-400 text-sm font-medium">Upload an image to help sellers understand what you want</p>
                  <p className="text-gray-400 text-xs font-medium">Only PNG and JPEG formats are supported</p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <h4 className="text-base font-bold text-gray-800">Uploaded Files</h4>
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl group hover:border-sellit/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-50">
                        <img src={file.preview} className="w-full h-full object-cover" alt={file.name} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 max-w-[200px] truncate md:max-w-md">{file.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{file.size}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Button */}
      <div className="mt-10 flex justify-end">
        <button 
          onClick={handleBroadcast}
          className={`px-12 py-4 rounded-2xl font-extrabold text-lg shadow-xl transition-all active:scale-95 flex items-center gap-3 ${
            formData.need 
            ? 'bg-sellit text-white shadow-sellit/20 hover:bg-sellit-dark' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!formData.need || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Sending...</span>
            </>
          ) : (
            <span>Broadcast</span>
          )}
        </button>
      </div>

      {/* Boost Modal Overlay */}
      {showBoostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowBoostModal(false)}
          />
          <div className="relative w-full max-w-[500px] bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowBoostModal(false)}
              className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Boost Your Broadcast</h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Get your request in front of more students, faster and more visible.
                </p>
              </div>

              <div className="text-3xl font-bold text-gray-900">
                N200 <span className="text-lg text-gray-400 font-medium">per Broadcast</span>
              </div>

              <div className="space-y-5 py-4">
                {[
                  'Priority placement on broadcast lists',
                  'Highlighted post for better visibility',
                  'Push notifications to matching sellers'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1">
                      <Check size={18} className="text-gray-900 stroke-[3]" />
                    </div>
                    <p className="text-gray-700 font-medium">{feature}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={confirmBoost}
                className="w-full bg-sellit text-white py-4.5 rounded-[1.5rem] font-extrabold text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98]"
              >
                Boost Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
