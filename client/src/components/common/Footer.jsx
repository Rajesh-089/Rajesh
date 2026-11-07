import React from 'react';
import { Sprout, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-8 text-xs text-gray-500 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-forest-600" />
          <span className="font-bold text-gray-800 text-sm">AgriGuide AI</span>
          <span>– Empowering Indian Agriculture through Artificial Intelligence.</span>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          <span>for sustainable precision farming.</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 text-center text-[11px] text-gray-400">
        {t('disclaimer')}
      </div>
    </footer>
  );
}
