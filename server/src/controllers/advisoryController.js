import {
  generateCropRecommendations,
  generateFertilizerAdvisory,
  generateIrrigationAdvisory,
  generatePestDiseaseAdvisory
} from '../services/geminiService.js';
import { getLiveWeather } from '../services/weatherService.js';
import { getSupabase } from '../config/supabase.js';
import { DEFAULT_GEMINI_MODEL } from '../config/gemini.js';

/**
 * Helper to record generated advisory in Supabase
 */
async function persistAdvisory({ userId, landId, advisoryType, inputData, aiResponse, language }) {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('advisories')
      .insert({
        user_id: userId,
        land_id: landId || null,
        advisory_type: advisoryType,
        input_data: inputData,
        ai_response: aiResponse,
        language: language || 'en',
        model_name: DEFAULT_GEMINI_MODEL
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.warn('Failed to persist advisory to database:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Error saving advisory record:', e.message);
    return null;
  }
}

// ==========================================
// 1. CROP ADVISORY
// ==========================================
export async function createCropAdvisory(req, res, next) {
  try {
    const userId = req.user.id;
    const body = req.body;

    // Fetch live weather context if district and state are provided
    let weatherData = null;
    if (body.district && body.state) {
      try {
        const weather = await getLiveWeather({ district: body.district, state: body.state });
        if (weather.isLive) {
          weatherData = {
            temperature: weather.temperature,
            humidity: weather.humidity,
            rainfall: weather.rainfall,
            weatherDescription: weather.weatherDescription
          };
        }
      } catch (e) {
        console.warn('Weather context fetch skipped:', e.message);
      }
    }

    const aiInput = {
      ...body,
      weather: weatherData
    };

    const aiResult = await generateCropRecommendations(aiInput);

    // Save to database
    const savedRecord = await persistAdvisory({
      userId,
      landId: body.landId,
      advisoryType: 'crop',
      inputData: aiInput,
      aiResponse: aiResult,
      language: body.language
    });

    res.status(200).json({
      success: true,
      message: 'Crop recommendations generated successfully',
      data: {
        advisoryId: savedRecord?.id || `adv-${Date.now()}`,
        createdAt: savedRecord?.created_at || new Date().toISOString(),
        weatherAttached: Boolean(weatherData),
        ...aiResult
      }
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// 2. FERTILIZER ADVISORY
// ==========================================
export async function createFertilizerAdvisory(req, res, next) {
  try {
    const userId = req.user.id;
    const body = req.body;

    const aiResult = await generateFertilizerAdvisory(body);

    const savedRecord = await persistAdvisory({
      userId,
      advisoryType: 'fertilizer',
      inputData: body,
      aiResponse: aiResult,
      language: body.language
    });

    res.status(200).json({
      success: true,
      message: 'Fertilizer & nutrient advisory generated successfully',
      data: {
        advisoryId: savedRecord?.id || `adv-${Date.now()}`,
        ...aiResult
      }
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// 3. IRRIGATION ADVISORY
// ==========================================
export async function createIrrigationAdvisory(req, res, next) {
  try {
    const userId = req.user.id;
    const body = req.body;

    const aiResult = await generateIrrigationAdvisory(body);

    const savedRecord = await persistAdvisory({
      userId,
      advisoryType: 'irrigation',
      inputData: body,
      aiResponse: aiResult,
      language: body.language
    });

    res.status(200).json({
      success: true,
      message: 'Irrigation advisory generated successfully',
      data: {
        advisoryId: savedRecord?.id || `adv-${Date.now()}`,
        ...aiResult
      }
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// 4. PEST & DISEASE ADVISORY
// ==========================================
export async function createPestDiseaseAdvisory(req, res, next) {
  try {
    const userId = req.user.id;
    const body = req.body;

    const aiResult = await generatePestDiseaseAdvisory(body);

    const savedRecord = await persistAdvisory({
      userId,
      advisoryType: 'pest',
      inputData: body,
      aiResponse: aiResult,
      language: body.language
    });

    res.status(200).json({
      success: true,
      message: 'Pest & disease diagnostic advice generated successfully',
      data: {
        advisoryId: savedRecord?.id || `adv-${Date.now()}`,
        ...aiResult
      }
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// 5. ADVISORY HISTORY & MANAGEMENT
// ==========================================
export async function getAdvisoryHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const supabase = getSupabase();
    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Advisory history (dev mode)',
        data: [],
        pagination: { page, limit, total: 0 }
      });
    }

    const { data, count, error } = await supabase
      .from('advisories')
      .select('id, advisory_type, language, model_name, created_at, input_data, ai_response', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Advisory history retrieved',
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdvisoryById(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const supabase = getSupabase();
    if (!supabase) {
      return res.status(404).json({
        success: false,
        message: 'Advisory record not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    const { data, error } = await supabase
      .from('advisories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Advisory record not found or unauthorized access.',
        error: { code: 'NOT_FOUND' }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Advisory details retrieved',
      data
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdvisory(req, res, next) {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('advisories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Advisory record removed successfully'
    });
  } catch (err) {
    next(err);
  }
}
