import { getSupabase } from '../config/supabase.js';

// Comprehensive default crop catalogue for instant availability
const FALLBACK_CROPS = [
  {
    id: 'crop-paddy-01',
    crop_name: 'Rice (Paddy)',
    crop_category: 'Cereals',
    scientific_name: 'Oryza sativa',
    suitable_soil_types: ['Clay Soil', 'Clay Loam', 'Alluvial Soil'],
    suitable_seasons: ['Kharif'],
    water_requirement: 'High',
    growing_period_days: 120,
    description: 'Staple grain requiring high water retention and warm, humid conditions during growth.'
  },
  {
    id: 'crop-wheat-02',
    crop_name: 'Wheat',
    crop_category: 'Cereals',
    scientific_name: 'Triticum aestivum',
    suitable_soil_types: ['Loamy Soil', 'Clay Loam', 'Alluvial Soil'],
    suitable_seasons: ['Rabi'],
    water_requirement: 'Moderate',
    growing_period_days: 130,
    description: 'Major winter cereal crop thriving in cool temperatures with moderate moisture.'
  },
  {
    id: 'crop-maize-03',
    crop_name: 'Maize (Corn)',
    crop_category: 'Cereals',
    scientific_name: 'Zea mays',
    suitable_soil_types: ['Red Soil', 'Loamy Soil', 'Alluvial Soil'],
    suitable_seasons: ['Kharif', 'Rabi', 'Zaid'],
    water_requirement: 'Moderate',
    growing_period_days: 100,
    description: 'Versatile cereal well suited for diverse Indian soils with good drainage.'
  },
  {
    id: 'crop-chickpea-04',
    crop_name: 'Chickpea (Bengal Gram)',
    crop_category: 'Pulses',
    scientific_name: 'Cicer arietinum',
    suitable_soil_types: ['Black Soil', 'Loamy Soil', 'Sandy Loam'],
    suitable_seasons: ['Rabi'],
    water_requirement: 'Low',
    growing_period_days: 105,
    description: 'Major rabi pulse crop enriching soil through biological nitrogen fixation.'
  },
  {
    id: 'crop-tur-05',
    crop_name: 'Pigeon Pea (Tur / Arhar)',
    crop_category: 'Pulses',
    scientific_name: 'Cajanus cajan',
    suitable_soil_types: ['Red Soil', 'Black Soil', 'Loamy Soil'],
    suitable_seasons: ['Kharif'],
    water_requirement: 'Low',
    growing_period_days: 160,
    description: 'Deep-rooted legume drought-tolerant and ideal for intercropping with cereals.'
  },
  {
    id: 'crop-groundnut-06',
    crop_name: 'Groundnut (Peanut)',
    crop_category: 'Oilseeds',
    scientific_name: 'Arachis hypogaea',
    suitable_soil_types: ['Red Soil', 'Sandy Loam', 'Loamy Soil'],
    suitable_seasons: ['Kharif', 'Rabi', 'Zaid'],
    water_requirement: 'Moderate',
    growing_period_days: 115,
    description: 'Important oilseed requiring well-drained, loose textured soils for pod development.'
  },
  {
    id: 'crop-cotton-07',
    crop_name: 'Cotton',
    crop_category: 'Commercial Crops',
    scientific_name: 'Gossypium hirsutum',
    suitable_soil_types: ['Black Soil', 'Alluvial Soil'],
    suitable_seasons: ['Kharif'],
    water_requirement: 'Moderate',
    growing_period_days: 160,
    description: 'Cash crop thriving in moisture-retentive black cotton soils with sunny dry conditions.'
  },
  {
    id: 'crop-tomato-08',
    crop_name: 'Tomato',
    crop_category: 'Horticulture',
    scientific_name: 'Solanum lycopersicum',
    suitable_soil_types: ['Red Soil', 'Loamy Soil', 'Sandy Loam'],
    suitable_seasons: ['Kharif', 'Rabi', 'Zaid'],
    water_requirement: 'Moderate',
    growing_period_days: 110,
    description: 'Widely cultivated vegetable requiring well-drained fertile soil with balanced NPK.'
  }
];

export async function getAllCrops() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('crop_category', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Could not read crops from Supabase; using agricultural catalogue fallback.');
    }
  }
  return FALLBACK_CROPS;
}

export async function getCropById(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return data;
    } catch (e) {
      // Fallback below
    }
  }
  return FALLBACK_CROPS.find(c => c.id === id) || null;
}
