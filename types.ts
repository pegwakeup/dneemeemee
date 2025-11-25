export enum Tab {
  CLOSET = 'closet',
  CANVAS = 'canvas',
  STYLIST = 'stylist',
  MIRROR = 'mirror',
  PROFILE = 'profile',
}

export type FitType = 'Dar Kesim' | 'Normal' | 'Bol Kesim' | 'Kısa Kesim';

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  color: string;
  tags: string[];
  fit: FitType;
}

export interface StickerItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface AffiliateItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  affiliateLink: string;
  description: string;
}

export interface CanvasItem {
  id: string; // The source item id
  canvasId: string; // Unique id on canvas
  name: string;
  imageUrl: string;
  type: 'cloth' | 'sticker';
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  flip?: boolean;
}

export interface UserProfile {
  name: string;
  stylePoints: number;
  outfitsCreated: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  outfitItems?: ClothingItem[]; // Items from user closet
  missingItem?: AffiliateItem; // The item to sell
}