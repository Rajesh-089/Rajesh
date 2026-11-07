import { getGemini, DEFAULT_GEMINI_MODEL } from '../config/gemini.js';
import {
  AGRI_SYSTEM_PROMPT,
  buildCropRecommendationPrompt,
  buildFertilizerPrompt,
  buildIrrigationPrompt,
  buildPestDiseasePrompt,
  buildChatPrompt
} from '../prompts/agriPrompts.js';
import {
  aiCropRecommendationOutputSchema,
  aiFertilizerOutputSchema,
  aiIrrigationOutputSchema,
  aiPestDiseaseOutputSchema,
  aiChatOutputSchema
} from '../schemas/validationSchemas.js';

/**
 * Execute Gemini model generation with structured JSON schema
 */
async function callGeminiStructured({ prompt, responseSchema, systemInstruction = AGRI_SYSTEM_PROMPT }) {
  const ai = getGemini();
  if (!ai) {
    const error = new Error('Google Gemini API is not configured on the server. Please set GEMINI_API_KEY in server/.env.');
    error.statusCode = 503;
    error.code = 'GEMINI_NOT_CONFIGURED';
    throw error;
  }

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema
      }
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Gemini returned an empty text response.');
    }

    return JSON.parse(rawText);
  } catch (err) {
    console.error('Gemini API call failed:', err);
    if (err.status === 429 || err.message?.includes('RESOURCE_EXHAUSTED')) {
      const error = new Error('Gemini API rate limit or quota exceeded. Please wait a moment before trying again.');
      error.statusCode = 429;
      error.code = 'GEMINI_QUOTA_EXCEEDED';
      throw error;
    }
    const error = new Error(`AI generation error: ${err.message}`);
    error.statusCode = 502;
    error.code = 'GEMINI_SERVICE_ERROR';
    throw error;
  }
}

// ==========================================
// 1. CROP RECOMMENDATIONS
// ==========================================
const cropGenAISchema = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    recommendations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          cropName: { type: 'STRING' },
          suitabilityScore: { type: 'INTEGER' },
          confidence: { type: 'STRING' },
          reasons: { type: 'ARRAY', items: { type: 'STRING' } },
          soilCompatibility: { type: 'STRING' },
          waterRequirement: { type: 'STRING' },
          growingSeason: { type: 'STRING' },
          importantConsiderations: { type: 'ARRAY', items: { type: 'STRING' } }
        },
        required: [
          'cropName', 'suitabilityScore', 'confidence', 'reasons',
          'soilCompatibility', 'waterRequirement', 'growingSeason', 'importantConsiderations'
        ]
      }
    },
    soilObservations: { type: 'ARRAY', items: { type: 'STRING' } },
    missingInformation: { type: 'ARRAY', items: { type: 'STRING' } },
    nextSteps: { type: 'ARRAY', items: { type: 'STRING' } },
    disclaimer: { type: 'STRING' }
  },
  required: ['summary', 'recommendations', 'soilObservations', 'missingInformation', 'nextSteps', 'disclaimer']
};

export async function generateCropRecommendations(inputData) {
  const prompt = buildCropRecommendationPrompt(inputData);
  const rawOutput = await callGeminiStructured({
    prompt,
    responseSchema: cropGenAISchema
  });

  // Strict Zod validation
  return aiCropRecommendationOutputSchema.parse(rawOutput);
}

// ==========================================
// 2. FERTILIZER ADVISORY
// ==========================================
const fertilizerGenAISchema = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    nutrientObservations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          nutrient: { type: 'STRING' },
          status: { type: 'STRING' },
          explanation: { type: 'STRING' }
        },
        required: ['nutrient', 'status', 'explanation']
      }
    },
    recommendations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          category: { type: 'STRING' },
          suggestion: { type: 'STRING' },
          timing: { type: 'STRING' },
          reason: { type: 'STRING' },
          precautions: { type: 'ARRAY', items: { type: 'STRING' } }
        },
        required: ['category', 'suggestion', 'timing', 'reason', 'precautions']
      }
    },
    missingInformation: { type: 'ARRAY', items: { type: 'STRING' } },
    expertConsultationRecommended: { type: 'BOOLEAN' },
    disclaimer: { type: 'STRING' }
  },
  required: ['summary', 'nutrientObservations', 'recommendations', 'missingInformation', 'expertConsultationRecommended', 'disclaimer']
};

export async function generateFertilizerAdvisory(inputData) {
  const prompt = buildFertilizerPrompt(inputData);
  const rawOutput = await callGeminiStructured({
    prompt,
    responseSchema: fertilizerGenAISchema
  });

  return aiFertilizerOutputSchema.parse(rawOutput);
}

// ==========================================
// 3. IRRIGATION ADVISORY
// ==========================================
const irrigationGenAISchema = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    waterAvailability: { type: 'STRING' },
    recommendations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          stage: { type: 'STRING' },
          guidance: { type: 'STRING' },
          reason: { type: 'STRING' },
          waterConservationTips: { type: 'ARRAY', items: { type: 'STRING' } }
        },
        required: ['stage', 'guidance', 'reason', 'waterConservationTips']
      }
    },
    weatherConsiderations: { type: 'ARRAY', items: { type: 'STRING' } },
    warnings: { type: 'ARRAY', items: { type: 'STRING' } },
    missingInformation: { type: 'ARRAY', items: { type: 'STRING' } },
    disclaimer: { type: 'STRING' }
  },
  required: ['summary', 'waterAvailability', 'recommendations', 'weatherConsiderations', 'warnings', 'missingInformation', 'disclaimer']
};

export async function generateIrrigationAdvisory(inputData) {
  const prompt = buildIrrigationPrompt(inputData);
  const rawOutput = await callGeminiStructured({
    prompt,
    responseSchema: irrigationGenAISchema
  });

  return aiIrrigationOutputSchema.parse(rawOutput);
}

// ==========================================
// 4. PEST AND DISEASE ADVISORY
// ==========================================
const pestDiseaseGenAISchema = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    possibleIssues: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          confidence: { type: 'STRING' },
          observedSymptoms: { type: 'ARRAY', items: { type: 'STRING' } },
          explanation: { type: 'STRING' },
          preventiveMeasures: { type: 'ARRAY', items: { type: 'STRING' } },
          recommendedAction: { type: 'STRING' }
        },
        required: ['name', 'confidence', 'observedSymptoms', 'explanation', 'preventiveMeasures', 'recommendedAction']
      }
    },
    additionalQuestions: { type: 'ARRAY', items: { type: 'STRING' } },
    urgentWarnings: { type: 'ARRAY', items: { type: 'STRING' } },
    expertConsultationRecommended: { type: 'BOOLEAN' },
    disclaimer: { type: 'STRING' }
  },
  required: ['summary', 'possibleIssues', 'additionalQuestions', 'urgentWarnings', 'expertConsultationRecommended', 'disclaimer']
};

export async function generatePestDiseaseAdvisory(inputData) {
  const prompt = buildPestDiseasePrompt(inputData);
  const rawOutput = await callGeminiStructured({
    prompt,
    responseSchema: pestDiseaseGenAISchema
  });

  return aiPestDiseaseOutputSchema.parse(rawOutput);
}

// ==========================================
// 5. AGRICULTURAL CHATBOT
// ==========================================
const chatGenAISchema = {
  type: 'OBJECT',
  properties: {
    answer: { type: 'STRING' },
    category: { type: 'STRING' },
    suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
    requiresExpertConsultation: { type: 'BOOLEAN' },
    disclaimer: { type: 'STRING' }
  },
  required: ['answer', 'category', 'suggestions', 'requiresExpertConsultation', 'disclaimer']
};

export async function generateChatResponse({ message, language = 'en' }) {
  const prompt = buildChatPrompt(message, language);
  const rawOutput = await callGeminiStructured({
    prompt,
    responseSchema: chatGenAISchema
  });

  return aiChatOutputSchema.parse(rawOutput);
}
