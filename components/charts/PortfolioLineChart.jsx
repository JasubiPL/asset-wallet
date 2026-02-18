'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import '@/lib/chartSetup';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import { IconBarChart } from '@/lib/icons';

const COLORS = ['#2563eb','#f59e0b','#22c55e','#ef4444','#a855f7','#06b6d4','#eab308','#ec4899','#14b8a6','#f43f5e'];

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' });
}

export default function PortfolioLineChart() {
  const { refreshKey, fmt } = usePortfolio();

  const timeline = useMemo(() => Portfolio.getPortfolioTimeline(), [refreshKey]);

  if (timeline.labels.length === 0) {
    return <div className="chart-empty-msg"><span className="chart-empty-icon"><IconBarChart size={36} /></span><p>Agrega activos y registra valores para ver la gráfica</p></div>;
  }

  const datasets = [
    {
      label: 'Portafolio Total',
      data: timeline.totals,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: '#2563eb',
      pointBorderColor: '#0d0d0e',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
    },
    ...timeline.assets.map((asset, i) => ({
      label: asset.name,
      data: timeline.assetTimelines[asset.id],
      borderColor: COLORS[i % COLORS.length],
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [5, 5],
      tension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: COLORS[i % COLORS.length],
      hidden: timeline.assets.length > 5,
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

  return <Line data={{ labels: timeline.labels.map(fmtDate), datasets }} options={options} />;
}
