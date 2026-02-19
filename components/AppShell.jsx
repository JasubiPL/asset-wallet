'use client';

import { usePortfolio } from '@/context/PortfolioContext';
import { AppLogo, IconPlus, IconBack } from '@/lib/icons';
import BottomNav from './BottomNav';
import Dashboard from './views/Dashboard';
import AssetsList from './views/AssetsList';
import AssetDetail from './views/AssetDetail';
import Analytics from './views/Analytics';
import Settings from './views/Settings';
import AddAssetModal from './modals/AddAssetModal';
import RecordValueModal from './modals/RecordValueModal';
import EditTransactionModal from './modals/EditTransactionModal';
import Notifications from './ui/Notifications';

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  assets: 'Mis Activos',
  'asset-detail': 'Detalle',
  analytics: 'Análisis',
  settings: 'Ajustes',
};

export default function AppShell() {
  const { view, modal, openModal, goBack, mounted, loading } = usePortfolio();

  if (!mounted || loading) return (
    <div className="app-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <AppLogo  />
        <p style={{ fontSize: '0.85rem' }}>Cargando datos...</p>
      </div>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case 'dashboard':    return <Dashboard />;
      case 'assets':       return <AssetsList />;
      case 'asset-detail': return <AssetDetail />;
      case 'analytics':    return <Analytics />;
      case 'settings':     return <Settings />;
      default:             return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Top Header */}
      <header className="top-header">
        <div className="top-header-left">
          {view === 'asset-detail' ? (
            <button className="btn-back" onClick={goBack} title="Regresar">
              <IconBack size={22} />
            </button>
          ) : (
            <span className="top-logo"><AppLogo size={22} /></span>
          )}
          <div>
            <h1 className="top-title">Asset Wallet</h1>
            <span className="top-subtitle">{VIEW_TITLES[view] || 'Dashboard'}</span>
          </div>
        </div>
        <button className="btn-add-header" onClick={() => openModal('add-asset')} title="Agregar activo">
          <IconPlus size={20} />
        </button>
      </header>

      {/* Main scrollable content */}
      <main className="main-scroll">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {modal === 'add-asset' && <AddAssetModal />}
      {modal === 'record-value' && <RecordValueModal />}
      {modal === 'edit-transaction' && <EditTransactionModal />}
      <Notifications />
    </div>
  );
}
