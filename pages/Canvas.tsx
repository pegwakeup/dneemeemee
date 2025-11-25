import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasItem, ClothingItem, StickerItem } from '../types';
import { Download, Trash2, Plus, Smile, Shirt, Image as ImageIcon, User, ArrowUp, ArrowDown, ArrowLeftRight, X } from 'lucide-react';
import { useStore } from '../store';

type SceneType = 'clean' | 'notebook' | 'dreamy' | 'room';

const SCENES: { id: SceneType; name: string; style: string }[] = [
  { id: 'clean', name: 'Sade', style: 'bg-cream' },
  { id: 'notebook', name: 'Defter', style: 'bg-[#FDFBF7] bg-[radial-gradient(#D4A373_1px,transparent_1px)] [background-size:20px_20px]' },
  { id: 'dreamy', name: 'Rüya', style: 'bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100' },
  { id: 'room', name: 'Oda', style: 'bg-[#F0EBE0]' }, // Simplified for CSS, could be an image
];

const Canvas: React.FC = () => {
  const { closetItems, stickers } = useStore();
  const [placedItems, setPlacedItems] = useState<CanvasItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'clothes' | 'stickers'>('clothes');
  
  // Game States
  const [currentScene, setCurrentScene] = useState<SceneType>('clean');
  const [showSceneMenu, setShowSceneMenu] = useState(false);
  const [isDressUpMode, setIsDressUpMode] = useState(false);

  const handleAddItem = (item: ClothingItem | StickerItem, type: 'cloth' | 'sticker') => {
    const newItem: CanvasItem = {
      ...item,
      // @ts-ignore
      category: type === 'cloth' ? (item as ClothingItem).category : 'Sticker',
      color: type === 'cloth' ? (item as ClothingItem).color : '',
      tags: [],
      fit: 'Normal',
      canvasId: Date.now().toString(),
      type: type,
      x: 0, 
      y: 0,
      rotation: 0,
      scale: type === 'sticker' ? 0.6 : 1,
      zIndex: placedItems.length + 10, // Start above mannequin
      flip: false,
    };
    
    setPlacedItems([...placedItems, newItem]);
    setSelectedId(newItem.canvasId);
  };

  const handleRemoveItem = (id: string) => {
    setPlacedItems(placedItems.filter(i => i.canvasId !== id));
    setSelectedId(null);
  };

  const handleClear = () => {
    setPlacedItems([]);
    setSelectedId(null);
  };

  // Toolbar Actions
  const updateItem = (id: string, updates: Partial<CanvasItem>) => {
    setPlacedItems(items => items.map(item => 
      item.canvasId === id ? { ...item, ...updates } : item
    ));
  };

  const bringToFront = (id: string) => {
    const maxZ = Math.max(...placedItems.map(i => i.zIndex), 10);
    updateItem(id, { zIndex: maxZ + 1 });
  };

  const sendBackward = (id: string) => {
    const minZ = Math.min(...placedItems.map(i => i.zIndex), 10);
    // Don't go below 2 (1 is mannequin)
    updateItem(id, { zIndex: Math.max(2, minZ - 1) });
  };

  const toggleFlip = (id: string) => {
    const item = placedItems.find(i => i.canvasId === id);
    if (item) {
      updateItem(id, { flip: !item.flip });
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-cream">
        {/* Top Controls */}
        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between z-30 pointer-events-none">
            {/* Clear Button */}
            <button 
                onClick={handleClear} 
                className={`p-3 bg-white/80 backdrop-blur-md rounded-full shadow-clay text-gray-400 hover:text-red-400 pointer-events-auto transition-all ${placedItems.length === 0 ? 'opacity-0' : 'opacity-100'}`}
            >
                <Trash2 size={20} />
            </button>
            
            <div className="flex gap-3 pointer-events-auto">
                {/* Scene Selector */}
                <div className="relative">
                    <button 
                        onClick={() => setShowSceneMenu(!showSceneMenu)}
                        className={`p-3 rounded-full shadow-clay transition-colors ${showSceneMenu ? 'bg-latte text-white' : 'bg-white/80 text-latte'}`}
                    >
                        <ImageIcon size={20} />
                    </button>
                    
                    <AnimatePresence>
                        {showSceneMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                className="absolute top-full right-0 mt-2 bg-white rounded-2xl p-2 shadow-xl flex flex-col gap-2 min-w-[120px]"
                            >
                                {SCENES.map(scene => (
                                    <button
                                        key={scene.id}
                                        onClick={() => { setCurrentScene(scene.id); setShowSceneMenu(false); }}
                                        className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-colors ${currentScene === scene.id ? 'bg-sage/20 text-deep-brown' : 'hover:bg-gray-50 text-warm-grey'}`}
                                    >
                                        {scene.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mode Toggle */}
                <button 
                    onClick={() => setIsDressUpMode(!isDressUpMode)}
                    className={`p-3 rounded-full shadow-clay transition-colors ${isDressUpMode ? 'bg-sage text-white' : 'bg-white/80 text-gray-400'}`}
                >
                    <User size={20} />
                </button>

                <button className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-clay text-latte hover:text-[#C29263]">
                    <Download size={20} />
                </button>
            </div>
        </div>

        {/* Main Canvas Area */}
        <div 
            ref={containerRef} 
            onClick={() => setSelectedId(null)}
            className={`flex-1 relative overflow-hidden transition-all duration-500 ${SCENES.find(s => s.id === currentScene)?.style}`}
        >
            {/* Mannequin / Base Model */}
            <AnimatePresence>
                {isDressUpMode && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]"
                    >
                        {/* Simple Silhouette SVG */}
                        <svg viewBox="0 0 100 200" className="h-[80%] w-auto fill-current text-warm-grey">
                            <path d="M50 10 C 60 10, 65 20, 65 30 C 65 40, 60 45, 50 45 C 40 45, 35 40, 35 30 C 35 20, 40 10, 50 10 M 35 45 C 20 50, 15 70, 10 90 L 20 100 C 25 80, 30 60, 35 60 L 35 120 C 35 140, 30 180, 25 200 L 75 200 C 70 180, 65 140, 65 120 L 65 60 C 70 60, 75 80, 80 100 L 90 90 C 85 70, 80 50, 65 45 Z" />
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            {placedItems.length === 0 && !isDressUpMode && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                     <div className="text-center">
                         <div className="w-48 h-48 border-4 border-dashed border-latte/30 rounded-3xl mx-auto mb-4 bg-latte/5 flex items-center justify-center">
                             <Scissors size={48} className="text-latte/50" />
                         </div>
                         <p className="text-warm-grey font-bold">Moda Dünyanı Yarat</p>
                     </div>
                </div>
            )}

            {placedItems.map((item) => (
                <motion.div
                    key={item.canvasId}
                    drag
                    dragMomentum={false}
                    dragConstraints={containerRef}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ 
                        scale: item.scale, 
                        opacity: 1, 
                        scaleX: item.flip ? -1 : 1,
                    }}
                    whileDrag={{ 
                        scale: item.scale * 1.1, 
                        zIndex: 999, 
                        cursor: 'grabbing',
                        filter: 'drop-shadow(0px 15px 15px rgba(0,0,0,0.15))'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(item.canvasId);
                    }}
                    className={`absolute top-1/4 left-1/4 w-40 h-40 flex items-center justify-center cursor-grab touch-none`}
                    style={{ zIndex: item.zIndex }}
                >
                    <div className={`relative w-full h-full pointer-events-none transition-all duration-200 ${selectedId === item.canvasId ? 'filter drop-shadow-md' : ''}`}>
                        {/* Sticker White Border Effect */}
                        <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-contain drop-shadow-sm"
                            style={{ 
                                pointerEvents: 'none',
                                filter: 'drop-shadow(0px 0px 0px white) drop-shadow(0px 0px 2px rgba(0,0,0,0.1))' // Subtle outline prep
                            }}
                        />
                        {/* Physical Sticker Outline SVG Filter Simulation via CSS Border logic is tricky on transparent imgs. 
                            Instead, we assume pngs. A reliable way is a surrounding div with filter, or just drop-shadow(0 0 2px white).
                        */}
                        <div className="absolute inset-0 w-full h-full" style={{ 
                             background: `url(${item.imageUrl}) no-repeat center/contain`,
                             filter: 'drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(0 2px 0 white) drop-shadow(0 -2px 0 white)',
                             zIndex: -1
                        }} />
                    </div>

                    {/* FLOATING GAME CONTROLS */}
                    <AnimatePresence>
                        {selectedId === item.canvasId && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.8 }}
                                className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-1 bg-white p-1.5 rounded-2xl shadow-xl z-[1000] pointer-events-auto"
                                style={{ transformOrigin: 'bottom center', scaleX: item.flip ? -1 : 1 }} // Counter flip for controls
                            >
                                <button onClick={(e) => { e.stopPropagation(); bringToFront(item.canvasId); }} className="p-2 hover:bg-cream rounded-xl text-deep-brown" title="Öne Getir">
                                    <ArrowUp size={16} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); sendBackward(item.canvasId); }} className="p-2 hover:bg-cream rounded-xl text-deep-brown" title="Arkaya Gönder">
                                    <ArrowDown size={16} />
                                </button>
                                <div className="w-px bg-gray-100 mx-0.5"></div>
                                <button onClick={(e) => { e.stopPropagation(); toggleFlip(item.canvasId); }} className="p-2 hover:bg-cream rounded-xl text-deep-brown" title="Çevir">
                                    <ArrowLeftRight size={16} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.canvasId); }} className="p-2 hover:bg-red-50 text-red-400 rounded-xl" title="Sil">
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>

        {/* Bottom Sheet Controls */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-white/50 shadow-[0_-5px_20px_rgba(212,163,115,0.05)] z-40 pb-24 pt-2 flex flex-col rounded-t-3xl">
            {/* Tabs */}
            <div className="flex justify-center mb-4 px-6 gap-4">
                <button 
                    onClick={() => setActiveTab('clothes')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        activeTab === 'clothes' 
                        ? 'bg-latte text-white shadow-latte-glow' 
                        : 'bg-cream text-warm-grey'
                    }`}
                >
                    <Shirt size={14} /> Kıyafetler
                </button>
                <button 
                    onClick={() => setActiveTab('stickers')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        activeTab === 'stickers' 
                        ? 'bg-latte text-white shadow-latte-glow' 
                        : 'bg-cream text-warm-grey'
                    }`}
                >
                    <Smile size={14} /> Süslemeler
                </button>
            </div>
            
            {/* Scrollable List */}
            <div className="flex-1 overflow-x-auto no-scrollbar px-6 flex items-center gap-3 h-[90px]">
                {/* CLOTHES TAB */}
                {activeTab === 'clothes' && closetItems.map(item => (
                    <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddItem(item, 'cloth')}
                        className="relative min-w-[80px] h-[80px] bg-white rounded-2xl p-2 shadow-clay-sm border border-gray-50 flex items-center justify-center group"
                    >
                        <img 
                            src={item.imageUrl} 
                            className="w-full h-full object-contain rounded-lg" 
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                             <Plus className="text-white drop-shadow-md" />
                        </div>
                    </motion.button>
                ))}

                {/* STICKERS TAB */}
                {activeTab === 'stickers' && stickers.map(item => (
                    <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddItem(item, 'sticker')}
                        className="relative min-w-[80px] h-[80px] bg-white rounded-2xl p-3 shadow-clay-sm border border-gray-50 flex items-center justify-center group"
                    >
                        <img 
                            src={item.imageUrl} 
                            className="w-full h-full object-contain drop-shadow-sm" 
                        />
                    </motion.button>
                ))}
                <div className="min-w-[20px]"></div>
            </div>
        </div>
    </div>
  );
};

// Helpers
const Scissors = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>
);

export default Canvas;