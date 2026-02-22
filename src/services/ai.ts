import { GoogleGenAI } from "@google/genai";
import { VISION_PARSER_PROMPT, CHAT_SYSTEM_INSTRUCTION } from "./prompts";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
  return new GoogleGenAI({ apiKey });
};

export const aiService = {
  parseFridgeImage: async (base64Image: string, mimeType: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: VISION_PARSER_PROMPT },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return [];
    }
  },

  chat: async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
    const ai = getAI();
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION
      },
      history: history
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  }
};
