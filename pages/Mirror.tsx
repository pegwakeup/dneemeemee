import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, Wand2, Upload, Eraser, Check } from 'lucide-react';
import { useStore } from '../store';
import { ClothingItem } from '../types';

const Mirror: React.FC = () => {
  const { closetItems } = useStore();
  
  // State
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedCloth, setSelectedCloth] = useState<ClothingItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setBackgroundImage(url);
      setResultImage(null); // Reset result
    }
  };

  // Drawing Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current || !selectedCloth) return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.beginPath(); // Reset path
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get coordinates
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 25;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(212, 163, 115, 0.6)'; // Latte semi-transparent

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Process "Giydir"
  const handleProcess = () => {
    if (!backgroundImage || !selectedCloth) return;
    setIsProcessing(true);
    
    // Simulate Processing Delay
    setTimeout(() => {
        setIsProcessing(false);
        // For demo: we just show the background image again but normally this would be the API result
        // To make it look "processed", we'll just overlay the selected item centrally in the UI
        setResultImage(backgroundImage); 
    }, 2000);
  };

  // Resize canvas to match image
  useEffect(() => {
    if (backgroundImage && imageContainerRef.current && canvasRef.current) {
        // Simple timeout to wait for image render
        setTimeout(() => {
            if(imageContainerRef.current && canvasRef.current) {
                canvasRef.current.width = imageContainerRef.current.clientWidth;
                canvasRef.current.height = imageContainerRef.current.clientHeight;
            }
        }, 100);
    }
  }, [backgroundImage]);

  return (
    <div className="px-6 pt-6 h-full flex flex-col pb-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-extrabold text-deep-brown">Sihirli Ayna</h2>
             {backgroundImage && (
                 <button onClick={() => {setBackgroundImage(null); setResultImage(null);}} className="text-xs text-warm-grey underline">Sıfırla</button>
             )}
        </div>

        {/* Main Work Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-clay overflow-hidden relative border border-gray-100 mb-4 flex items-center justify-center">
            
            {/* Empty State / Upload */}
            {!backgroundImage && (
                <div className="text-center p-8">
                     <div className="w-20 h-20 bg-latte/10 rounded-full flex items-center justify-center mx-auto mb-4 text-latte">
                         <Camera size={32} />
                     </div>
                     <p className="text-warm-grey text-sm mb-6">Önce boydan bir fotoğrafını yükle.</p>
                     <label className="inline-block bg-latte text-white font-bold py-3 px-8 rounded-full shadow-latte-glow cursor-pointer hover:bg-[#C29263] transition-colors">
                         <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                         Fotoğraf Seç
                     </label>
                </div>
            )}

            {/* Editing State */}
            {backgroundImage && !resultImage && (
                <div ref={imageContainerRef} className="relative w-full h-full">
                    <img src={backgroundImage} className="w-full h-full object-cover pointer-events-none" />
                    
                    {/* The Drawing Canvas */}
                    {selectedCloth && (
                        <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onMouseMove={draw}
                            onTouchStart={startDrawing}
                            onTouchEnd={stopDrawing}
                            onTouchMove={draw}
                            className="absolute inset-0 cursor-crosshair touch-none"
                        />
                    )}
                    
                    {!selectedCloth && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                             <p className="bg-white/80 px-4 py-2 rounded-xl text-xs font-bold text-deep-brown">
                                 Aşağıdan bir kıyafet seç 👇
                             </p>
                        </div>
                    )}

                    {/* Instructions Overlay */}
                    {selectedCloth && (
                        <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
                            <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md">
                                Kıyafetin geleceği alanı boya 🖌️
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Result State */}
            {resultImage && (
                <div className="relative w-full h-full">
                    <img src={resultImage} className="w-full h-full object-cover" />
                    {/* Fake "Result" Overlay */}
                    {selectedCloth && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 transition-all animate-[bounce_1s_ease-out]">
                             <img src={selectedCloth.imageUrl} className="w-full drop-shadow-2xl" />
                        </div>
                    )}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="bg-sage text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                            <Sparkles size={16} /> Harika Görünüyorsun!
                        </div>
                    </div>
                </div>
            )}
            
            {/* Loading Overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                    <Wand2 className="text-latte animate-pulse mb-4" size={48} />
                    <p className="font-bold text-deep-brown">Sihir Uygulanıyor...</p>
                </div>
            )}
        </div>

        {/* Controls / Cloth Selector */}
        {backgroundImage && !resultImage && (
            <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-between">
                     <p className="text-xs font-bold text-warm-grey uppercase tracking-widest">Ne Giyilecek?</p>
                     {selectedCloth && (
                         <button 
                            onClick={handleProcess}
                            className="bg-latte text-white px-6 py-2 rounded-xl text-sm font-bold shadow-latte-glow hover:bg-[#C29263] transition-colors"
                         >
                            Giydir ✨
                         </button>
                     )}
                 </div>

                 <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                     {closetItems.filter(i => i.category !== 'Ayakkabı').map((item) => (
                         <button
                            key={item.id}
                            onClick={() => setSelectedCloth(item)}
                            className={`relative min-w-[70px] h-[70px] rounded-2xl bg-white border-2 overflow-hidden transition-all ${
                                selectedCloth?.id === item.id 
                                ? 'border-latte ring-2 ring-latte/30' 
                                : 'border-transparent shadow-sm'
                            }`}
                         >
                             <img src={item.imageUrl} className="w-full h-full object-cover" />
                             {selectedCloth?.id === item.id && (
                                 <div className="absolute inset-0 bg-latte/30 flex items-center justify-center">
                                     <Check className="text-white drop-shadow-md" size={20} />
                                 </div>
                             )}
                         </button>
                     ))}
                 </div>
            </div>
        )}
    </div>
  );
};

export default Mirror;