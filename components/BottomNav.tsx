import React from 'react';
import { Tab } from '../types';
import { NAV_ITEMS } from '../constants';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-xl pt-2 pb-6 px-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(212,163,115,0.1)] z-[200] max-w-md mx-auto border-t border-white/50">
      <div className="flex justify-between items-center px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className="relative flex flex-col items-center justify-center w-12 h-14"
            >
              <motion.div
                animate={{ 
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? -4 : 0,
                }}
                className={`transition-colors duration-300 ${isActive ? 'text-latte' : 'text-gray-300'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute bottom-2 w-1.5 h-1.5 bg-latte rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;