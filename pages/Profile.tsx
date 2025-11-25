import React, { useState } from 'react';
import { useStore } from '../store';
import { Settings, Award, TrendingUp, Shield, Crown, Sparkles } from 'lucide-react';
import SubscriptionModal from '../components/SubscriptionModal';

const Profile: React.FC = () => {
  const { userProfile, preferences, toggleModestMode } = useStore();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  return (
    <div className="px-6 pt-6 pb-24 h-full overflow-y-auto no-scrollbar">
       <div className="flex justify-end mb-4">
            <button className="p-2 bg-white rounded-full shadow-clay text-warm-grey hover:text-latte transition-colors">
                <Settings size={20} />
            </button>
       </div>
       
       <div className="flex flex-col items-center mb-8">
           <div className="w-28 h-28 bg-white rounded-full shadow-clay p-1.5 mb-4 relative">
               <img 
                src="https://picsum.photos/200/200?random=100" 
                alt="Profil" 
                className="w-full h-full rounded-full object-cover border-2 border-white"
               />
               {userProfile.isPremium ? (
                 <div className="absolute bottom-1 right-1 bg-gradient-to-r from-latte to-[#EBC6A4] text-white p-2 rounded-full border-2 border-white shadow-md">
                    <Crown size={16} fill="currentColor" />
                 </div>
               ) : (
                 <div className="absolute bottom-1 right-1 bg-gray-300 text-white p-2 rounded-full border-2 border-white shadow-sm">
                    <Award size={16} />
                 </div>
               )}
           </div>
           
           <h1 className="text-2xl font-extrabold text-deep-brown mb-2">{userProfile.name}</h1>
           
           {/* Plan Badge / Upgrade Button */}
           {userProfile.isPremium ? (
               <div className="flex items-center gap-2 bg-gradient-to-r from-latte to-[#EBC6A4] text-white px-4 py-1.5 rounded-full shadow-latte-glow">
                   <Crown size={14} fill="currentColor" />
                   <span className="text-xs font-bold tracking-wide">Clouzy+ Üyesi</span>
               </div>
           ) : (
               <div className="flex flex-col items-center gap-3">
                   <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Ücretsiz Plan</span>
                   <button 
                    onClick={() => setIsSubModalOpen(true)}
                    className="bg-latte text-white text-xs font-bold px-6 py-2 rounded-xl shadow-clay hover:bg-[#C29263] transition-colors flex items-center gap-2"
                   >
                       <Sparkles size={12} fill="currentColor" />
                       Clouzy+ 'a Yükselt
                   </button>
               </div>
           )}
       </div>

       {/* Settings Card */}
       <div className="bg-white rounded-3xl p-4 shadow-clay mb-6 border border-gray-50">
          <h3 className="text-sm font-bold text-deep-brown mb-4 px-2">Tercihler</h3>
          
          <div className="flex items-center justify-between p-3 bg-cream rounded-2xl mb-2">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-sage/20 text-sage rounded-full">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-deep-brown">Muhafazakar Giyim</p>
                  <p className="text-[10px] text-warm-grey">Daha kapalı öneriler</p>
                </div>
             </div>
             <button 
               onClick={toggleModestMode}
               className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${preferences.modestMode ? 'bg-sage' : 'bg-gray-200'}`}
             >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${preferences.modestMode ? 'translate-x-5' : 'translate-x-0'}`} />
             </button>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-white rounded-3xl p-5 shadow-clay flex flex-col items-center justify-between h-32 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Award size={64} />
               </div>
               <Award className="text-yellow-500 mb-2 self-start" size={24} />
               <div className="self-start">
                   <span className="text-3xl font-extrabold text-deep-brown block">{userProfile.stylePoints}</span>
                   <span className="text-[10px] text-warm-grey uppercase tracking-widest font-bold">Stil Puanı</span>
               </div>
           </div>
           <div className="bg-white rounded-3xl p-5 shadow-clay flex flex-col items-center justify-between h-32 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                   <TrendingUp size={64} />
               </div>
               <TrendingUp className="text-latte mb-2 self-start" size={24} />
               <div className="self-start">
                   <span className="text-3xl font-extrabold text-deep-brown block">{userProfile.outfitsCreated}</span>
                   <span className="text-[10px] text-warm-grey uppercase tracking-widest font-bold">Kombinler</span>
               </div>
           </div>
       </div>
       
       <div className="bg-white rounded-[2rem] shadow-clay p-6 relative overflow-hidden mb-8">
           <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-deep-brown text-lg">Haftalık Aktivite</h3>
                <span className="text-xs font-bold text-warm-grey bg-gray-50 px-2 py-1 rounded-lg">Son 7 Gün</span>
           </div>
           
           <div className="h-40 flex items-end justify-between gap-3 px-1">
              {[35, 60, 45, 80, 55, 90, 40].map((height, index) => (
                <div key={index} className="flex flex-col items-center gap-2 w-full group">
                    <div className="w-full relative h-32 flex items-end">
                        <div 
                            style={{ height: `${height}%` }} 
                            className={`w-full rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-80 ${
                                index === 5 // Highlight the highest bar (mock current day)
                                ? 'bg-gradient-to-t from-latte to-[#EBC6A4] shadow-md' 
                                : 'bg-gradient-to-t from-gray-100 to-gray-200'
                            }`}
                        >
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold ${index === 5 ? 'text-latte' : 'text-gray-300'}`}>
                        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][index]}
                    </span>
                </div>
              ))}
           </div>
       </div>

       {/* Banner for non-premium */}
       {!userProfile.isPremium && (
          <div 
            onClick={() => setIsSubModalOpen(true)}
            className="bg-gradient-to-r from-deep-brown to-gray-800 rounded-3xl p-6 relative overflow-hidden shadow-xl cursor-pointer"
          >
             <div className="relative z-10">
               <h3 className="text-white font-bold text-lg mb-1">Clouzy+'a Yükselt</h3>
               <p className="text-gray-300 text-xs mb-3">Tüm özelliklerin kilidini aç.</p>
               <span className="bg-white text-deep-brown px-4 py-2 rounded-xl text-xs font-bold">İncele</span>
             </div>
             <Crown className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32 rotate-12" />
          </div>
       )}

       {/* Subscription Modal */}
       <SubscriptionModal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} />
    </div>
  );
};

export default Profile;