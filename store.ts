import { create } from 'zustand';
import { ClothingItem, StickerItem, UserProfile, CanvasItem } from './types';
import { MOCK_CLOTHING_ITEMS, MOCK_STICKERS, MOCK_USER, SCENES } from './constants';

interface AppState {
  closetItems: ClothingItem[];
  stickers: StickerItem[];
  userProfile: UserProfile;
  
  // Canvas State
  canvasItems: CanvasItem[];
  activeScene: string;

  // Actions
  addClosetItems: (items: ClothingItem[]) => void;
  updateProfileStats: (points: number) => void;
  
  // Canvas Actions
  addCanvasItem: (item: CanvasItem) => void;
  updateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void;
  removeCanvasItem: (id: string) => void;
  setCanvasScene: (sceneId: string) => void;
  clearCanvas: () => void;
}

export const useStore = create<AppState>((set) => ({
  closetItems: MOCK_CLOTHING_ITEMS,
  stickers: MOCK_STICKERS,
  userProfile: MOCK_USER,
  
  canvasItems: [],
  activeScene: SCENES[0].id,

  addClosetItems: (newItems) => 
    set((state) => ({ closetItems: [...newItems, ...state.closetItems] })),
  
  updateProfileStats: (points) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        stylePoints: state.userProfile.stylePoints + points
      }
    })),

  addCanvasItem: (item) => 
    set((state) => ({ canvasItems: [...state.canvasItems, item] })),

  updateCanvasItem: (id, updates) => 
    set((state) => ({
      canvasItems: state.canvasItems.map(i => i.canvasId === id ? { ...i, ...updates } : i)
    })),

  removeCanvasItem: (id) => 
    set((state) => ({
      canvasItems: state.canvasItems.filter(i => i.canvasId !== id)
    })),

  setCanvasScene: (sceneId) => set({ activeScene: sceneId }),
  
  clearCanvas: () => set({ canvasItems: [] }),
}));