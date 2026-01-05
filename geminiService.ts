
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function scanReceipt(base64Image: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Extract information from this receipt. Focus on amount, merchant name, category, and date. If data is missing, make a best guess or use today's date."
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          amount: { type: Type.NUMBER },
          merchant: { type: Type.STRING },
          category: { type: Type.STRING },
          date: { type: Type.STRING, description: "ISO format date string YYYY-MM-DD" },
        },
        required: ["amount", "merchant", "category", "date"]
      }
    }
  });

  return JSON.parse(response.text);
}
