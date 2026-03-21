'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import { AssetTypeIcon, IconPieChart, AppLogo, IconPlus } from '@/lib/icons';
import AllocationPieChart from '../charts/AllocationPieChart';

export default function Dashboard() {
  const { refreshKey, fmt, fmtPct, navigateTo, openModal } = usePortfolio();

  const summary = useMemo(() => Portfolio.getPortfolioSummary(), [refreshKey]);

  const isPositive = summary.totalChange >= 0;

  return (
    <section>
      {/* Hero Balance — Exodus style */}
      <div className="hero-balance">
        <div className="hero-label">Portafolio Total</div>
        <div className="hero-value">{fmt(summary.totalCurrentValue)}</div>
        <div className={`hero-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="hero-change-icon">{isPositive ? '▲' : '▼'}</span>
          {' '}{fmt(Math.abs(summary.totalChange))} ({fmtPct(summary.totalChangePercent)})
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat">
          <div className="quick-stat-value">{summary.assetCount}</div>
          <div className="quick-stat-label">Activos</div>
        </div>
        <div className="quick-stat">
          <div className={`quick-stat-value ${isPositive ? 'stat-positive' : 'stat-negative'}`}>
            {fmtPct(summary.totalChangePercent)}
          </div>
          <div className="quick-stat-label">Rendimiento</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value">{fmt(summary.totalInvested)}</div>
          <div className="quick-stat-label">Capital neto</div>
        </div>
      </div>

      {/* Allocation Chart */}
      {summary.assets.length > 0 && (
        <div className="chart-card" style={{ marginBottom: 24 }}>
          <h3><IconPieChart size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Distribuci&#243;n</h3>
          <div className="chart-container" style={{ height: 200 }}>
            <AllocationPieChart />
          </div>
        </div>
      )}

      {/* Assets List — Exodus style */}
      <div className="section-header">
        <span className="section-title" style={{ marginBottom: 0 }}>Tus Activos</span>
        {summary.assets.length > 0 && (
          <button className="section-action" onClick={() => navigateTo('assets')}>Ver todos</button>
        )}
      </div>

      {summary.assets.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><AppLogo /></span>
          <p>No tienes activos registrados</p>
          <button className="btn btn-primary btn-sm" onClick={() => openModal('add-asset')}>
            <IconPlus size={16} /> Agregar primer activo
          </button>
        </div>
      ) : (
        <div className="asset-list">
          {summary.assets
            .sort((a, b) => b.currentValue - a.currentValue)
            .slice(0, 8)
            .map((asset) => {
              const typeInfo = Portfolio.ASSET_TYPES[asset.type] || Portfolio.ASSET_TYPES.other;
              const pos = asset.changePercent >= 0;
              return (
                <div
                  key={asset.id}
                  className="asset-list-item"
                  onClick={() => navigateTo('asset-detail', asset.id)}
                >
                  <div className="asset-list-icon" style={{ background: `${typeInfo.color}22` }}>
                    <AssetTypeIcon type={asset.type} size={20} color={typeInfo.color} />
                  </div>
                  <div className="asset-list-info">
                    <div className="asset-list-name">{asset.name}</div>
                    <div className="asset-list-type">{typeInfo.label} &middot; {asset.allocation.toFixed(1)}%</div>
                  </div>
                  <div className="asset-list-values">
                    <div className="asset-list-price">{fmt(asset.currentValue)}</div>
                    <div className={`asset-list-change ${pos ? 'positive' : 'negative'}`}>
                      {pos ? '+' : ''}{fmtPct(asset.changePercent)}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}
