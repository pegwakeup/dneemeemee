import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Search, X, Check, Loader, Plus, Sparkles } from 'lucide-react';
import { ClothingItem, FitType } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItems: (items: ClothingItem[]) => void;
}

type TabType = 'scan' | 'search';
type Step = 'input' | 'scanning' | 'review';

const FITS: FitType[] = ['Dar Kesim', 'Normal', 'Bol Kesim', 'Kısa Kesim'];

// Realistic dummy data for the "Magic" scan flow
const MOCK_SCANNED_ITEMS = [
  {
    name: 'Vintage Kot',
    category: 'Alt Giyim',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', 
    color: 'Mavi',
    fit: 'Normal' as FitType
  },
  {
    name: 'Pamuklu Tişört',
    category: 'Üst Giyim',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    color: 'Beyaz',
    fit: 'Bol Kesim' as FitType
  },
  {
    name: 'Deri Kemer',
    category: 'Aksesuar',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    color: 'Kahverengi',
    fit: 'Normal' as FitType
  }
];

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAddItems }) => {
  const [activeTab, setActiveTab] = useState<TabType>('scan');
  const [step, setStep] = useState<Step>('input');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<Partial<ClothingItem>[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setUploadedImage(url);
      setStep('scanning');
      
      // Simulate "Magic" Scan Delay
      setTimeout(() => {
        const newItems = MOCK_SCANNED_ITEMS.map((item, index) => ({
          id: Date.now().toString() + index,
          ...item
        }));
        setDetectedItems(newItems);
        setStep('review');
      }, 1500);
    }
  };

  const handleSearchSelect = (imgUrl: string, name: string) => {
      setDetectedItems([{
          id: Date.now().toString(),
          name: name,
          category: 'Yeni Ürün',
          imageUrl: imgUrl,
          color: 'Bilinmiyor',
          fit: 'Normal' // Default fit for search items to speed up flow
      }]);
      setStep('review');
  };

  const updateItemFit = (index: number, fit: FitType) => {
    const updated = [...detectedItems];
    updated[index].fit = fit;
    setDetectedItems(updated);
  };

  const handleSave = () => {
    if (detectedItems.some(i => !i.fit)) return;
    
    const finalItems = detectedItems.map(item => ({
      ...item,
      tags: ['yeni', 'taranmış'],
    })) as ClothingItem[];

    onAddItems(finalItems);
    handleClose();
  };

  const handleClose = () => {
    setStep('input');
    setUploadedImage(null);
    setDetectedItems([]);
    setSearchQuery('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-deep-brown/20 backdrop-blur-sm pointer-events-auto"
        />

        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-cream rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-6 pointer-events-auto max-h-[90vh] overflow-y-auto relative flex flex-col"
        >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 flex-shrink-0" />

            {/* Header / Tabs */}
            {step === 'input' && (
               <div className="flex bg-white p-1.5 rounded-2xl shadow-clay-inset mb-6 flex-shrink-0">
                 {(['scan', 'search'] as TabType[]).map(tab => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                       activeTab === tab 
                       ? 'bg-latte text-white shadow-clay' 
                       : 'text-gray-400 hover:text-deep-brown'
                     }`}
                   >
                     {tab === 'scan' ? 'Ekran Görüntüsü ile Ekle' : 'İnternetten Ara'}
                   </button>
                 ))}
               </div>
            )}

            {/* View: Scanning Input */}
            {step === 'input' && activeTab === 'scan' && (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-latte/30 rounded-3xl p-10 bg-white/50 hover:bg-white/80 transition-colors">
                <div className="w-20 h-20 bg-latte/10 rounded-full flex items-center justify-center mb-4 text-latte">
                   <Camera size={32} />
                </div>
                <h3 className="font-bold text-deep-brown text-lg mb-2">Fotoğraf Yükle</h3>
                <p className="text-center text-warm-grey text-sm mb-6 max-w-[200px]">
                  Bir fotoğraf çek veya ekran görüntüsü yükle. Otomatik olarak ayıralım!
                </p>
                <label className="w-full">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  <div className="w-full bg-latte text-white font-bold py-4 rounded-2xl text-center shadow-clay cursor-pointer active:scale-95 transition-transform hover:bg-[#C29263]">
                    Fotoğraf Seç
                  </div>
                </label>
              </div>
            )}

            {/* View: Web Search Mock */}
            {step === 'input' && activeTab === 'search' && (
              <div className="flex flex-col h-full min-h-[300px]">
                  <div className="relative mb-6">
                      <input 
                        className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-clay-inset text-sm outline-none focus:ring-2 focus:ring-latte/50 text-deep-brown placeholder-gray-300"
                        placeholder="'Yazlık Elbise' ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pb-4">
                      {[
                          { img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', name: 'Çiçekli Gömlek' },
                          { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', name: 'Yazlık Elbise' },
                          { img: 'https://images.unsplash.com/photo-1584370848010-d7cc31086f5b?w=400', name: 'Bol Pantolon' },
                          { img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', name: 'Topuklu' }
                      ].map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleSearchSelect(item.img, item.name)}
                            className="aspect-[4/5] rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm"
                          >
                              <img src={item.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                      <Plus size={20} className="text-latte" />
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
            )}

            {/* View: Scanning Animation */}
            {step === 'scanning' && uploadedImage && (
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-black shadow-lg mx-4">
                <img src={uploadedImage} alt="Scanning" className="w-full h-full object-cover opacity-60" />
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatType: "reverse" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-latte to-transparent shadow-[0_0_20px_4px_rgba(212,163,115,0.8)] z-10"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-3xl text-white font-bold flex flex-col items-center gap-3">
                      <Sparkles className="animate-pulse text-latte" size={32} />
                      <div className="flex items-center gap-2">
                         <Loader className="animate-spin" size={16} />
                         <span>Analiz Ediliyor...</span>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* View: Review Items */}
            {step === 'review' && (
              <div className="flex-1 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                   <h3 className="font-bold text-deep-brown text-xl">
                       {detectedItems.length === 1 ? 'Ürün Bulundu!' : `${detectedItems.length} Ürün Bulundu!`}
                   </h3>
                   <span className="text-xs text-sage font-bold bg-sage/20 px-3 py-1 rounded-full text-deep-brown">AI Sihri ✨</span>
                </div>
                
                <div className="space-y-4 overflow-y-auto no-scrollbar pr-1 flex-1 min-h-0 mb-4">
                  {detectedItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-3xl shadow-clay border border-white">
                      <div className="flex gap-4 mb-3">
                        <div className="w-16 h-16 rounded-2xl bg-cream overflow-hidden flex-shrink-0">
                           <img src={item.imageUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input 
                            defaultValue={item.name} 
                            className="font-bold text-deep-brown bg-transparent border-b border-dashed border-gray-300 focus:border-latte outline-none w-full pb-1 mb-1 truncate"
                          />
                          <p className="text-xs text-warm-grey">{item.category}</p>
                        </div>
                      </div>
                      
                      {/* Fit Selector */}
                      <div className="bg-cream/50 rounded-xl p-2">
                        <p className="text-[10px] uppercase font-bold text-warm-grey mb-2 tracking-wider flex justify-between">
                            Kalıp Seçimi
                            {!item.fit && <span className="text-latte">*Zorunlu</span>}
                        </p>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                          {FITS.map(fit => (
                            <button
                              key={fit}
                              onClick={() => updateItemFit(idx, fit)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border flex-shrink-0 ${
                                item.fit === fit 
                                ? 'border-sage bg-sage text-white shadow-sm' 
                                : 'border-gray-100 bg-white text-gray-400 hover:border-sage/50'
                              }`}
                            >
                              {fit}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2 flex-shrink-0">
                   <button 
                     onClick={handleClose}
                     className="flex-1 py-4 rounded-2xl font-bold text-warm-grey bg-gray-100 hover:bg-gray-200 transition-colors"
                   >
                     İptal
                   </button>
                   <button 
                     onClick={handleSave}
                     disabled={detectedItems.some(i => !i.fit)}
                     className="flex-[2] py-4 rounded-2xl font-bold text-white bg-latte shadow-latte-glow disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 hover:bg-[#C29263] transition-all active:scale-95"
                   >
                     <Check size={20} />
                     Ekle
                   </button>
                </div>
              </div>
            )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddItemModal;