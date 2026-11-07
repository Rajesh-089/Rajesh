import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export default function SoilRadarChart({ nitrogen, phosphorus, potassium, ph }) {
  // Normalize metrics to 0-100 scale for intuitive comparison
  const nScore = nitrogen ? Math.min(Math.round((nitrogen / 280) * 100), 100) : 40;
  const pScore = phosphorus ? Math.min(Math.round((phosphorus / 45) * 100), 100) : 40;
  const kScore = potassium ? Math.min(Math.round((potassium / 280) * 100), 100) : 40;
  const phScore = ph ? Math.min(Math.round(((ph - 4) / (8.5 - 4)) * 100), 100) : 50;

  const data = [
    { subject: 'Nitrogen (N)', current: nScore, ideal: 100 },
    { subject: 'Phosphorus (P)', current: pScore, ideal: 100 },
    { subject: 'Potassium (K)', current: kScore, ideal: 100 },
    { subject: 'pH Balance', current: phScore, ideal: 100 }
  ];

  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        Soil Nutrient Balance Index (%)
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4a5568', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
          <Radar
            name="Ideal Baseline"
            dataKey="ideal"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.15}
            strokeDasharray="3 3"
          />
          <Radar
            name="Current Soil Test"
            dataKey="current"
            stroke="#16a34a"
            fill="#22c55e"
            fillOpacity={0.45}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
