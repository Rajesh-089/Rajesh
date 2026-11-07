import { GoogleGenAI } from '@google/genai';
import { config } from './env.js';

let geminiClient = null;

export function getGemini() {
  if (!geminiClient) {
    if (!config.gemini.apiKey) {
      return null;
    }
    geminiClient = new GoogleGenAI({
      apiKey: config.gemini.apiKey
    });
  }
  return geminiClient;
}

export const DEFAULT_GEMINI_MODEL = config.gemini.model || 'gemini-2.5-flash';
