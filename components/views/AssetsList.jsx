'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import { AssetTypeIcon, IconFolder, IconRecord, IconEdit, IconTrash, IconPlus } from '@/lib/icons';

export default function AssetsList() {
  const { refreshKey, fmt, fmtPct, navigateTo, openModal, handleDeleteAsset } = usePortfolio();

  const summary = useMemo(() => Portfolio.getPortfolioSummary(), [refreshKey]);

  if (summary.assets.length === 0) {
    return (
      <section>
        <div className="empty-state large">
          <span className="empty-icon"><IconFolder size={40} /></span>
          <h3>Sin activos</h3>
          <p>Empieza agregando tu primer activo al portafolio</p>
          <button className="btn btn-primary" onClick={() => openModal('add-asset')}>
            <IconPlus size={16} /> Agregar Activo
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span className="section-title" style={{ marginBottom: 0 }}>Todos los Activos</span>
        <button className="btn btn-primary btn-sm" onClick={() => openModal('add-asset')}>
          <IconPlus size={16} /> Agregar
        </button>
      </div>

      {/* Mobile: Exodus-style rows */}
      <div className="mobile-assets-list">
        {summary.assets.map((asset) => {
          const typeInfo = Portfolio.ASSET_TYPES[asset.type] || Portfolio.ASSET_TYPES.other;
          const pos = asset.changePercent >= 0;
          return (
            <div key={asset.id} className="mobile-asset-row" onClick={() => navigateTo('asset-detail', asset.id)}>
              <div className="mobile-asset-icon" style={{ background: `${typeInfo.color}22` }}>
                <AssetTypeIcon type={asset.type} size={20} color={typeInfo.color} />
              </div>
              <div className="mobile-asset-info">
                <div className="mobile-asset-name">{asset.name}</div>
                <div className="mobile-asset-type" style={{ background: `${typeInfo.color}15`, color: typeInfo.color }}>
                  {typeInfo.label}
                </div>
              </div>
              <div className="mobile-asset-right">
                <div className="mobile-asset-value">{fmt(asset.currentValue)}</div>
                <div className={`mobile-asset-change ${pos ? 'positive' : 'negative'}`}>
                  {pos ? '+' : ''}{fmtPct(asset.changePercent)}
                </div>
              </div>
              <div className="mobile-asset-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn-icon-action record" title="Registrar" onClick={() => openModal('record-value', { recordAssetId: asset.id })}><IconRecord size={15} /></button>
                <button className="btn-icon-action danger" title="Eliminar" onClick={() => handleDeleteAsset(asset.id)}><IconTrash size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Table */}
      <div className="assets-table-wrapper">
        <table className="assets-table">
          <thead>
            <tr>
              <th>Activo</th>
              <th>Tipo</th>
              <th>Valor Actual</th>
              <th>Cambio</th>
              <th>Rendimiento</th>
              <th>% Portafolio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {summary.assets.map((asset) => {
              const typeInfo = Portfolio.ASSET_TYPES[asset.type] || Portfolio.ASSET_TYPES.other;
              const pos = asset.changePercent >= 0;
              return (
                <tr key={asset.id} className="asset-row" onClick={() => navigateTo('asset-detail', asset.id)}>
                  <td>
                    <div className="asset-name-cell">
                      <span className="asset-icon-sm"><AssetTypeIcon type={asset.type} size={18} /></span>
                      <span>{asset.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="type-badge" style={{ background: `${typeInfo.color}22`, color: typeInfo.color }}>
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="value-cell">{fmt(asset.currentValue)}</td>
                  <td className={`value-cell ${pos ? 'stat-positive' : 'stat-negative'}`}>{fmt(asset.change)}</td>
                  <td>
                    <span className={`badge ${pos ? 'badge-positive' : 'badge-negative'}`}>{fmtPct(asset.changePercent)}</span>
                  </td>
                  <td>{asset.allocation.toFixed(1)}%</td>
                  <td>
                    <div className="action-btns" onClick={(e) => e.stopPropagation()}>
                      <button className="btn-icon-action record" title="Registrar valor" onClick={() => openModal('record-value', { recordAssetId: asset.id })}><IconRecord size={16} /></button>
                      <button className="btn-icon-action" title="Editar" onClick={() => openModal('add-asset', { editAssetId: asset.id })}><IconEdit size={16} /></button>
                      <button className="btn-icon-action danger" title="Eliminar" onClick={() => handleDeleteAsset(asset.id)}><IconTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
