'use client';

import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import '@/lib/chartSetup';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import { IconBarChart } from '@/lib/icons';

const RANGES = [
  { key: '1M', label: '1M', months: 1 },
  { key: '3M', label: '3M', months: 3 },
  { key: '6M', label: '6M', months: 6 },
  { key: '1Y', label: '1A', months: 12 },
  { key: '5Y', label: '5A', months: 60 },
  { key: 'ALL', label: 'Todo' },
];

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' });
}

export default function AssetDetailChart({ assetId }) {
  const { refreshKey, fmt } = usePortfolio();
  const [range, setRange] = useState('ALL');

  const perf = useMemo(() => Portfolio.getAssetPerformance(assetId), [assetId, refreshKey]);

  const filtered = useMemo(() => {
    if (perf.history.length === 0) return perf.history;
    if (range === 'ALL') return perf.history;
    const r = RANGES.find((x) => x.key === range);
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - r.months);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const result = perf.history.filter((h) => h.date >= cutoffStr);
    return result.length > 0 ? result : perf.history;
  }, [perf, range]);

  if (perf.history.length === 0) {
    return <div className="chart-empty-msg"><span className="chart-empty-icon"><IconBarChart size={36} /></span><p>Sin registros de valor</p></div>;
  }

  const isPositive = perf.change >= 0;
  const color = isPositive ? '#34d399' : '#f87171';
  const bgColor = isPositive ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)';

  const data = {
    labels: filtered.map((h) => fmtDate(h.date)),
    datasets: [{
      label: 'Valor',
      data: filtered.map((h) => h.value),
      borderColor: color,
      backgroundColor: bgColor,
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointRadius: filtered.length > 30 ? 0 : 5,
      pointBackgroundColor: color,
      pointBorderColor: '#0d0d0e',
      pointBorderWidth: 2,
      pointHoverRadius: 7,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#a1a1aa', usePointStyle: true, padding: 16 } },
      tooltip: {
        backgroundColor: '#18181b', titleColor: '#ffffff', bodyColor: '#a1a1aa',
        borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, padding: 12, cornerRadius: 12,
        callbacks: { label: (ctx) => ` Valor: ${fmt(ctx.parsed.y)}` },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#52525b', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#52525b', font: { size: 10 }, callback: (v) => fmt(v) } },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="chart-range-selector">
        {RANGES.map((r) => (
          <button key={r.key} className={`chart-range-pill${range === r.key ? ' active' : ''}`} onClick={() => setRange(r.key)}>{r.label}</button>
        ))}
      </div>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
