import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  LayoutDashboard,
  MapPin,
  Sprout,
  FlaskConical,
  Droplets,
  Bug,
  CloudSun,
  BotMessageSquare,
  History,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Sidebar() {
  const { t } = useLanguage();

  const links = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/land-details', label: t('lands'), icon: MapPin },
    { to: '/crop-advisory', label: t('cropAdvisory'), icon: Sprout },
    { to: '/fertilizer-advisory', label: t('fertilizer'), icon: FlaskConical },
    { to: '/irrigation-advisory', label: t('irrigation'), icon: Droplets },
    { to: '/pest-disease', label: t('pestDisease'), icon: Bug },
    { to: '/weather', label: t('weather'), icon: CloudSun },
    { to: '/ai-assistant', label: t('chatAssistant'), icon: BotMessageSquare },
    { to: '/history', label: t('history'), icon: History },
    { to: '/settings', label: t('settings'), icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1.5 flex-1">
        <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Agri Advisory Suite
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-forest-50 text-forest-800 shadow-sm border border-forest-200/60'
                    : 'text-gray-600 hover:text-forest-700 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Advisory Support Box */}
      <div className="p-4 m-3 bg-forest-50/70 border border-forest-100 rounded-xl text-xs text-forest-900">
        <div className="flex items-center gap-1.5 font-bold mb-1">
          <HelpCircle className="w-4 h-4 text-forest-600" />
          <span>Kisan Helpline</span>
        </div>
        <p className="text-[11px] text-gray-600">
          Toll-Free Govt Kisan Call Centre: <strong className="text-forest-800">1800-180-1551</strong>
        </p>
      </div>
    </aside>
  );
}
