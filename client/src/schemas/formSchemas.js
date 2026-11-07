import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  preferredLanguage: z.enum(['en', 'kn', 'hi'])
});

export const landFormSchema = z.object({
  landName: z.string().min(2, 'Land parcel name is required'),
  area: z.coerce.number().positive('Area must be greater than zero'),
  areaUnit: z.enum(['acre', 'hectare', 'guntha', 'bigha']),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().optional(),
  soilType: z.string().optional(),
  soilPh: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().min(0).optional().nullable(),
  phosphorus: z.coerce.number().min(0).optional().nullable(),
  potassium: z.coerce.number().min(0).optional().nullable(),
  soilMoisture: z.coerce.number().min(0).max(100).optional().nullable(),
  irrigationAvailable: z.boolean().default(false),
  previousCrop: z.string().optional()
});

export const cropAdvisoryFormSchema = z.object({
  landId: z.string().optional(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  season: z.enum(['Kharif', 'Rabi', 'Zaid']),
  waterAvailability: z.enum(['low', 'moderate', 'high']),
  soilType: z.string().optional(),
  soilPh: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().min(0).optional().nullable(),
  phosphorus: z.coerce.number().min(0).optional().nullable(),
  potassium: z.coerce.number().min(0).optional().nullable(),
  landArea: z.coerce.number().positive().optional().nullable(),
  areaUnit: z.string().default('acre'),
  previousCrop: z.string().optional(),
  preferredCategory: z.string().optional(),
  budgetCategory: z.enum(['low', 'medium', 'high']).optional(),
  language: z.enum(['en', 'kn', 'hi']).default('en')
});

export const fertilizerFormSchema = z.object({
  crop: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  soilType: z.string().optional(),
  soilPh: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().min(0).optional().nullable(),
  phosphorus: z.coerce.number().min(0).optional().nullable(),
  potassium: z.coerce.number().min(0).optional().nullable(),
  farmingMethod: z.enum(['conventional', 'integrated', 'organic']).default('integrated'),
  language: z.enum(['en', 'kn', 'hi']).default('en')
});

export const irrigationFormSchema = z.object({
  crop: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  soilType: z.string().optional(),
  waterAvailability: z.enum(['low', 'moderate', 'high']),
  irrigationMethod: z.string().optional(),
  rainfallMm: z.coerce.number().min(0).default(0),
  observedMoisture: z.string().optional(),
  language: z.enum(['en', 'kn', 'hi']).default('en')
});

export const pestDiseaseFormSchema = z.object({
  crop: z.string().min(2, 'Crop name is required'),
  growthStage: z.string().min(2, 'Growth stage is required'),
  symptoms: z.string().min(5, 'Please provide observed symptom details'),
  affectedParts: z.array(z.string()).min(1, 'Select at least one affected part'),
  durationDays: z.coerce.number().min(1).optional().nullable(),
  location: z.string().optional(),
  language: z.enum(['en', 'kn', 'hi']).default('en')
});
