import React, { useState, useContext } from 'react';
import ClothingCard from '../components/ClothingCard';
import AddItemModal from '../components/AddItemModal';
import { Search, Filter, Plus } from 'lucide-react';
import { useStore } from '../store';
import { ToastContext } from '../App';

const Closet: React.FC = () => {
  const { closetItems, addClosetItems } = useStore();
  const { showToast } = useContext(ToastContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = closetItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItems = (newItems: any) => {
      addClosetItems(newItems);
      showToast(`${newItems.length} yeni parça eklendi!`);
  };

  return (
    <div className="px-6 pt-6 h-full relative">
      <div className="pb-24 overflow-y-auto no-scrollbar h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-deep-brown">Gardırobum</h1>
            <p className="text-sm text-warm-grey font-medium">{closetItems.length} parça</p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-300" />
          </div>
          <input
            type="text"
            placeholder="Kıyafet ara..."
            className="w-full pl-10 pr-10 py-3 bg-white rounded-full shadow-clay-inset text-sm text-deep-brown focus:outline-none focus:ring-2 focus:ring-latte/50 placeholder-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <button className="p-2 bg-cream rounded-full shadow-sm text-warm-grey hover:text-latte transition-colors">
                  <Filter size={14} />
              </button>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
          {['Tümü', 'Üst Giyim', 'Alt Giyim', 'Ayakkabı', 'Elbise'].map((cat, idx) => (
            <button 
              key={cat} 
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  idx === 0 
                  ? 'bg-latte text-white shadow-latte-glow' 
                  : 'bg-white text-warm-grey shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          {filteredItems.map(item => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
            <div className="text-center mt-10 text-gray-400">
                <p>Ürün bulunamadı 🌸</p>
            </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-24 right-6 z-40">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-16 h-16 bg-latte rounded-3xl shadow-clay flex items-center justify-center text-white active:scale-90 transition-transform hover:bg-[#C29263]"
        >
          <Plus size={32} strokeWidth={2.5} />
        </button>
      </div>

      {/* Add Item Modal */}
      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddItems={handleAddItems} 
      />
    </div>
  );
};

export default Closet;