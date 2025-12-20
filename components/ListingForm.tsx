
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Sparkles, Loader2, Upload, Trash2, 
  ChevronLeft, ChevronRight, Edit3, Check,
  MapPin, CheckCircle2
} from 'lucide-react';
import { geminiService } from '../services/gemini';
import { useToast } from '../context/ToastContext';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf';
  preview?: string;
}

interface ListingFormProps {
  onClose: () => void;
  onSubmit: (listing: any) => void;
  initialData?: any; // To support Edit mode
}

export const ListingForm: React.FC<ListingFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [step, setStep] = useState<'details' | 'preview'>('details');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentPreviewIdx, setCurrentPreviewIdx] = useState(0);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    condition: initialData?.condition || 'Fairly used',
    category: initialData?.category || 'Home and furniture',
    price: initialData?.price?.toString() || '',
    isNegotiable: initialData?.isNegotiable ?? true,
    campus: initialData?.campus || 'University of Lagos',
    location: initialData?.location || '',
    isUrgent: initialData?.isUrgent || false,
    notes: '' 
  });

  useEffect(() => {
    if (initialData?.imageUrl) {
      setFiles([{
        id: 'initial',
        name: 'Product Image',
        size: 'N/A',
        type: 'image',
        preview: initialData.imageUrl
      }]);
    }
  }, [initialData]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        preview: file.type.includes('image') ? URL.createObjectURL(file) : undefined
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove?.preview && id !== 'initial') URL.revokeObjectURL(fileToRemove.preview);
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMagicFill = async () => {
    if (!formData.title || step === 'preview') return;
    setLoading(true);
    try {
      const [description, suggestedPrice] = await Promise.all([
        geminiService.generateDescription(formData.title, formData.condition),
        geminiService.suggestPrice(formData.title, formData.condition)
      ]);
      setFormData(prev => ({
        ...prev,
        description,
        price: Math.round(suggestedPrice).toLocaleString()
      }));
      showToast('Magic Description Created!', 'Gemini AI has optimized your product details.', 'success');
    } catch (err) {
      console.error(err);
      showToast('AI Failure', 'Unable to generate details. Please try manually.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 'details') {
      if (formData.notes) return; 
      setStep('preview');
    } else {
      if (initialData) {
        finalSubmit(); // No premium modal for updates
      } else {
        setShowPremiumModal(true);
      }
    }
  };

  const finalSubmit = () => {
    if (formData.notes) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price.replace(/[^0-9.]/g, '')) || 0,
        imageUrl: files.find(f => f.type === 'image')?.preview || ''
      });
      setIsSubmitting(false);
      showToast(
        initialData ? 'Update Saved!' : 'Product Published!', 
        initialData ? 'Your listing has been updated.' : 'Your product is now live on Sellit.', 
        'success'
      );
    }, 1000);
  };

  const isPreview = step === 'preview';

  return (
    <div className="flex flex-col h-full bg-[#F8FAFB] animate-in fade-in duration-500">
      <div className="px-12 pt-10 pb-6 shrink-0">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{initialData ? 'Edit Listing' : 'Add Product'}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-12 pb-12 scrollbar-hide">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col lg:flex-row gap-12">
          <div className="sr-only opacity-0 h-0 w-0" aria-hidden="true">
            <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>

          <div className="flex-1 space-y-8 min-h-[500px]">
            {!isPreview ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-sellit/30 rounded-[2rem] p-12 text-center bg-[#F9FBFC] hover:bg-white hover:border-sellit transition-all group cursor-pointer">
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" accept="image/*" />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-sellit transition-colors"><Upload size={32} /></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Upload Product Photos</h3>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">Click to browse or drag and drop your files here</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <h4 className="text-lg font-bold text-gray-800">Files ({files.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl group hover:border-sellit/30 transition-all">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-50 flex items-center justify-center shrink-0">
                            {file.type === 'pdf' ? <div className="text-sellit font-bold text-xs">PDF</div> : <img src={file.preview} className="w-full h-full object-cover" alt={file.name} />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate text-sm">{file.name}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{file.size}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFile(file.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"><Trash2 size={20} /></button>
                      </div>
                    ))}
                    {files.length === 0 && <div className="col-span-full py-12 text-center text-gray-400 font-medium bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">No images uploaded yet</div>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                <h2 className="text-3xl font-bold text-gray-900">Preview</h2>
                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-gray-100 group shadow-sm border border-gray-100">
                  {files.filter(f => f.type === 'image').length > 0 ? <img src={files.filter(f => f.type === 'image')[currentPreviewIdx]?.preview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 italic font-medium">No images uploaded</div>}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[480px] shrink-0">
            <div className="flex items-center justify-between mb-8 h-10"><h2 className="text-2xl font-bold text-gray-900">Product Info</h2>{isPreview && <button onClick={() => setStep('details')} className="flex items-center gap-2 px-4 py-2 border border-sellit text-sellit rounded-xl font-bold text-sm hover:bg-sellit/5 transition-all"><Edit3 size={16} />Edit Details</button>}</div>
            <div className={`space-y-6 ${isPreview ? 'opacity-70 pointer-events-none' : ''}`}>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Title</label><input type="text" disabled={isPreview} maxLength={80} placeholder="e.g. iPhone 13 pro max 256 GB" className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-medium text-gray-900" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Description</label><textarea rows={4} disabled={isPreview} maxLength={500} placeholder="Describe your item details..." className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-medium resize-none text-gray-900" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Condition</label><select disabled={isPreview} className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-bold appearance-none text-gray-900" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}><option>Brand New</option><option>Like New</option><option>Fairly used</option></select></div>
                <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Category</label><select disabled={isPreview} className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-bold appearance-none text-gray-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option>Electronics</option><option>Books</option><option>Fashion</option><option>Kitchen</option></select></div>
              </div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-1">Price (₦)</label><div className="relative"><input type="text" disabled={isPreview} placeholder="Enter price in Naira" className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sellit/5 transition-all font-bold text-gray-900" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value.replace(/[^0-9]/g, '').slice(0, 10)})} />{!isPreview && <button onClick={handleMagicFill} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-sellit hover:bg-sellit/5 rounded-lg transition-all">{loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}</button>}</div></div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-start gap-4">
          <button onClick={handleNext} className={`px-16 py-4 bg-sellit text-white rounded-2xl font-bold text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98] disabled:opacity-50 ${isSubmitting ? 'cursor-wait' : ''}`} disabled={!formData.title || loading || isSubmitting}>
            {isPreview ? (isSubmitting ? 'Processing...' : (initialData ? 'Update Listing' : 'Publish Listing')) : 'Next'}
          </button>
          <button onClick={onClose} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all">Cancel</button>
        </div>
      </div>

      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowPremiumModal(false)} />
          <div className="relative w-full max-w-[500px] bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowPremiumModal(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            <div className="space-y-8 text-center md:text-left">
              <div><h2 className="text-4xl font-bold text-gray-900 mb-3">Premium Boost</h2><p className="text-gray-500 font-medium">Get featured placement and reach more students instantly.</p></div>
              <div className="text-3xl font-bold text-gray-900">₦500 <span className="text-lg text-gray-400 font-medium">/item</span></div>
              <div className="space-y-5 py-4">{['Top of search results', 'Unlimited images', 'Priority notifications', 'Premium Seller badge'].map((f, i) => <div key={i} className="flex items-start gap-4"><Check size={18} className="text-sellit stroke-[3] mt-1" /><p className="text-gray-700 font-medium">{f}</p></div>)}</div>
              <button onClick={finalSubmit} disabled={isSubmitting} className="w-full bg-sellit text-white py-4.5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-sellit/20 hover:bg-sellit-dark transition-all active:scale-[0.98]">{isSubmitting ? 'Publishing...' : 'Subscribe & Publish'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
