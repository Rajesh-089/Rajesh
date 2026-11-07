import { z } from 'zod';

// ==========================================
// 1. User & Profile Schemas
// ==========================================
export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().nullable(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  preferredLanguage: z.enum(['en', 'kn', 'hi']).default('en')
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  village: z.string().optional().nullable(),
  preferredLanguage: z.enum(['en', 'kn', 'hi']).optional(),
  farmingExperience: z.number().min(0).max(80).optional().nullable(),
  totalLandArea: z.number().positive().optional().nullable(),
  landMeasurementUnit: z.enum(['acre', 'hectare', 'guntha', 'bigha']).optional()
});

// ==========================================
// 2. Soil & Land Schemas
// ==========================================
export const soilSchema = z.object({
  soilType: z.string().optional().nullable(),
  soilPh: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().min(0).optional().nullable(),
  phosphorus: z.number().min(0).optional().nullable(),
  potassium: z.number().min(0).optional().nullable(),
  soilMoisture: z.number().min(0).max(100).optional().nullable()
});

export const landSchema = z.object({
  landName: z.string().min(2, 'Land name must be at least 2 characters').max(100),
  area: z.number().positive('Area must be a positive number'),
  areaUnit: z.enum(['acre', 'hectare', 'guntha', 'bigha']).default('acre'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().optional().nullable(),
  soilType: z.string().optional().nullable(),
  soilPh: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().min(0).optional().nullable(),
  phosphorus: z.number().min(0).optional().nullable(),
  potassium: z.number().min(0).optional().nullable(),
  soilMoisture: z.number().min(0).max(100).optional().nullable(),
  irrigationAvailable: z.boolean().default(false),
  previousCrop: z.string().optional().nullable()
});

// ==========================================
// 3. Crop Advisory Request Schema
// ==========================================
export const cropAdvisoryRequestSchema = z.object({
  landId: z.string().uuid().optional().nullable(),
  state: z.string().min(2),
  district: z.string().min(2),
  soilType: z.string().optional().nullable(),
  soilPh: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().min(0).optional().nullable(),
  phosphorus: z.number().min(0).optional().nullable(),
  potassium: z.number().min(0).optional().nullable(),
  landArea: z.number().positive().optional().nullable(),
  areaUnit: z.string().default('acre'),
  season: z.enum(['Kharif', 'Rabi', 'Zaid']),
  waterAvailability: z.enum(['low', 'moderate', 'high']),
  previousCrop: z.string().optional().nullable(),
  preferredCategory: z.string().optional().nullable(),
  budgetCategory: z.enum(['low', 'medium', 'high']).optional().nullable(),
  language: z.enum(['en', 'kn', 'hi']).default('en')
});

// ==========================================
// 4. Fertilizer Advisory Request Schema
// ==========================================
export const fertilizerAdvisoryRequestSchema = z.object({
  crop: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  soilType: z.string().optional().nullable(),
  soilPh: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().min(0).optional().nullable(),
  phosphorus: z.number().min(0).optional().nullable(),
  potassium: z.number().min(0).optional().nullable(),
  farmingMethod: z.enum(['conventional', 'integrated', 'organic']).default('integrated'),
  language: z.enum(['en', 'kn', 'hi']).default('en')
});

// ==========================================
// 5. Irrigation Advisory Request Schema
// ==========================================
export const irrigationAdvisoryRequestSchema = z.object({
  crop: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  soilType: z.string().optional().nullable(),
  waterAvailability: z.enum(['low', 'moderate', 'high']),
  irrigationMethod: z.string().optional().nullable(),
  rainfallMm: z.number().min(0).default(0),
  observedMoisture: z.string().optional().nullable(),
  language: z.enum(['en', 'kn', 'hi']).default('en')
});

// ==========================================
// 6. Pest and Disease Request Schema
// ==========================================
export const pestDiseaseRequestSchema = z.object({
  crop: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  symptoms: z.string().min(5, 'Please describe observed symptoms in detail'),
  affectedParts: z.array(z.string()).min(1, 'Select at least one affected plant part'),
  durationDays: z.number().min(1).max(365).optional().nullable(),
  location: z.string().optional().nullable(),
  language: z.enum(['en', 'kn', 'hi']).default('en')
});

// ==========================================
// 7. Agricultural Chat Request Schema
// ==========================================
export const chatRequestSchema = z.object({
  conversationId: z.string().uuid().optional().nullable(),
  message: z.string().min(2, 'Message cannot be empty').max(1000),
  language: z.enum(['en', 'kn', 'hi']).default('en')
});

// ==========================================
// 8. AI Output Validation Schemas
// ==========================================
export const aiCropRecommendationOutputSchema = z.object({
  summary: z.string(),
  recommendations: z.array(
    z.object({
      cropName: z.string(),
      suitabilityScore: z.number().min(0).max(100),
      confidence: z.enum(['low', 'medium', 'high']),
      reasons: z.array(z.string()),
      soilCompatibility: z.string(),
      waterRequirement: z.string(),
      growingSeason: z.string(),
      importantConsiderations: z.array(z.string())
    })
  ).min(1),
  soilObservations: z.array(z.string()),
  missingInformation: z.array(z.string()),
  nextSteps: z.array(z.string()),
  disclaimer: z.string()
});

export const aiFertilizerOutputSchema = z.object({
  summary: z.string(),
  nutrientObservations: z.array(
    z.object({
      nutrient: z.string(),
      status: z.string(),
      explanation: z.string()
    })
  ),
  recommendations: z.array(
    z.object({
      category: z.string(),
      suggestion: z.string(),
      timing: z.string(),
      reason: z.string(),
      precautions: z.array(z.string())
    })
  ),
  missingInformation: z.array(z.string()),
  expertConsultationRecommended: z.boolean(),
  disclaimer: z.string()
});

export const aiIrrigationOutputSchema = z.object({
  summary: z.string(),
  waterAvailability: z.string(),
  recommendations: z.array(
    z.object({
      stage: z.string(),
      guidance: z.string(),
      reason: z.string(),
      waterConservationTips: z.array(z.string())
    })
  ),
  weatherConsiderations: z.array(z.string()),
  warnings: z.array(z.string()),
  missingInformation: z.array(z.string()),
  disclaimer: z.string()
});

export const aiPestDiseaseOutputSchema = z.object({
  summary: z.string(),
  possibleIssues: z.array(
    z.object({
      name: z.string(),
      confidence: z.enum(['low', 'medium', 'high']),
      observedSymptoms: z.array(z.string()),
      explanation: z.string(),
      preventiveMeasures: z.array(z.string()),
      recommendedAction: z.string()
    })
  ),
  additionalQuestions: z.array(z.string()),
  urgentWarnings: z.array(z.string()),
  expertConsultationRecommended: z.boolean(),
  disclaimer: z.string()
});

export const aiChatOutputSchema = z.object({
  answer: z.string(),
  category: z.string(),
  suggestions: z.array(z.string()),
  requiresExpertConsultation: z.boolean(),
  disclaimer: z.string()
});
