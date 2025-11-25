import { create } from 'zustand';
import { ClothingItem, StickerItem, UserProfile, CanvasItem } from './types';
import { MOCK_STICKERS, MOCK_USER, SCENES } from './constants';
import { supabase } from './lib/supabase';

interface AppState {
  userId: string | null;
  closetItems: ClothingItem[];
  stickers: StickerItem[];
  userProfile: UserProfile & { isPremium: boolean };
  preferences: {
    modestMode: boolean;
  };
  isLoading: boolean;
  
  // Canvas State
  canvasItems: CanvasItem[];
  activeScene: string;

  // Actions
  initializeData: () => Promise<void>;
  addClosetItems: (items: ClothingItem[]) => Promise<void>;
  updateProfileStats: (points: number) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  toggleModestMode: () => Promise<void>;
  
  // Canvas Actions
  addCanvasItem: (item: CanvasItem) => void;
  updateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void;
  removeCanvasItem: (id: string) => void;
  setCanvasScene: (sceneId: string) => void;
  clearCanvas: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  userId: null,
  closetItems: [], 
  stickers: MOCK_STICKERS,
  userProfile: { ...MOCK_USER, isPremium: false },
  preferences: {
    modestMode: false,
  },
  isLoading: false,
  
  canvasItems: [],
  activeScene: SCENES[0].id,

  // --- Supabase Actions ---

  initializeData: async () => {
    set({ isLoading: true });
    try {
      // 0. Get Auth User (if available)
      const { data: { user } } = await supabase.auth.getUser();
      let currentUserId = user?.id || null;

      // 1. Fetch Closet Items
      const { data: itemsData, error: itemsError } = await supabase
        .from('closet_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      const formattedItems: ClothingItem[] = (itemsData || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        imageUrl: item.image_url,
        color: item.color,
        tags: item.tags || [],
        fit: item.fit
      }));

      // 2. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

      let profile = { ...MOCK_USER, isPremium: false };
      let prefs = { modestMode: false };

      if (profileData) {
        // If we didn't get a user from Auth but found a profile, use that ID (for demo purposes)
        if (!currentUserId) currentUserId = profileData.id;
        
        profile = {
          name: profileData.name || 'Zeynep',
          stylePoints: profileData.style_points || 0,
          outfitsCreated: profileData.outfits_created || 0,
          isPremium: profileData.is_premium || false,
        };
        prefs = {
          modestMode: profileData.modest_mode || false,
        };
      }

      set({ 
        userId: currentUserId,
        closetItems: formattedItems, 
        userProfile: profile, 
        preferences: prefs,
        isLoading: false 
      });

    } catch (error: any) {
      console.error('Failed to initialize data:', error.message || error);
      set({ isLoading: false });
    }
  },

  addClosetItems: async (newItems) => {
    // 1. Optimistic Update (using temporary IDs)
    set((state) => ({ closetItems: [...newItems, ...state.closetItems] }));

    try {
      const state = get();
      
      // 2. Map to snake_case for DB
      const dbItems = newItems.map(item => ({
        name: item.name,
        category: item.category,
        image_url: item.imageUrl,
        color: item.color,
        tags: item.tags,
        fit: item.fit,
        user_id: state.userId // Include user_id if available to satisfy RLS
      }));

      const { data, error } = await supabase
        .from('closet_items')
        .insert(dbItems)
        .select(); // Return the inserted data so we get the REAL IDs

      if (error) throw error;

      // 3. Update state with real IDs from DB to ensure consistency
      if (data) {
        const realItems: ClothingItem[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            imageUrl: item.image_url,
            color: item.color,
            tags: item.tags || [],
            fit: item.fit
        }));

        set((state) => {
            // Remove the optimistic items (by filtering out the temporary IDs)
            // and prepend the real items
            const tempIds = new Set(newItems.map(i => i.id));
            const existingItems = state.closetItems.filter(i => !tempIds.has(i.id));
            return { closetItems: [...realItems, ...existingItems] };
        });
      }

    } catch (error: any) {
      console.error('Error saving items to Supabase:', error.message || error);
      // Optional: Revert optimistic update here if needed
    }
  },
  
  updateProfileStats: async (points) => {
    set((state) => {
      const newPoints = state.userProfile.stylePoints + points;
      const newProfile = { ...state.userProfile, stylePoints: newPoints };
      
      // Sync to DB
      if (state.userProfile.name) {
          supabase.from('profiles')
            .update({ style_points: newPoints })
            .eq('name', state.userProfile.name)
            .then(({ error }) => {
                if (error) console.error("Error updating stats:", error.message);
            });
      }
      
      return { userProfile: newProfile };
    });
  },

  upgradeToPremium: async () => {
    set((state) => {
      const newProfile = { ...state.userProfile, isPremium: true };
      
      // Sync to DB
      if (state.userProfile.name) {
          supabase.from('profiles')
            .update({ is_premium: true })
            .eq('name', state.userProfile.name)
            .then(({ error }) => {
                if (error) console.error("Error upgrading premium:", error.message);
            });
      }
      
      return { userProfile: newProfile };
    });
  },

  toggleModestMode: async () => {
    set((state) => {
      const newMode = !state.preferences.modestMode;
      
      // Sync to DB
      if (state.userProfile.name) {
          supabase.from('profiles')
            .update({ modest_mode: newMode })
            .eq('name', state.userProfile.name)
            .then(({ error }) => {
                if (error) console.error("Error updating modest mode:", error.message);
            });
      }
      
      return { preferences: { ...state.preferences, modestMode: newMode } };
    });
  },

  // --- Local Canvas Actions (No DB sync required for this demo feature yet) ---

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