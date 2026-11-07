import React from 'react';
import CropSuitabilityIndicator from './CropSuitabilityIndicator.jsx';
import { Sprout, Droplets, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CropRecommendationCard({ crop, rank }) {
  if (!crop) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {rank && (
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-forest-100 text-forest-800 font-bold text-xs">
              #{rank}
            </span>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-forest-600" />
              {crop.cropName}
            </h3>
            <p className="text-xs text-gray-500">
              Season: <span className="font-semibold text-gray-700">{crop.growingSeason || 'Flexible'}</span>
            </p>
          </div>
        </div>

        <CropSuitabilityIndicator
          score={crop.suitabilityScore}
          confidence={crop.confidence}
        />
      </div>

      {/* Grid of Key Properties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 text-xs">
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-start gap-2">
          <Droplets className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-500 block">Water Requirement</span>
            <span className="font-semibold text-gray-800">{crop.waterRequirement || 'Moderate'}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-start gap-2">
          <Calendar className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-500 block">Soil Compatibility</span>
            <span className="font-semibold text-gray-800">{crop.soilCompatibility || 'Good'}</span>
          </div>
        </div>
      </div>

      {/* Reasons for Recommendation */}
      {crop.reasons && crop.reasons.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
            Key Agronomic Advantages:
          </h4>
          <ul className="space-y-1">
            {crop.reasons.map((reason, idx) => (
              <li key={idx} className="text-xs text-gray-600 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-forest-600">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Important Considerations / Limitations */}
      {crop.importantConsiderations && crop.importantConsiderations.length > 0 && (
        <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200/60 mt-3">
          <h4 className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Important Field Precautions:
          </h4>
          <ul className="space-y-1">
            {crop.importantConsiderations.map((item, idx) => (
              <li key={idx} className="text-xs text-amber-900/90 pl-3 relative before:content-['-'] before:absolute before:left-0.5">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
