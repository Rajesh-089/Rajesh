-- AgriGuide AI – Crop Catalogue Seed Data (Focused on Indian Agriculture)
insert into public.crops (crop_name, crop_category, scientific_name, suitable_soil_types, suitable_seasons, water_requirement, growing_period_days, description)
values
-- Cereals
('Rice (Paddy)', 'Cereals', 'Oryza sativa', 
 ARRAY['Clay Soil', 'Clay Loam', 'Alluvial Soil'], 
 ARRAY['Kharif'], 
 'High', 120, 'Staple grain requiring high water retention and warm, humid conditions during growth.'),

('Wheat', 'Cereals', 'Triticum aestivum', 
 ARRAY['Loamy Soil', 'Clay Loam', 'Alluvial Soil'], 
 ARRAY['Rabi'], 
 'Moderate', 130, 'Major winter cereal crop thriving in cool temperatures with moderate moisture.'),

('Maize (Corn)', 'Cereals', 'Zea mays', 
 ARRAY['Red Soil', 'Loamy Soil', 'Alluvial Soil'], 
 ARRAY['Kharif', 'Rabi', 'Zaid'], 
 'Moderate', 100, 'Versatile cereal well suited for diverse Indian soils with good drainage.'),

('Sorghum (Jowar)', 'Cereals', 'Sorghum bicolor', 
 ARRAY['Black Soil', 'Red Soil', 'Clay Loam'], 
 ARRAY['Kharif', 'Rabi'], 
 'Low', 110, 'Drought-tolerant coarse cereal crop ideal for semi-arid rainfed conditions.'),

-- Pulses
('Chickpea (Bengal Gram)', 'Pulses', 'Cicer arietinum', 
 ARRAY['Black Soil', 'Loamy Soil', 'Sandy Loam'], 
 ARRAY['Rabi'], 
 'Low', 105, 'Major rabi pulse crop enriching soil through biological nitrogen fixation.'),

('Pigeon Pea (Tur / Arhar)', 'Pulses', 'Cajanus cajan', 
 ARRAY['Red Soil', 'Black Soil', 'Loamy Soil'], 
 ARRAY['Kharif'], 
 'Low', 160, 'Deep-rooted legume drought-tolerant and ideal for intercropping with cereals.'),

('Green Gram (Moong)', 'Pulses', 'Vigna radiata', 
 ARRAY['Loamy Soil', 'Sandy Loam', 'Alluvial Soil'], 
 ARRAY['Kharif', 'Zaid'], 
 'Low', 70, 'Short-duration pulse crop excellent for summer catch-cropping and soil health.'),

('Black Gram (Urad)', 'Pulses', 'Vigna mungo', 
 ARRAY['Black Soil', 'Loamy Soil'], 
 ARRAY['Kharif', 'Rabi'], 
 'Low', 80, 'Nutrient-rich pulse that thrives in warm, humid weather and improves soil nitrogen.'),

-- Oilseeds
('Groundnut (Peanut)', 'Oilseeds', 'Arachis hypogaea', 
 ARRAY['Red Soil', 'Sandy Loam', 'Loamy Soil'], 
 ARRAY['Kharif', 'Rabi', 'Zaid'], 
 'Moderate', 115, 'Important oilseed requiring well-drained, loose textured soils for pod development.'),

('Sunflower', 'Oilseeds', 'Helianthus annuus', 
 ARRAY['Black Soil', 'Alluvial Soil', 'Red Soil'], 
 ARRAY['Kharif', 'Rabi', 'Zaid'], 
 'Moderate', 95, 'Day-neutral oilseed crop capable of growing year-round in various Indian climates.'),

('Soybean', 'Oilseeds', 'Glycine max', 
 ARRAY['Black Soil', 'Clay Loam'], 
 ARRAY['Kharif'], 
 'Moderate', 100, 'High-protein oilseed thriving in heavy black soils of Central and South India.'),

-- Commercial Crops
('Cotton', 'Commercial Crops', 'Gossypium hirsutum', 
 ARRAY['Black Soil', 'Alluvial Soil'], 
 ARRAY['Kharif'], 
 'Moderate', 160, 'Cash crop thriving in moisture-retentive black cotton soils with sunny dry conditions.'),

('Sugarcane', 'Commercial Crops', 'Saccharum officinarum', 
 ARRAY['Alluvial Soil', 'Black Soil', 'Loamy Soil'], 
 ARRAY['Kharif', 'Rabi'], 
 'High', 360, 'High-value perennial cash crop demanding fertile soil and abundant irrigation.'),

-- Horticulture
('Tomato', 'Horticulture', 'Solanum lycopersicum', 
 ARRAY['Red Soil', 'Loamy Soil', 'Sandy Loam'], 
 ARRAY['Kharif', 'Rabi', 'Zaid'], 
 'Moderate', 110, 'Widely cultivated vegetable requiring well-drained fertile soil with balanced NPK.'),

('Onion', 'Horticulture', 'Allium cepa', 
 ARRAY['Loamy Soil', 'Alluvial Soil', 'Red Soil'], 
 ARRAY['Kharif', 'Rabi'], 
 'Moderate', 130, 'Key bulb crop requiring loose friable soil rich in organic matter.'),

('Chilli', 'Horticulture', 'Capsicum annuum', 
 ARRAY['Black Soil', 'Red Soil', 'Sandy Loam'], 
 ARRAY['Kharif', 'Rabi'], 
 'Moderate', 140, 'Popular spice and vegetable crop sensitive to waterlogging with high export value.')
on conflict (crop_name) do nothing;
