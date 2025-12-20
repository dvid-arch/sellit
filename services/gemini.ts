
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private async executeWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      const isRetryable = error?.status === 429 || error?.status === 503 || error?.status === 500;
      if (retries > 0 && isRetryable) {
        console.warn(`Gemini API error. Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async generateDescription(itemName: string, condition: string): Promise<string> {
    return this.executeWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a catchy, student-friendly 2-sentence description for a "${condition}" condition "${itemName}" to be sold on a college campus marketplace. Mention why it's a good deal for a student.`,
        config: { temperature: 0.7 },
      });
      // Correctly accessing .text property
      return response.text || "No description generated.";
    });
  }

  async suggestPrice(itemName: string, condition: string): Promise<number> {
    return this.executeWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest a fair second-hand price (in USD) for a "${condition}" condition "${itemName}" on a college campus. Return only the number.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              price: { type: Type.NUMBER }
            },
            required: ['price']
          }
        },
      });
      // Correctly accessing .text property
      const data = JSON.parse(response.text || '{"price": 0}');
      return data.price;
    });
  }

  async getSmartAdvice(query: string, history: { role: string; content: string }[]): Promise<{ text: string; sources?: any[] }> {
    return this.executeWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        // Mapping roles to 'user' and 'model' and using the correct Content[] structure
        contents: [
          ...history.map(h => ({ 
            role: h.role === 'user' ? 'user' : 'model', 
            parts: [{ text: h.content }] 
          })),
          { role: 'user', parts: [{ text: query }] }
        ],
        config: { 
          // Instruction moved to systemInstruction for better control
          systemInstruction: "You are the Sellit Assistant, a helpful AI for a college campus marketplace. Help students find items, price their items, or give general campus shopping advice. Be concise and friendly.",
          tools: [{ googleSearch: {} }] 
        },
      });

      // Correctly extracting grounding metadata for citations
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return {
        // Correctly accessing .text property
        text: response.text || "I'm not sure how to help with that. Try asking about item prices or campus deals!",
        sources: sources
      };
    });
  }

  async interpretSearch(query: string): Promise<{ category?: string; minPrice?: number; maxPrice?: number; intent: string }> {
    return this.executeWithRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the user's search query for a campus marketplace: "${query}". Identify the primary category (Electronics, Books, Fashion, Kitchen, Home and furniture), and optional price range.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              minPrice: { type: Type.NUMBER },
              maxPrice: { type: Type.NUMBER },
              intent: { type: Type.STRING, description: "One sentence summary of what the user wants" }
            },
            required: ['intent']
          }
        },
      });
      // Correctly accessing .text property
      return JSON.parse(response.text || '{}');
    });
  }
}

export const geminiService = new GeminiService();
