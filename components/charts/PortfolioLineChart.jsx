'use client';

import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import '@/lib/chartSetup';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import { IconBarChart } from '@/lib/icons';

const COLORS = ['#2563eb','#f59e0b','#22c55e','#ef4444','#a855f7','#06b6d4','#eab308','#ec4899','#14b8a6','#f43f5e'];

const RANGES = [
  { key: '1M', label: '1M', months: 1 },
  { key: '3M', label: '3M', months: 3 },
  { key: '6M', label: '6M', months: 6 },
  { key: '1Y', label: '1A', months: 12 },
  { key: '5Y', label: '5A', months: 60 },
  { key: 'ALL', label: 'Todo' },
];

function filterByRange(labels, datasetsData, rangeKey) {
  if (rangeKey === 'ALL' || labels.length === 0) return { labels, datasetsData };
  const range = RANGES.find((r) => r.key === rangeKey);
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - range.months);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  let startIdx = labels.findIndex((d) => d >= cutoffStr);
  if (startIdx === -1) startIdx = 0;
  return {
    labels: labels.slice(startIdx),
    datasetsData: datasetsData.map((d) => d.slice(startIdx)),
  };
}

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' });
}

export default function PortfolioLineChart() {
  const { refreshKey, fmt } = usePortfolio();
  const [range, setRange] = useState('ALL');

  const timeline = useMemo(() => Portfolio.getPortfolioTimeline(), [refreshKey]);

  const filtered = useMemo(() => {
    if (timeline.labels.length === 0) return timeline;
    const allData = [timeline.totals, ...timeline.assets.map((a) => timeline.assetTimelines[a.id])];
    const { labels, datasetsData } = filterByRange(timeline.labels, allData, range);
    return { labels, totals: datasetsData[0], assets: timeline.assets, assetTimelines: Object.fromEntries(timeline.assets.map((a, i) => [a.id, datasetsData[i + 1]])) };
  }, [timeline, range]);

  if (timeline.labels.length === 0) {
    return <div className="chart-empty-msg"><span className="chart-empty-icon"><IconBarChart size={36} /></span><p>Agrega activos y registra valores para ver la gráfica</p></div>;
  }

  const datasets = [
    {
      label: 'Portafolio Total',
      data: filtered.totals,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointRadius: filtered.labels.length > 30 ? 0 : 4,
      pointBackgroundColor: '#2563eb',
      pointBorderColor: '#0d0d0e',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
    },
    ...filtered.assets.map((asset, i) => ({
      label: asset.name,
      data: filtered.assetTimelines[asset.id],
      borderColor: COLORS[i % COLORS.length],
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [5, 5],
      tension: 0.3,
      pointRadius: filtered.labels.length > 30 ? 0 : 3,
      pointBackgroundColor: COLORS[i % COLORS.length],
      hidden: filtered.assets.length > 5,
    })),
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#a1a1aa', usePointStyle: true, padding: 16, font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#ffffff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}` },
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
        <Line data={{ labels: filtered.labels.map(fmtDate), datasets }} options={options} />
      </div>
    </div>
  );
}
