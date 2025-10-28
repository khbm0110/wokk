// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";

// Fix: Per coding guidelines, the API key MUST be obtained exclusively from process.env.API_KEY.
const apiKey = process.env.API_KEY;

// Fix: Per coding guidelines, initialize with a named parameter {apiKey: ...}
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a project description using the Gemini API.
 * @param userInput - A string containing key points about the project.
 * @returns A promise that resolves to the generated description string.
 */
export const generateProjectDescription = async (userInput: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  
  try {
    const prompt = `You are an expert copywriter for crowdfunding campaigns. Write a compelling and persuasive project description for a new project on the 'InvestMaroc' platform. The description should be engaging for potential investors and be between 50 and 150 words. Here are the key details provided by the project owner: "${userInput}".`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    // Fix: Per coding guidelines, access the text directly from the response object.
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
};

/**
 * Translates text to the specified target language using the Gemini API.
 * @param text - The text to translate.
 * @param targetLanguage - The target language ('ar' for Arabic, 'fr' for French).
 * @returns A promise that resolves to the translated text.
 */
export const translateText = async (text: string, targetLanguage: 'ar' | 'fr'): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  
  try {
    const targetLanguageName = targetLanguage === 'ar' ? 'Arabic' : 'French';
    const prompt = `Translate the following text to ${targetLanguageName}. Only return the translated text, without any introductory phrases, quotation marks, or explanations:\n\n"${text}"`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    // Clean up potential extra quotes from the model's response
    // Fix: Per coding guidelines, access the text directly from the response object.
    return response.text.trim().replace(/^"|"$/g, '');
  } catch (error) {
    console.error("Error translating text with Gemini API:", error);
    throw new Error("Failed to translate text. Please try again.");
  }
};