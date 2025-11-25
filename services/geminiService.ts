import { GoogleGenAI } from "@google/genai";
import { ClothingItem, AffiliateItem } from "../types";
import { MOCK_AFFILIATE_ITEMS } from "../constants";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

interface CommercialRecommendation {
  text: string;
  outfitItems: ClothingItem[];
  missingItem: AffiliateItem;
}

export const getCommercialOutfitRecommendation = async (
  userQuery: string, 
  closetItems: ClothingItem[]
): Promise<CommercialRecommendation> => {
  try {
    const model = 'gemini-2.5-flash'; 
    
    // 1. Simulate AI Selection from Closet (Random 3 for demo)
    let selectedOutfit: ClothingItem[] = [];
    if (closetItems.length >= 3) {
        selectedOutfit = [...closetItems].sort(() => 0.5 - Math.random()).slice(0, 3);
    } else {
        selectedOutfit = closetItems;
    }

    // 2. Select a "Missing Item" from Affiliate list (Random for demo context)
    const missingItem = MOCK_AFFILIATE_ITEMS[Math.floor(Math.random() * MOCK_AFFILIATE_ITEMS.length)];

    const availableNames = selectedOutfit.map(i => i.name).join(', ');

    const prompt = `
      Senin adın Clouzy, çok samimi ve yardımsever bir moda asistanısın. Türkçe konuşuyorsun.
      Kullanıcının dolabından şu parçaları seçtik: ${availableNames}.
      Ayrıca, kombini tamamlamak için şu parça öneriliyor: ${missingItem.name} (${missingItem.description}).
      
      Kullanıcı İsteği: "${userQuery}"
      
      Lütfen bu seçilen kıyafetleri ve önerilen yeni parçayı kullanarak kısa, heyecan verici ve satışa teşvik edici (ama samimi) bir kombin önerisi yaz.
      Önerilen parçanın ("${missingItem.name}") neden bu kombine çok yakışacağını vurgula.
      Emojiler kullan (🌸, ✨, 👗 gibi).
      Cevabın sadece metin olsun.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return {
      text: response.text || "Harika bir kombin hazırladım! 🌸",
      outfitItems: selectedOutfit,
      missingItem: missingItem
    };

  } catch (error) {
    console.error("Error fetching recommendation:", error);
    // Fallback logic
    return {
        text: "Ah, şu an ilham perilerim biraz meşgul! Bir saniye sonra tekrar dener misin? 🌸",
        outfitItems: [],
        missingItem: MOCK_AFFILIATE_ITEMS[0]
    };
  }
};