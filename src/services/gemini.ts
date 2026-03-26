import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getIslamicReminder() {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a single, short, inspiring Islamic reminder or Hadith (max 15 words). No reflection, just the text and reference. Return as plain text.",
    });
    return response.text || "Verily, with every hardship comes ease. (Quran 94:5)";
  } catch (error) {
    console.error("Error generating reminder:", error);
    return "Verily, with every hardship comes ease. (Quran 94:5)";
  }
}

export async function getWorshipSuggestions(mood: string) {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest one specific Islamic act of worship, Dua, or Surah (max 10 words) for a user feeling '${mood}'. Return as plain text.`,
    });
    return response.text || "Recite Surah Ad-Duha and make sincere Dua.";
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return "Recite Surah Ad-Duha and make sincere Dua.";
  }
}

export async function getChatResponse(userMessage: string, history: { role: 'user' | 'bot', text: string }[]) {
  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: "You are an Islamic assistant for the app 'Al-Mumin'. Answer queries based on Islamic knowledge (Quran and Sunnah) in a helpful, respectful, and concise manner. Use Markdown for formatting.",
      }
    });

    return response.text || "I apologize, I am unable to process that request right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
}
