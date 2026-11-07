/**
 * Agricultural System Prompt and Prompt Builders for AgriGuide AI
 * Strictly upholds Indian agricultural domain knowledge, ICAR/FAO principles,
 * chemical safety, and multi-language support.
 */

export const AGRI_SYSTEM_PROMPT = `You are AgriGuide AI, an agricultural decision-support assistant specializing in crop selection, soil health, irrigation, fertilizer management, weather-aware farming, and crop protection.

Your purpose is to help farmers make informed agricultural decisions using the information they provide.

CORE RESPONSIBILITIES:
1. Analyze soil information.
2. Evaluate crop suitability.
3. Consider geographical location.
4. Consider regional agricultural seasons (Kharif, Rabi, Zaid).
5. Evaluate water availability.
6. Consider weather information when provided.
7. Identify missing information.
8. Generate practical agricultural recommendations.
9. Explain recommendations in simple language.
10. Respond in the user's selected language (English 'en', Kannada 'kn', or Hindi 'hi').

AGRICULTURAL RULES:
- Never invent soil measurements.
- Never invent weather information.
- Never assume unavailable information.
- Clearly identify unknown values.
- Do not guarantee crop yield or profit.
- Do not fabricate market prices.
- Do not claim certainty where evidence is insufficient.
- Do not provide unsupported chemical dosages.
- Do not recommend unsafe pesticide practices.
- Explain limitations of AI recommendations.
- Encourage laboratory soil testing when measurements are unavailable or unreliable.
- Encourage consultation with qualified local agricultural experts for high-impact decisions.

CROP RECOMMENDATIONS:
Consider:
- Soil type.
- Soil pH.
- Nitrogen (N).
- Phosphorus (P).
- Potassium (K).
- Location.
- Season.
- Water availability.
- Weather information.
- Previous crop.
- Regional crop suitability.

Provide a ranked recommendation list when sufficient information exists.
Suitability scores must represent approximate, explainable assessments rather than scientific guarantees.
If critical information is missing, reduce confidence and identify the missing information.

LANGUAGE:
Use the language selected by the user ('en', 'kn', 'hi'). Keep explanations simple, practical, and understandable to farmers.

OUTPUT:
Return only valid JSON matching the requested schema. Do not include Markdown outside the JSON response.`;

export function buildCropRecommendationPrompt(data) {
  const languageInstruction = data.language === 'kn' 
    ? 'Translate all explanations, summary, reasons, and nextSteps into Kannada.'
    : data.language === 'hi'
    ? 'Translate all explanations, summary, reasons, and nextSteps into Hindi.'
    : 'Provide all explanations in clear, farmer-accessible English.';

  return `TASK: Analyze the following agricultural profile and recommend the most suitable crops.

FARM & SOIL PROFILE:
- Location: District: ${data.district}, State: ${data.state}
- Land Area: ${data.landArea || 'Unknown'} ${data.areaUnit || 'acre'}
- Target Season: ${data.season}
- Soil Type: ${data.soilType || 'Unknown / Not tested'}
- Soil pH: ${data.soilPh !== null && data.soilPh !== undefined ? data.soilPh : 'Unknown'}
- Nitrogen (N): ${data.nitrogen !== null && data.nitrogen !== undefined ? data.nitrogen + ' kg/ha' : 'Unknown'}
- Phosphorus (P): ${data.phosphorus !== null && data.phosphorus !== undefined ? data.phosphorus + ' kg/ha' : 'Unknown'}
- Potassium (K): ${data.potassium !== null && data.potassium !== undefined ? data.potassium + ' kg/ha' : 'Unknown'}
- Water Availability: ${data.waterAvailability}
- Previous Crop Cultivated: ${data.previousCrop || 'None / Fallow'}
- Preferred Crop Category: ${data.preferredCategory || 'Any'}
- Budget Level: ${data.budgetCategory || 'Moderate'}

WEATHER CONTEXT:
${data.weather ? JSON.stringify(data.weather) : 'Live weather data not provided.'}

LANGUAGE INSTRUCTION:
${languageInstruction}

Return a ranked list of at least 3 crops (if suitable) with suitabilityScore (0-100), confidence ('low', 'medium', 'high'), specific reasons, water requirements, growing season, and limitations.`;
}

export function buildFertilizerPrompt(data) {
  const languageInstruction = data.language === 'kn'
    ? 'Provide responses in Kannada.'
    : data.language === 'hi'
    ? 'Provide responses in Hindi.'
    : 'Provide responses in English.';

  return `TASK: Provide an educational fertilizer and nutrient management advisory.

CROP & SOIL DETAILS:
- Crop: ${data.crop}
- Growth Stage: ${data.growthStage}
- Farming Paradigm: ${data.farmingMethod || 'Integrated'}
- Soil Type: ${data.soilType || 'Unknown'}
- Soil pH: ${data.soilPh !== null && data.soilPh !== undefined ? data.soilPh : 'Unknown'}
- Available N: ${data.nitrogen !== null && data.nitrogen !== undefined ? data.nitrogen + ' kg/ha' : 'Unknown'}
- Available P: ${data.phosphorus !== null && data.phosphorus !== undefined ? data.phosphorus + ' kg/ha' : 'Unknown'}
- Available K: ${data.potassium !== null && data.potassium !== undefined ? data.potassium + ' kg/ha' : 'Unknown'}

LANGUAGE INSTRUCTION:
${languageInstruction}

Analyze nutrient observations, suggest balanced organic and balanced nutrient practices, mention application timing and precautions, and advise laboratory soil testing.`;
}

export function buildIrrigationPrompt(data) {
  const languageInstruction = data.language === 'kn'
    ? 'Provide responses in Kannada.'
    : data.language === 'hi'
    ? 'Provide responses in Hindi.'
    : 'Provide responses in English.';

  return `TASK: Generate a practical irrigation advisory.

FIELD CONDITIONS:
- Crop: ${data.crop}
- Growth Stage: ${data.growthStage}
- Soil Type: ${data.soilType || 'Unknown'}
- Water Availability: ${data.waterAvailability}
- Irrigation Method: ${data.irrigationMethod || 'Surface / Flood'}
- Recent Rainfall: ${data.rainfallMm || 0} mm
- Observed Soil Moisture: ${data.observedMoisture || 'Normal'}

LANGUAGE INSTRUCTION:
${languageInstruction}

Provide stage-specific watering guidance, weather considerations, critical moisture-sensitive stages, and water conservation tips.`;
}

export function buildPestDiseasePrompt(data) {
  const languageInstruction = data.language === 'kn'
    ? 'Provide responses in Kannada.'
    : data.language === 'hi'
    ? 'Provide responses in Hindi.'
    : 'Provide responses in English.';

  return `TASK: Provide educational pest and plant disease diagnostic guidance.

FIELD OBSERVATIONS:
- Crop: ${data.crop}
- Growth Stage: ${data.growthStage}
- Affected Plant Parts: ${(data.affectedParts || []).join(', ')}
- Duration of Symptoms: ${data.durationDays || 'Recent'} days
- Observed Symptoms: "${data.symptoms}"
- Location: ${data.location || 'India'}

LANGUAGE INSTRUCTION:
${languageInstruction}

IMPORTANT SAFETY RULES:
- Do not claim definitive diagnosis from text alone.
- Do not recommend banned chemicals or hazardous dosages.
- Emphasize Integrated Pest Management (IPM), cultural practices, bio-pesticides (Neem oil, Trichoderma), and consulting local Krishi Vigyan Kendra (KVK) / agricultural extension officers.`;
}

export function buildChatPrompt(message, language = 'en') {
  const languageInstruction = language === 'kn'
    ? 'Answer in Kannada.'
    : language === 'hi'
    ? 'Answer in Hindi.'
    : 'Answer in English.';

  return `AGRICULTURAL USER INQUIRY: "${message}"

LANGUAGE INSTRUCTION:
${languageInstruction}

Provide a helpful, educational agricultural response. Maintain focus strictly on farming, crop management, soil health, irrigation, and plant protection.`;
}
