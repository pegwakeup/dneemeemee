import { create } from 'zustand';
import { ClothingItem, StickerItem, UserProfile } from './types';
import { MOCK_CLOTHING_ITEMS, MOCK_STICKERS, MOCK_USER } from './constants';

interface AppState {
  closetItems: ClothingItem[];
  stickers: StickerItem[];
  userProfile: UserProfile;
  addClosetItems: (items: ClothingItem[]) => void;
  updateProfileStats: (points: number) => void;
}

export const useStore = create<AppState>((set) => ({
  closetItems: MOCK_CLOTHING_ITEMS,
  stickers: MOCK_STICKERS,
  userProfile: MOCK_USER,
  addClosetItems: (newItems) => 
    set((state) => ({ closetItems: [...newItems, ...state.closetItems] })),
  updateProfileStats: (points) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        stylePoints: state.userProfile.stylePoints + points
      }
    }))
}));