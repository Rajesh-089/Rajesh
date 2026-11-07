import React from 'react';
import { AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function ToxicityBadge({ level = 'organic', warning = '' }) {
  const normalized = (level || '').toLowerCase();

  if (normalized.includes('1a') || normalized.includes('1b') || normalized.includes('red') || normalized.includes('severe')) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
        <span>WHO Class I (Hazardous) - Strict PPE & PHI</span>
      </div>
    );
  }

  if (normalized.includes('2') || normalized.includes('yellow') || normalized.includes('moderate')) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>WHO Class II (Caution)</span>
      </div>
    );
  }

  if (normalized.includes('3') || normalized.includes('blue') || normalized.includes('low')) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
        <Info className="w-3.5 h-3.5 text-blue-600" />
        <span>WHO Class III (Slightly Hazardous)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      <span>Organic / Eco-Safe / Biological</span>
    </div>
  );
}
