'use client';

import { usePortfolio } from '@/context/PortfolioContext';
import { NAV_ICONS } from '@/lib/icons';

const NAV_ITEMS = [
  { view: 'dashboard', label: 'Inicio' },
  { view: 'assets',    label: 'Activos' },
  { view: 'analytics', label: 'Análisis' },
  { view: 'settings',  label: 'Ajustes' },
];

export default function BottomNav() {
  const { view, navigateTo } = usePortfolio();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const isActive = view === item.view || (item.view === 'assets' && view === 'asset-detail');
        const icons = NAV_ICONS[item.view];
        const Icon = isActive ? icons.filled : icons.outline;
        return (
          <button
            key={item.view}
            className={`bottom-nav-item${isActive ? ' active' : ''}`}
            onClick={() => navigateTo(item.view)}
          >
            <span className="bottom-nav-icon"><Icon size={22} /></span>
            <span className="bottom-nav-label">{item.label}</span>
            {isActive && <span className="bottom-nav-indicator" />}
          </button>
        );
      })}
    </nav>
  );
}
