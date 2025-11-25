import React, { useState } from 'react';
import { Tab } from './types';
import BottomNav from './components/BottomNav';
import Closet from './pages/Closet';
import Canvas from './pages/Canvas';
import Stylist from './pages/Stylist';
import Mirror from './pages/Mirror';
import Profile from './pages/Profile';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

// Global Toast Context can be used here or simple state for demo
export const ToastContext = React.createContext({ showToast: (msg: string) => {} });

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CLOSET);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CLOSET:
        return <Closet />;
      case Tab.CANVAS:
        return <Canvas />;
      case Tab.STYLIST:
        return <Stylist />;
      case Tab.MIRROR:
        return <Mirror />;
      case Tab.PROFILE:
        return <Profile />;
      default:
        return <Closet />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        {/* Mobile Container Simulation */}
        <div className="w-full max-w-md h-[100dvh] bg-gradient-to-b from-cream to-[#F0EBE0] shadow-2xl relative overflow-hidden flex flex-col">
          
          {/* Main Content Area */}
          <main className="flex-1 relative overflow-hidden">
              {renderContent()}
          </main>

          {/* Bottom Navigation */}
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Global Toast Notification */}
          <AnimatePresence>
            {toast.show && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 20, x: '-50%' }}
                className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-deep-brown text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 whitespace-nowrap"
              >
                <CheckCircle2 size={18} className="text-sage" />
                <span className="text-sm font-bold">{toast.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default App;