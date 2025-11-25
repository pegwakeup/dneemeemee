import React from 'react';
import { motion } from 'framer-motion';
import { ClothingItem, FitType } from '../types';
import { Heart } from 'lucide-react';

interface ClothingCardProps {
  item: ClothingItem;
}

const getFitColor = (fit: FitType) => {
  switch (fit) {
    case 'Dar Kesim': return 'bg-latte text-white';
    case 'Bol Kesim': return 'bg-sage text-white';
    case 'Kısa Kesim': return 'bg-orange-200 text-white';
    case 'Normal': default: return 'bg-cream text-warm-grey border border-gray-100';
  }
};

const ClothingCard: React.FC<ClothingCardProps> = ({ item }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl p-3 shadow-clay flex flex-col items-center relative border border-white/60"
    >
      <div className="absolute top-3 right-3 z-10">
        <button className="bg-cream/80 p-1.5 rounded-full shadow-sm text-latte hover:text-red-400 transition-colors">
            <Heart size={14} fill="currentColor" />
        </button>
      </div>

      <div className="w-full aspect-square bg-cream rounded-2xl mb-3 overflow-hidden p-4 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative border border-gray-50">
        <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover rounded-2xl shadow-sm"
            loading="lazy"
        />
        <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm backdrop-blur-sm bg-opacity-90 ${getFitColor(item.fit)}`}>
          {item.fit}
        </div>
      </div>

      <div className="text-center w-full px-1">
        <h3 className="text-sm font-bold text-deep-brown truncate w-full">{item.name}</h3>
        <p className="text-xs text-warm-grey mt-0.5">{item.category}</p>
      </div>
    </motion.div>
  );
};

export default ClothingCard;