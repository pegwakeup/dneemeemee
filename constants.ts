import { ClothingItem, UserProfile, StickerItem, AffiliateItem } from './types';
import { Shirt, Scissors, Sparkles, Camera, User } from 'lucide-react';

export const MOCK_USER: UserProfile = {
  name: "Zeynep",
  stylePoints: 1250,
  outfitsCreated: 42,
};

export const MOCK_CLOTHING_ITEMS: ClothingItem[] = [
  {
    id: '1',
    name: 'Örgü Kazak',
    category: 'Üst Giyim',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
    color: 'Krem',
    tags: ['kış', 'rahat', 'günlük'],
    fit: 'Bol Kesim',
  },
  {
    id: '2',
    name: 'Pileli Etek',
    category: 'Alt Giyim',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80',
    color: 'Pembe',
    tags: ['şık', 'yaz'],
    fit: 'Normal',
  },
  {
    id: '3',
    name: 'Kot Ceket',
    category: 'Dış Giyim',
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80',
    color: 'Mavi',
    tags: ['vintage', 'katman'],
    fit: 'Bol Kesim',
  },
  {
    id: '4',
    name: 'Çiçekli Elbise',
    category: 'Elbise',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
    color: 'Karışık',
    tags: ['ilkbahar', 'çiçekli'],
    fit: 'Normal',
  },
  {
    id: '5',
    name: 'Beyaz Spor Ayakkabı',
    category: 'Ayakkabı',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
    color: 'Beyaz',
    tags: ['spor', 'temel'],
    fit: 'Normal',
  },
  {
    id: '6',
    name: 'İpek Şal',
    category: 'Aksesuar',
    imageUrl: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=500&q=80',
    color: 'Kırmızı',
    tags: ['şık', 'aksesuar'],
    fit: 'Dar Kesim',
  },
];

export const MOCK_STICKERS: StickerItem[] = [
  { id: 's1', name: 'Yıldız', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' },
  { id: 's2', name: 'Kalp', imageUrl: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' },
  { id: 's3', name: 'Çiçek', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2926/2926701.png' },
  { id: 's4', name: 'Kahve', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2935/2935307.png' },
  { id: 's5', name: 'Pırıltı', imageUrl: 'https://cdn-icons-png.flaticon.com/512/4127/4127281.png' },
];

export const MOCK_AFFILIATE_ITEMS: AffiliateItem[] = [
  {
    id: 'a1',
    name: 'Bej Trençkot',
    price: '2499 TL',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80',
    affiliateLink: '#',
    description: 'Sonbahar şıklığı için vazgeçilmez.'
  },
  {
    id: 'a2',
    name: 'Deri Çanta',
    price: '1250 TL',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80',
    affiliateLink: '#',
    description: 'Kombinini tamamlayacak zarif dokunuş.'
  },
  {
    id: 'a3',
    name: 'Gold Kolye',
    price: '450 TL',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500&q=80',
    affiliateLink: '#',
    description: 'Minimalist ve şık.'
  }
];

export const NAV_ITEMS = [
  { id: 'closet', label: 'Dolabım', icon: Shirt },
  { id: 'canvas', label: 'Tuval', icon: Scissors },
  { id: 'stylist', label: 'Stilist', icon: Sparkles },
  { id: 'mirror', label: 'Ayna', icon: Camera },
  { id: 'profile', label: 'Profil', icon: User },
];