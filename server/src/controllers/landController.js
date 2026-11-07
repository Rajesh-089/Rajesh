import { getSupabase } from '../config/supabase.js';

export async function getLands(req, res, next) {
  try {
    const userId = req.user.id;
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Lands retrieved (empty/dev mode)',
        data: []
      });
    }

    const { data, error } = await supabase
      .from('lands')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Lands retrieved successfully',
      data: data || []
    });
  } catch (err) {
    next(err);
  }
}

export async function createLand(req, res, next) {
  try {
    const userId = req.user.id;
    const body = req.body;

    const newLand = {
      user_id: userId,
      land_name: body.landName,
      area: body.area,
      area_unit: body.areaUnit || 'acre',
      state: body.state,
      district: body.district,
      village: body.village || null,
      soil_type: body.soilType || null,
      soil_ph: body.soilPh ?? null,
      nitrogen: body.nitrogen ?? null,
      phosphorus: body.phosphorus ?? null,
      potassium: body.potassium ?? null,
      soil_moisture: body.soilMoisture ?? null,
      irrigation_available: body.irrigationAvailable ?? false,
      previous_crop: body.previousCrop || null
    };

    const supabase = getSupabase();
    if (!supabase) {
      return res.status(201).json({
        success: true,
        message: 'Land created successfully (dev mode)',
        data: { id: `land-${Date.now()}`, ...newLand }
      });
    }

    const { data, error } = await supabase
      .from('lands')
      .insert(newLand)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Land created successfully',
      data
    });
  } catch (err) {
    next(err);
  }
}

export async function getLandById(req, res, next) {
  try {
    const userId = req.user.id;
    const landId = req.params.id;
    const supabase = getSupabase();

    if (!supabase) {
      return res.status(404).json({
        success: false,
        message: 'Land not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    const { data, error } = await supabase
      .from('lands')
      .select('*')
      .eq('id', landId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Land parcel not found or unauthorized access.',
        error: { code: 'NOT_FOUND' }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Land details retrieved',
      data
    });
  } catch (err) {
    next(err);
  }
}

export async function updateLand(req, res, next) {
  try {
    const userId = req.user.id;
    const landId = req.params.id;
    const body = req.body;

    const updates = {
      land_name: body.landName,
      area: body.area,
      area_unit: body.areaUnit,
      state: body.state,
      district: body.district,
      village: body.village,
      soil_type: body.soilType,
      soil_ph: body.soilPh,
      nitrogen: body.nitrogen,
      phosphorus: body.phosphorus,
      potassium: body.potassium,
      soil_moisture: body.soilMoisture,
      irrigation_available: body.irrigationAvailable,
      previous_crop: body.previousCrop
    };

    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const supabase = getSupabase();
    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Land updated (dev mode)',
        data: { id: landId, ...updates }
      });
    }

    const { data, error } = await supabase
      .from('lands')
      .update(updates)
      .eq('id', landId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Land updated successfully',
      data
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteLand(req, res, next) {
  try {
    const userId = req.user.id;
    const landId = req.params.id;
    const supabase = getSupabase();

    if (supabase) {
      const { error } = await supabase
        .from('lands')
        .delete()
        .eq('id', landId)
        .eq('user_id', userId);

      if (error) throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Land parcel deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}
