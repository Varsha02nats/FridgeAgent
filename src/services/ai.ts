import { GoogleGenAI } from "@google/genai";
import { VISION_PARSER_PROMPT, CHAT_SYSTEM_INSTRUCTION, ALERT_GENERATOR_PROMPT, SMART_RECIPE_PROMPT } from "./prompts";

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
  },

  generateRecipesFromPantry: async (inventory: string) => {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: SMART_RECIPE_PROMPT(inventory) }] }],
        config: {
          responseMimeType: "application/json"
        }
      });
      const data = JSON.parse(response.text || "{}");
      return data.recipes || [];
    } catch (e) {
      console.error("Failed to generate recipes", e);
      return [];
    }
  },

  generateAlertMessage: async (item: string, daysLeft: number, category: string) => {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: ALERT_GENERATOR_PROMPT(item, daysLeft, category) }] }],
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to generate alert message", e);
      return { message: "Time to check on this item!", suggestions: [] };
    }
  }
};
