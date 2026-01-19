
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCongratsMessage(winnerName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, professional yet energetic and fun congratulatory message for a person named "${winnerName}" who just won a company lucky draw. Keep it under 20 words. Use Traditional Chinese (Taiwan).`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text?.trim() || `恭喜 ${winnerName} 幸運中獎！`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `恭喜 ${winnerName} 幸運中獎！`;
  }
}
