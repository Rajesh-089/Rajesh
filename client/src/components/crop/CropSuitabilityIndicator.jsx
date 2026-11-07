import React from 'react';

export default function CropSuitabilityIndicator({ score, confidence = 'medium' }) {
  const numericScore = typeof score === 'number' ? score : 75;

  let colorClasses = 'bg-emerald-500 text-white';
  let badgeText = 'Highly Suitable';

  if (numericScore < 60) {
    colorClasses = 'bg-amber-500 text-white';
    badgeText = 'Marginally Suitable';
  } else if (numericScore < 80) {
    colorClasses = 'bg-leaf text-white';
    badgeText = 'Suitable';
  }

  const confidenceBadge = {
    high: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    low: 'bg-amber-100 text-amber-800 border-amber-200'
  }[confidence.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className={`flex items-center justify-center w-11 h-11 rounded-full font-bold text-sm shadow-sm ${colorClasses}`}>
          {numericScore}%
        </div>
        <div>
          <span className="text-xs font-semibold block text-gray-700">{badgeText}</span>
          <span className={`inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${confidenceBadge}`}>
            {confidence} confidence
          </span>
        </div>
      </div>
    </div>
  );
}
