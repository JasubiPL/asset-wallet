'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import * as Storage from '@/lib/storage';
import { AssetTypeIcon, IconRecord, IconTrendUp, IconTrash, IconEdit } from '@/lib/icons';
import AssetDetailChart from '../charts/AssetDetailChart';

export default function AssetDetail() {
  const { assetId, refreshKey, fmt, fmtPct, navigateTo, openModal, handleDeleteTransaction } = usePortfolio();

  const asset = useMemo(() => Storage.getAssetById(assetId), [assetId, refreshKey]);
  const perf = useMemo(() => Portfolio.getAssetPerformance(assetId), [assetId, refreshKey]);

  if (!asset) {
    return (
      <section>
        <div className="empty-state">
          <p>Activo no encontrado</p>
          <button className="btn btn-secondary" onClick={() => navigateTo('assets')}>Volver a Activos</button>
        </div>
      </section>
    );
  }

  const typeInfo = Portfolio.ASSET_TYPES[asset.type] || Portfolio.ASSET_TYPES.other;
  const isPositive = perf.changePercent >= 0;

  return (
    <section>
      <div className="detail-header">
        <div className="detail-title-row">
          <div>
            <h2>{asset.name}</h2>
            <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AssetTypeIcon type={asset.type} size={16} /> {typeInfo.label}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => openModal('record-value', { recordAssetId: assetId })}>
            <IconRecord size={16} /> Registrar Valor
          </button>
        </div>
      </div>

      <div className="detail-stats">
        <div className="detail-stat-card">
          <div className="stat-label">Valor Actual</div>
          <div className="stat-value">{fmt(perf.currentValue)}</div>
        </div>
        <div className="detail-stat-card">
          <div className="stat-label">Capital Neto</div>
          <div className="stat-value">{fmt(perf.totalInvested)}</div>
        </div>
        <div className="detail-stat-card">
          <div className="stat-label">Ganancia / Pérdida</div>
          <div className={`stat-value ${isPositive ? 'stat-positive' : 'stat-negative'}`}>{fmt(perf.change)}</div>
        </div>
        <div className="detail-stat-card">
          <div className="stat-label">Rendimiento</div>
          <div className="stat-value">
            <span className={`badge ${isPositive ? 'badge-positive' : 'badge-negative'}`}>{fmtPct(perf.changePercent)}</span>
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: 24 }}>
        <h3><IconTrendUp size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Evolución del Valor</h3>
        <div className="chart-container">
          <AssetDetailChart assetId={assetId} />
        </div>
      </div>

      <h3 className="section-title">Historial de Valores</h3>
      {perf.history.length === 0 ? (
        <div className="empty-state">
          <p>Sin registros de valor</p>
          <button className="btn btn-primary btn-sm" onClick={() => openModal('record-value', { recordAssetId: assetId })}>Registrar valor</button>
        </div>
      ) : (
        <div className="tx-table-wrapper">
        <table className="tx-table">
          <thead>
            <tr><th>Fecha</th><th>Valor</th><th>Aporte</th><th>Nota</th><th></th></tr>
          </thead>
          <tbody>
            {perf.history.map((tx, i) => {
              const dateStr = new Date(tx.date + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
              return (
                <tr key={tx.id || i}>
                  <td>{dateStr}</td>
                  <td className="value-cell">{fmt(tx.value)}</td>
                  <td>
                    {tx.capitalContribution > 0
                      ? fmt(tx.capitalContribution)
                      : tx.capitalContribution < 0
                        ? `-${fmt(Math.abs(tx.capitalContribution))}`
                        : '—'}
                  </td>
                  <td className="note-cell">{tx.note || '—'}</td>
                  <td>
                    <div className="tx-actions">
                      <button className="btn-icon-action edit" onClick={() => openModal('edit-transaction', { editTxId: tx.id })} title="Editar"><IconEdit size={16} /></button>
                      <button className="btn-icon-action danger" onClick={() => handleDeleteTransaction(tx.id)} title="Eliminar"><IconTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      )}
    </section>
  );
}
