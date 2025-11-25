import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Plane, Crown } from 'lucide-react';
import { useStore } from '../store';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { upgradeToPremium } = useStore();

  const handleUpgrade = () => {
    upgradeToPremium();
    onClose();
    // In a real app, this would trigger a payment flow
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
          className="relative w-full max-w-sm bg-cream rounded-[2rem] shadow-2xl p-6 overflow-hidden border border-white"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-latte/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage/10 rounded-full blur-xl -ml-6 -mb-6 pointer-events-none"></div>

          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full text-warm-grey hover:bg-gray-50 transition-colors z-10">
            <X size={18} />
          </button>

          <div className="text-center mb-6 pt-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-latte to-[#EBC6A4] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-latte/30 rotate-3">
              <Crown className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-deep-brown">Clouzy<span className="text-latte">+</span></h2>
            <p className="text-warm-grey text-sm font-medium">Sınırsız moda deneyimi</p>
          </div>

          <div className="space-y-3 mb-8">
             {[
               { icon: Plane, text: "Akıllı Bavul Hazırlayıcı", color: "text-blue-500" },
               { icon: Star, text: "Sınırsız Kıyafet Yükleme", color: "text-yellow-500" },
               { icon: Crown, text: "Gelişmiş Stil Analizleri", color: "text-latte" },
             ].map((item, idx) => (
               <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-50">
                 <div className={`p-2 bg-gray-50 rounded-full ${item.color}`}>
                   <item.icon size={16} />
                 </div>
                 <span className="font-bold text-deep-brown text-sm">{item.text}</span>
               </div>
             ))}
          </div>

          <div className="text-center mb-6">
             <span className="text-3xl font-extrabold text-deep-brown">49.99 TL</span>
             <span className="text-warm-grey text-xs"> / Aylık</span>
          </div>

          <button 
            onClick={handleUpgrade}
            className="w-full py-4 bg-latte text-white rounded-2xl font-bold shadow-latte-glow flex items-center justify-center gap-2 hover:bg-[#C29263] active:scale-95 transition-all"
          >
            <Star fill="currentColor" size={18} />
            Hemen Başla
          </button>
          
          <p className="text-center text-[10px] text-warm-grey mt-4">
             İstediğin zaman iptal edebilirsin.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;