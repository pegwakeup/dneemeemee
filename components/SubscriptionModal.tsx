import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Plane, Crown, Loader, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { ToastContext } from '../App';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { upgradeToPremium } = useStore();
  const { showToast } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = () => {
    setIsLoading(true);
    
    // Mock Payment Delay (1.5 seconds)
    setTimeout(() => {
      upgradeToPremium();
      setIsLoading(false);
      onClose();
      showToast("Clouzy+ 'a Hoş Geldin! 🎉");
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-deep-brown/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-sm bg-cream rounded-[2.5rem] shadow-2xl p-8 overflow-hidden border border-white"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-latte/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-sage/10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none"></div>

          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 p-2 bg-white rounded-full text-warm-grey hover:bg-gray-50 transition-colors z-10 shadow-sm"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-8 pt-2">
            <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-tr from-latte to-[#EBC6A4] rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-latte/30 rotate-3">
                    <Crown className="text-white drop-shadow-md" size={36} strokeWidth={2.5} />
                </div>
                <div className="absolute -top-2 -right-2">
                    <Sparkles className="text-yellow-400 fill-current" size={24} />
                </div>
            </div>
            
            <h2 className="text-2xl font-extrabold text-deep-brown mb-1">Clouzy<span className="text-latte">+</span> 'a Yükselt</h2>
            <p className="text-warm-grey text-sm font-medium">Sınırları kaldır, stilini özgür bırak.</p>
          </div>

          <div className="space-y-4 mb-8">
             {[
               { icon: Plane, text: "Akıllı Bavul Hazırlayıcı", color: "text-blue-500", bg: "bg-blue-50" },
               { icon: Crown, text: "Gelişmiş Stil Analizleri", color: "text-latte", bg: "bg-orange-50" },
               { icon: Star, text: "Sınırsız Kıyafet Yükleme", color: "text-yellow-500", bg: "bg-yellow-50" },
             ].map((item, idx) => (
               <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-50/50">
                 <div className={`p-2.5 rounded-full ${item.bg} ${item.color}`}>
                   <item.icon size={18} />
                 </div>
                 <span className="font-bold text-deep-brown text-sm">{item.text}</span>
                 <div className="ml-auto text-sage">
                    <Check size={18} strokeWidth={3} />
                 </div>
               </div>
             ))}
          </div>

          <div className="bg-white rounded-2xl p-4 mb-6 shadow-clay-inset text-center border border-gray-100">
             <span className="text-3xl font-extrabold text-latte">49.99 TL</span>
             <span className="text-warm-grey text-xs font-bold block mt-1">/ Aylık</span>
          </div>

          <button 
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full py-4 bg-sage text-white rounded-2xl font-bold shadow-lg shadow-sage/30 flex items-center justify-center gap-2 hover:bg-[#B5C092] active:scale-95 transition-all disabled:opacity-70 disabled:scale-100"
          >
            {isLoading ? (
                <Loader className="animate-spin" size={20} />
            ) : (
                <>
                    <Star fill="currentColor" size={20} />
                    Hemen Başla
                </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-warm-grey mt-4 font-medium opacity-60">
             Otomatik yenilenir. İstediğin zaman iptal et.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;