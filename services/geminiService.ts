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
  closetItems: ClothingItem[],
  isModest: boolean = false
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

    const modestInstruction = isModest 
      ? "ÖNEMLİ: Kullanıcı 'Muhafazakar Giyim (Tesettür)' tercih ediyor. Önerilerini buna göre yap. Daha kapalı, katmanlı ve ölçülü kombinler öner. Eğer seçilen parçalar uygun değilse, nasıl uygun hale getirilebileceğini (örneğin 'içine boğazlı kazak giyerek' veya 'üzerine uzun bir trençkot alarak') anlat." 
      : "";

    const prompt = `
      Senin adın Clouzy, çok samimi ve yardımsever bir moda asistanısın. Türkçe konuşuyorsun.
      ${modestInstruction}
      
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

export const getTravelPackingList = async (
  destination: string,
  days: number,
  closetItems: ClothingItem[],
  isModest: boolean = false
): Promise<string> => {
  try {
    const availableItems = closetItems.map(i => `${i.name} (${i.category})`).join(', ');
    const modestInstruction = isModest ? "Kullanıcı muhafazakar giyiniyor, buna uygun parçalar seç." : "";

    const prompt = `
      Görevin bir bavul hazırlama asistanı olmak.
      Kullanıcı ${days} günlüğüne ${destination} konumuna gidiyor.
      Dolabındaki eşyalar: ${availableItems}.
      ${modestInstruction}
      
      Lütfen bu seyahat için dolabından alması gerekenlerin maddeli bir listesini oluştur.
      Ayrıca yanına alması gereken ama dolabında olmayan 1-2 temel eşyayı da (diş fırçası, şarj aleti gibi) hatırlat.
      Samimi ve heyecanlı bir dil kullan.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "İyi yolculuklar! Bavulunu hazırlarken hava durumunu kontrol etmeyi unutma.";
  } catch (error) {
    console.error(error);
    return "Bağlantı hatası oluştu ama sen en sevdiğin parçaları almayı unutma! ✈️";
  }
};