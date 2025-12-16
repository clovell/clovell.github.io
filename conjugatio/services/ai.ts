import { GoogleGenAI } from "@google/genai";
import { Verb } from "../types";

// Helper to check if API key exists. We don't throw, just return null if missing.
// This allows the app to function in "offline" mode gracefully.
const getClient = (): GoogleGenAI | null => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing. AI features disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getVerbInsight = async (verb: Verb): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "AI insights are unavailable (API Key missing).";
  }

  try {
    const prompt = `Provide a very brief (max 2 sentences) interesting etymological fact or a mnemonic device to help a student remember the conjugation or meaning of the Latin verb: ${verb.principalParts.join(', ')} (${verb.definition}).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful Latin tutor. Keep it concise, encouraging, and educational.",
        temperature: 0.7,
      }
    });

    return response.text || "No insight available at this moment.";
  } catch (error) {
    console.error("Error fetching verb insight:", error);
    return "Could not retrieve AI insight. Please try again later.";
  }
};