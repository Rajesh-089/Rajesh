import { getSupabase } from '../config/supabase.js';

export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Profile retrieved (development mock mode)',
        data: {
          id: userId,
          full_name: req.user.user_metadata?.full_name || 'Farmer',
          preferred_language: 'en',
          farming_experience: 5
        }
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Profile not created yet, return default baseline
      return res.status(200).json({
        success: true,
        message: 'Profile not yet initialized',
        data: {
          id: userId,
          full_name: req.user.user_metadata?.full_name || 'Farmer',
          preferred_language: 'en'
        }
      });
    }

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const updates = {
      full_name: req.body.fullName,
      phone: req.body.phone,
      state: req.body.state,
      district: req.body.district,
      village: req.body.village,
      preferred_language: req.body.preferredLanguage,
      farming_experience: req.body.farmingExperience,
      total_land_area: req.body.totalLandArea,
      land_measurement_unit: req.body.landMeasurementUnit
    };

    // Filter undefined keys
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const supabase = getSupabase();
    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Profile updated (mock mode)',
        data: { id: userId, ...updates }
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates })
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data
    });
  } catch (err) {
    next(err);
  }
}
