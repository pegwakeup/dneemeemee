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

// Helper to find a mock image for the AI-suggested missing item
const getDynamicAffiliateImage = (itemName: string): string => {
  const lower = itemName.toLowerCase();
  if (lower.includes('çanta')) return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80';
  if (lower.includes('kolye') || lower.includes('küpe') || lower.includes('takı')) return 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500&q=80';
  if (lower.includes('ayakkabı') || lower.includes('bot') || lower.includes('sneaker')) return 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80';
  if (lower.includes('ceket') || lower.includes('kaban') || lower.includes('trençkot')) return 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80';
  if (lower.includes('gözlük')) return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80';
  if (lower.includes('şal') || lower.includes('eşarp')) return 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=500&q=80';
  // Default fallback
  return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80';
};

export const analyzeClothingImage = async (base64Image: string): Promise<Partial<ClothingItem>[]> => {
  try {
    const model = 'gemini-2.5-flash';

    const prompt = `
      Sen uzman bir moda asistanısın. Bu resimdeki kıyafetleri analiz et.
      
      GÖREV:
      Resimdeki her bir belirgin kıyafet parçasını (örn: Gömlek, Pantolon, Ayakkabı) ayrı ayrı tanımla.
      
      ÇIKTI FORMATI (JSON Array):
      [
        {
          "name": "Kısa Ürün Adı (Örn: Mavi Kot Ceket)",
          "category": "Kategori",
          "color": "Renk (Türkçe)",
          "tags": ["etiket1", "etiket2", "stil"]
        }
      ]

      KATEGORİ KURALLARI (Sadece bunlardan birini kullan):
      - 'Üst Giyim' (Tişört, Gömlek, Kazak, Bluz, Hırka vb.)
      - 'Alt Giyim' (Pantolon, Etek, Şort, Jean vb.)
      - 'Dış Giyim' (Mont, Ceket, Kaban, Trençkot vb.)
      - 'Elbise' (Tüm elbiseler, tulumlar)
      - 'Ayakkabı' (Spor ayakkabı, Bot, Topuklu vb.)
      - 'Aksesuar' (Çanta, Şapka, Atkı, Kemer vb.)

      ÖNEMLİ: Sadece geçerli JSON array döndür. Markdown formatı kullanma.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    if (!response.text) return [];

    const items = JSON.parse(response.text);
    return items;

  } catch (error) {
    console.error("Vision API Error:", error);
    return [];
  }
};

export const getCommercialOutfitRecommendation = async (
  userQuery: string, 
  closetItems: ClothingItem[],
  isModest: boolean = false
): Promise<CommercialRecommendation> => {
  try {
    const model = 'gemini-2.5-flash'; 
    
    // 1. Serialize Closet for AI (Send only necessary data to save tokens)
    const closetInventory = closetItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      color: item.color,
      fit: item.fit,
      tags: item.tags
    }));

    // 2. Construct Constraints
    const modestInstruction = isModest 
      ? `KÜLTÜREL FİLTRE (ÖNEMLİ): Kullanıcı 'Muhafazakar Giyim (Tesettür)' tercih ediyor.
         - Asla kısa etek, crop top, şort veya dekolteli parçaları TEK BAŞINA önerme.
         - Eğer böyle bir parça seçersen, mutlaka üzerine uzun bir ceket, hırka veya içine uygun bir parça ekleyerek 'katmanlı (layering)' bir görünüm oluştur.
         - Vücut hatlarını çok belli etmeyen, ölçülü ve şık kombinler yap.` 
      : "Kullanıcı modern ve günlük bir stil tercih ediyor.";

    const systemPrompt = `
      Sen Clouzy, Türk moda kültürüne hakim, samimi ve satış odaklı bir stilistsin.
      
      GÖREV:
      Kullanıcının mevcut dolabından en uygun 3 parçayı seç ve bir kombin oluştur.
      Ayrıca bu kombini mükemmelleştirecek ama kullanıcının dolabında OLMAYAN 1 adet "Eksik Parça" öner.
      
      KULLANICI DOLABI (JSON):
      ${JSON.stringify(closetInventory)}

      KULLANICI İSTEĞİ: "${userQuery}"

      ${modestInstruction}

      ÇIKTI FORMATI (JSON):
      Aşağıdaki JSON şemasını kesinlikle takip et:
      {
        "selectedItemIds": ["id1", "id2", "id3"], // Dolaptan seçtiğin 2 veya 3 parçanın ID'leri
        "advice": "Kombin hakkında samimi, emoji içeren, Türkçe açıklama...",
        "suggestedMissingItem": {
          "name": "Örn: Bej Trençkot",
          "description": "Neden bu kombine uyduğu hakkında kısa açıklama.",
          "estimatedPrice": "2499 TL"
        }
      }
    `;

    // 3. Call Gemini with JSON Schema enforcement
    const response = await ai.models.generateContent({
      model: model,
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (!response.text) throw new Error("No response from AI");

    // 4. Parse & Hydrate Data
    const data = JSON.parse(response.text);
    
    // Map IDs back to real objects
    const selectedOutfit = data.selectedItemIds
      .map((id: string) => closetItems.find(item => item.id === id))
      .filter((item: ClothingItem | undefined): item is ClothingItem => item !== undefined);

    // Create the Affiliate Item object dynamically based on AI suggestion
    const missingItem: AffiliateItem = {
      id: `ai-rec-${Date.now()}`,
      name: data.suggestedMissingItem.name,
      description: data.suggestedMissingItem.description,
      price: data.suggestedMissingItem.estimatedPrice,
      imageUrl: getDynamicAffiliateImage(data.suggestedMissingItem.name),
      affiliateLink: '#' // In a real app, this would be a search link or specific product ID
    };

    return {
      text: data.advice,
      outfitItems: selectedOutfit,
      missingItem: missingItem
    };

  } catch (error) {
    console.error("Error fetching recommendation:", error);
    // Fallback logic in case of API failure
    return {
        text: "Şu an ilham perilerim biraz yoğun! Ama dolabındaki parçalarla harika görüneceğine eminim. 🌸",
        outfitItems: closetItems.slice(0, 3),
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
    const availableItems = closetItems.map(i => `${i.name} (${i.category}, ${i.color})`).join(', ');
    const modestInstruction = isModest ? "Kullanıcı muhafazakar (tesettür) giyiniyor. Listeyi buna göre, vücut hatlarını örten ve katmanlı parçalar seçerek oluştur." : "";

    const prompt = `
      Görevin profesyonel bir seyahat asistanı olmak. Türkçe konuş.
      Kullanıcı ${days} günlüğüne ${destination} konumuna gidiyor.
      
      KULLANICI DOLABI:
      ${availableItems}
      
      ${modestInstruction}
      
      GÖREV:
      1. Dolaptan bu seyahat için en uygun parçaları seçerek maddeli bir liste yap.
      2. Kombin önerileri ver (Örn: "Mavi kazağını beyaz eteğinle giyebilirsin").
      3. Yanına alması gereken kişisel bakım/teknoloji eşyalarını hatırlat.
      
      Tonun samimi, heyecanlı ve organize olsun. Emojiler kullan.
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