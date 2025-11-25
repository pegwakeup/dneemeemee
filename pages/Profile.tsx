import React from 'react';
import { MOCK_USER } from '../constants';
import { Settings, Award, TrendingUp } from 'lucide-react';

const Profile: React.FC = () => {
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
               <div className="absolute bottom-1 right-1 bg-latte text-white p-1.5 rounded-full border-2 border-white">
                  <Award size={14} fill="currentColor" />
               </div>
           </div>
           <h1 className="text-2xl font-bold text-deep-brown">{MOCK_USER.name}</h1>
           <p className="text-sage font-bold text-sm bg-sage/20 px-3 py-1 rounded-full mt-2 text-deep-brown">Moda Tutkunu</p>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-white rounded-3xl p-5 shadow-clay flex flex-col items-center justify-between h-32 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Award size={64} />
               </div>
               <Award className="text-yellow-500 mb-2 self-start" size={24} />
               <div className="self-start">
                   <span className="text-3xl font-extrabold text-deep-brown block">{MOCK_USER.stylePoints}</span>
                   <span className="text-[10px] text-warm-grey uppercase tracking-widest font-bold">Stil Puanı</span>
               </div>
           </div>
           <div className="bg-white rounded-3xl p-5 shadow-clay flex flex-col items-center justify-between h-32 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                   <TrendingUp size={64} />
               </div>
               <TrendingUp className="text-latte mb-2 self-start" size={24} />
               <div className="self-start">
                   <span className="text-3xl font-extrabold text-deep-brown block">{MOCK_USER.outfitsCreated}</span>
                   <span className="text-[10px] text-warm-grey uppercase tracking-widest font-bold">Kombinler</span>
               </div>
           </div>
       </div>
       
       <div className="bg-white rounded-[2rem] shadow-clay p-6 relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-deep-brown text-lg">Haftalık Aktivite</h3>
                <span className="text-xs font-bold text-warm-grey bg-gray-50 px-2 py-1 rounded-lg">Son 7 Gün</span>
           </div>
           
           {/* CSS Bar Chart */}
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
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-deep-brown text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {height}
                            </div>
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold ${index === 5 ? 'text-latte' : 'text-gray-300'}`}>
                        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][index]}
                    </span>
                </div>
              ))}
           </div>
       </div>
    </div>
  );
};

export default Profile;