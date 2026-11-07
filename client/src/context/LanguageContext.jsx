import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appTitle: 'AgriGuide AI',
    tagline: 'AI-Powered Agriculture Crop Advisory Assistant',
    dashboard: 'Dashboard',
    cropAdvisory: 'Crop Advisory',
    fertilizer: 'Fertilizer Guide',
    irrigation: 'Irrigation Planner',
    pestDisease: 'Pest & Disease',
    weather: 'Weather Insights',
    chatAssistant: 'AI Krishi Chat',
    history: 'Advisory History',
    profile: 'Farmer Profile',
    lands: 'My Land Parcels',
    settings: 'Settings',
    logout: 'Sign Out',
    login: 'Sign In',
    register: 'Create Account',
    soilType: 'Soil Type',
    soilPh: 'Soil pH',
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    season: 'Season',
    waterAvailability: 'Water Availability',
    disclaimer: 'AgriGuide AI provides educational decision-support. Please verify recommendations with local agricultural officers (KVK).'
  },
  kn: {
    appTitle: 'ಅಗ್ರಿ-ಗೈಡ್ ಎಐ',
    tagline: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯ ಕೃಷಿ ಬೆಳೆ ಸಲಹಾ ಸಹಾಯಕ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    cropAdvisory: 'ಬೆಳೆ ಸಲಹೆ',
    fertilizer: 'ಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ',
    irrigation: 'ನೀರಾವರಿ ಯೋಜನೆ',
    pestDisease: 'ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ',
    weather: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    chatAssistant: 'ಕೃಷಿ ಚಾಟ್ ಸಹಾಯಕ',
    history: 'ಹಿಂದಿನ ಸಲಹೆಗಳು',
    profile: 'ರೈತರ ವಿವರ',
    lands: 'ನನ್ನ ಜಮೀನುಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    logout: 'ನಿರ್ಗಮಿಸಿ',
    login: 'ಲಾಗಿನ್ ಮಾಡಿ',
    register: 'ಖಾತೆ ತೆರೆಯಿರಿ',
    soilType: 'ಮಣ್ಣಿನ ವಿಧ',
    soilPh: 'ಮಣ್ಣಿನ ಪಿ.ಎಚ್ (pH)',
    nitrogen: 'ಸಾರಜನಕ (N)',
    phosphorus: 'ರಂಜಕ (P)',
    potassium: 'ಪೊಟ್ಯಾಷ್ (K)',
    season: 'ಋತು / ಹಂಗಾಮು',
    waterAvailability: 'ನೀರಿನ ಲಭ್ಯತೆ',
    disclaimer: 'ಅಗ್ರಿ-ಗೈಡ್ ಎಐ ಕೃಷಿ ನಿರ್ಧಾರ-ಬೆಂಬಲ ಒದಗಿಸುತ್ತದೆ. ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದ (KVK) ಅಧಿಕಾರಿಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ.'
  },
  hi: {
    appTitle: 'एग्री-गाइड एआई',
    tagline: 'एआई-संचालित कृषि फसल सलाहकार सहायक',
    dashboard: 'डैशबोर्ड',
    cropAdvisory: 'फसल सलाह',
    fertilizer: 'उर्वरक एवं पोषण',
    irrigation: 'सिंचाई योजना',
    pestDisease: 'कीट एवं रोग नियंत्रण',
    weather: 'मौसम पूर्वानुमान',
    chatAssistant: 'कृषि चैट सहायक',
    history: 'सलाह इतिहास',
    profile: 'किसान प्रोफाइल',
    lands: 'मेरी कृषि भूमि',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    login: 'साइन इन',
    register: 'नया खाता बनाएं',
    soilType: 'मिट्टी का प्रकार',
    soilPh: 'मृदा पीएच (pH)',
    nitrogen: 'नाइट्रोजन (N)',
    phosphorus: 'फास्फोरस (P)',
    potassium: 'पोटाश (K)',
    season: 'मौसम / फसल चक्र',
    waterAvailability: 'जल उपलब्धता',
    disclaimer: 'एग्री-गाइड एआई शैक्षिक निर्णय-समर्थन प्रदान करता है। महत्वपूर्ण निर्णयों के लिए स्थानीय कृषि विज्ञान केंद्र (KVK) से परामर्श लें।'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('agriguide_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agriguide_lang', language);
  }, [language]);

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
