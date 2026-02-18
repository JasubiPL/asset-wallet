'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import { AssetTypeIcon, IconTrendUp, IconBarChart } from '@/lib/icons';
import PortfolioLineChart from '../charts/PortfolioLineChart';
import PerformanceBarsChart from '../charts/PerformanceBarsChart';

export default function Analytics() {
  const { refreshKey, fmt, fmtPct } = usePortfolio();

  const summary = useMemo(() => Portfolio.getPortfolioSummary(), [refreshKey]);
  const typeAlloc = useMemo(() => Portfolio.getAllocationByType(), [refreshKey]);

  return (
    <section>
      <div className="summary-grid">
        <div className="summary-card">
          <div className="card-label">Valor Total</div>
          <div className="card-value">{fmt(summary.totalCurrentValue)}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Ganancia / Pérdida</div>
          <div className="card-value">{fmt(summary.totalChange)}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Rendimiento</div>
          <div className="card-value">{fmtPct(summary.totalChangePercent)}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Total Activos</div>
          <div className="card-value">{summary.assetCount}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card full-width">
          <h3><IconTrendUp size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Evolución del Portafolio</h3>
          <div className="chart-container"><PortfolioLineChart /></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card full-width">
          <h3><IconBarChart size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Rendimiento por Activo</h3>
          <div className="chart-container"><PerformanceBarsChart /></div>
        </div>
      </div>

      <h3 className="section-title">Distribución por Tipo</h3>
      <div className="chart-card">
        {Object.keys(typeAlloc).length === 0 ? (
          <p className="text-muted">Sin datos</p>
        ) : (
          Object.entries(typeAlloc).map(([type, info]) => (
            <div key={type} className="type-dist-row">
              <div className="type-dist-info">
                <span className="type-dist-icon"><AssetTypeIcon type={type} size={20} /></span>
                <span className="type-dist-label">{info.label}</span>
                <span className="type-dist-count">({info.count})</span>
              </div>
              <div className="type-dist-bar-wrap">
                <div className="type-dist-bar" style={{ width: `${info.percent}%`, background: info.color }} />
              </div>
              <div className="type-dist-values">
                <span>{fmt(info.value)}</span>
                <span className="type-dist-pct">{info.percent.toFixed(1)}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
