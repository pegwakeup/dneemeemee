import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ShoppingBag, ExternalLink, Plane, X, Check } from 'lucide-react';
import { getCommercialOutfitRecommendation, getTravelPackingList } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useStore } from '../store';
import SubscriptionModal from '../components/SubscriptionModal';
import { motion, AnimatePresence } from 'framer-motion';

const Stylist: React.FC = () => {
  const { closetItems, preferences, userProfile } = useStore();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAskStylist = async () => {
    if (!prompt.trim()) return;
    
    // Add User Message
    const userMsg: ChatMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);
    
    // Call Commercial Service with Modest Mode
    const result = await getCommercialOutfitRecommendation(
        userMsg.content, 
        closetItems, 
        preferences.modestMode
    );
    
    const aiMsg: ChatMessage = { 
        role: 'assistant', 
        content: result.text,
        outfitItems: result.outfitItems,
        missingItem: result.missingItem
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  // --- Travel Logic ---
  const handleTravelClick = () => {
      if (userProfile.isPremium) {
          setIsTravelModalOpen(true);
      } else {
          setIsSubModalOpen(true);
      }
  };

  const handleGeneratePackingList = async () => {
      setIsTravelModalOpen(false);
      setLoading(true);
      
      const userMsg: ChatMessage = { 
          role: 'user', 
          content: `${days} günlüğüne ${destination} için bavul hazırlamak istiyorum.` 
      };
      setMessages(prev => [...prev, userMsg]);

      const resultText = await getTravelPackingList(
          destination, 
          days, 
          closetItems, 
          preferences.modestMode
      );

      const aiMsg: ChatMessage = {
          role: 'assistant',
          content: resultText
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
      setDestination('');
  };

  return (
    <div className="px-6 pt-6 pb-24 h-full flex flex-col">
       {/* Header with Travel Button */}
       <div className="mb-4 flex items-center justify-between relative">
          <div className="w-10"></div> {/* Spacer */}
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-deep-brown flex items-center justify-center gap-2">
                Clouzy Stilist 
                {preferences.modestMode && <span className="text-[10px] bg-sage/20 text-sage px-2 py-0.5 rounded-full">Modest</span>}
            </h1>
          </div>
          <button 
            onClick={handleTravelClick}
            className="p-2 bg-white rounded-xl shadow-clay text-latte hover:bg-latte hover:text-white transition-colors"
            title="Bavul Modu"
          >
              <Plane size={20} />
          </button>
       </div>

       <div className="flex-1 rounded-3xl mb-4 overflow-y-auto relative space-y-6 p-2 no-scrollbar">
         {messages.length === 0 && !loading && (
             <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm p-8 text-center flex-col gap-4 opacity-50">
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-2 shadow-inner">
                    <Sparkles className="text-latte" size={32} />
                </div>
                <p>Moda, kombin ve bavul önerileri için buradayım!</p>
                <div className="bg-white p-3 rounded-2xl shadow-sm text-xs text-warm-grey">"Hafta sonu kahvaltıya gidiyorum."</div>
                <div className="bg-white p-3 rounded-2xl shadow-sm text-xs text-warm-grey">"Sağ üstteki uçağa tıkla!" ↗️</div>
             </div>
         )}
         
         {messages.map((msg, idx) => (
             <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                 
                 {/* Assistant Logic */}
                 {msg.role === 'assistant' && (
                   <div className="w-full max-w-[95%]">
                     
                     {/* 1. Closet Items */}
                     {msg.outfitItems && msg.outfitItems.length > 0 && (
                       <div className="bg-white p-3 rounded-3xl rounded-bl-none shadow-clay mb-3 border border-gray-100">
                           <div className="flex items-center gap-2 mb-2">
                               <Sparkles size={12} className="text-latte" />
                               <span className="text-[10px] font-bold text-latte uppercase tracking-widest">Dolabından Seçtiklerim</span>
                           </div>
                           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                               {msg.outfitItems.map((item) => (
                                   <div key={item.id} className="w-20 h-20 bg-cream rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 relative">
                                       <img src={item.imageUrl} className="w-full h-full object-cover" />
                                   </div>
                               ))}
                           </div>
                       </div>
                     )}

                     {/* 2. Commercial Missing Item Card */}
                     {msg.missingItem && (
                       <div className="bg-[#F9F7F2] p-4 rounded-3xl border-2 border-sage shadow-clay mb-3 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 bg-sage text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                            Eksik Parça
                          </div>
                          <div className="flex gap-4 items-center mb-3">
                             <div className="w-20 h-24 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                               <img src={msg.missingItem.imageUrl} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                               <h4 className="font-bold text-deep-brown text-sm">{msg.missingItem.name}</h4>
                               <p className="text-xs text-warm-grey mb-1">{msg.missingItem.description}</p>
                               <span className="text-latte font-extrabold text-sm">{msg.missingItem.price}</span>
                             </div>
                          </div>
                          <button 
                            onClick={() => window.open(msg.missingItem!.affiliateLink, '_blank')}
                            className="w-full bg-sage text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[#B5C092] transition-colors active:scale-95"
                          >
                            <ShoppingBag size={14} />
                            Kombini Tamamla (Satın Al)
                          </button>
                       </div>
                     )}

                     {/* 3. Text Response */}
                     <div className="bg-white text-deep-brown p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm leading-relaxed whitespace-pre-wrap">
                       {msg.content}
                     </div>
                   </div>
                 )}

                 {/* User Bubble */}
                 {msg.role === 'user' && (
                   <div className="bg-latte text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] text-sm">
                     {msg.content}
                   </div>
                 )}
             </div>
         ))}

         {loading && (
             <div className="flex items-start">
                 <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                     <div className="w-2 h-2 bg-latte rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-latte rounded-full animate-bounce delay-75"></div>
                     <div className="w-2 h-2 bg-latte rounded-full animate-bounce delay-150"></div>
                 </div>
             </div>
         )}
         <div ref={messagesEndRef} />
       </div>

       <div className="relative">
         <input
           type="text"
           value={prompt}
           onChange={(e) => setPrompt(e.target.value)}
           onKeyDown={(e) => e.key === 'Enter' && handleAskStylist()}
           placeholder="Bugün ne giymeliyim?"
           className="w-full pl-5 pr-14 py-4 bg-white rounded-2xl shadow-clay text-sm text-deep-brown focus:outline-none focus:ring-2 focus:ring-latte/30 placeholder-gray-300"
         />
         <button 
            onClick={handleAskStylist}
            disabled={loading || !prompt}
            className="absolute right-2 top-2 bottom-2 w-10 bg-latte rounded-xl flex items-center justify-center text-white shadow-md disabled:opacity-50 hover:bg-[#C29263] transition-colors"
         >
             <Send size={18} />
         </button>
       </div>

       {/* MODALS */}
       <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
       
       {/* Travel Planner Input Modal */}
       <AnimatePresence>
         {isTravelModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-deep-brown/40 backdrop-blur-sm"
                 onClick={() => setIsTravelModalOpen(false)}
              />
              <motion.div 
                 initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                 className="relative w-full max-w-sm bg-cream rounded-3xl p-6 shadow-2xl z-10"
              >
                  <h3 className="text-xl font-extrabold text-deep-brown mb-4 flex items-center gap-2">
                     <Plane className="text-latte" /> Bavul Modu
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                     <div>
                        <label className="text-xs font-bold text-warm-grey ml-2">Nereye Gidiyorsun?</label>
                        <input 
                           value={destination}
                           onChange={(e) => setDestination(e.target.value)}
                           className="w-full p-4 bg-white rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-latte/30 text-deep-brown"
                           placeholder="Örn: Bodrum, Paris..."
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-warm-grey ml-2">Kaç Günlük?</label>
                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm">
                           <input 
                              type="range" min="1" max="14" 
                              value={days} onChange={(e) => setDays(Number(e.target.value))}
                              className="flex-1 accent-latte h-2 bg-gray-100 rounded-full appearance-none cursor-pointer"
                           />
                           <span className="font-extrabold text-latte w-12 text-center">{days} Gün</span>
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={handleGeneratePackingList}
                     disabled={!destination}
                     className="w-full py-4 bg-latte text-white rounded-2xl font-bold shadow-latte-glow hover:bg-[#C29263] active:scale-95 transition-all disabled:opacity-50"
                  >
                     Listeyi Hazırla ✨
                  </button>
              </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
};

export default Stylist;