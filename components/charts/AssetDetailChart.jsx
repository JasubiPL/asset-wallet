'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import '@/lib/chartSetup';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import { IconBarChart } from '@/lib/icons';

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' });
}

export default function AssetDetailChart({ assetId }) {
  const { refreshKey, fmt } = usePortfolio();

  const perf = useMemo(() => Portfolio.getAssetPerformance(assetId), [assetId, refreshKey]);

  if (perf.history.length === 0) {
    return <div className="chart-empty-msg"><span className="chart-empty-icon"><IconBarChart size={36} /></span><p>Sin registros de valor</p></div>;
  }

  const isPositive = perf.change >= 0;
  const color = isPositive ? '#34d399' : '#f87171';
  const bgColor = isPositive ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)';

  const data = {
    labels: perf.history.map((h) => fmtDate(h.date)),
    datasets: [{
      label: 'Valor',
      data: perf.history.map((h) => h.value),
      borderColor: color,
      backgroundColor: bgColor,
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointRadius: 5,
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

  return <Line data={data} options={options} />;
}
