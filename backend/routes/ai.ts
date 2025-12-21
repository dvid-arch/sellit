
import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { protect } from '../middleware/auth';

const router = express.Router();

// Gemini optimization route following strict SDK rules
router.post('/optimize-listing', protect, async (req: any, res: any) => {
  const { title, condition, category } = req.body;
  
  try {
    // Fix: Initializing GoogleGenAI using strictly process.env.API_KEY as per the guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for text optimization task
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a catchy, student-friendly description and suggest a fair second-hand price in Naira (NGN) for a "${condition}" ${title} in the ${category} category to be sold on a college campus.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { 
              type: Type.STRING,
              description: 'A 2-sentence catchy description'
            },
            suggestedPrice: { 
              type: Type.NUMBER,
              description: 'Numerical value for the suggested price in Naira'
            },
            intent: {
              type: Type.STRING,
              description: 'A brief summary of the item analysis'
            }
          },
          required: ['description', 'suggestedPrice', 'intent'],
          propertyOrdering: ["description", "suggestedPrice", "intent"]
        },
        temperature: 0.7
      }
    });

    // Accessing result via .text property as per guidelines
    const jsonStr = response.text || "{}";
    res.json(JSON.parse(jsonStr));
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI Optimization failed', message: error.message });
  }
});

// @route POST /api/ai/advice
router.post('/advice', protect, async (req: any, res: any) => {
  const { query, history } = req.body;
  
  try {
    // Fix: Initializing GoogleGenAI using strictly process.env.API_KEY as per the guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...(history || []).map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: "You are the Sellit Assistant, a helpful AI for a college campus marketplace. Help students find items, price their items, or give general campus shopping advice. Be concise, friendly, and campus-savvy.",
        tools: [{ googleSearch: {} }]
      }
    });

    // Extracting grounding metadata for citations
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    res.json({
      text: response.text || "I'm having trouble thinking of a response. Ask me something about campus gear!",
      sources: sources
    });
  } catch (error: any) {
    res.status(500).json({ error: 'AI Advice failed' });
  }
});

export default router;
