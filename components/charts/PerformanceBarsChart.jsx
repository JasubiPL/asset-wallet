'use client';

import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import '@/lib/chartSetup';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import { IconBarChart } from '@/lib/icons';

export default function PerformanceBarsChart() {
  const { refreshKey } = usePortfolio();

  const summary = useMemo(() => Portfolio.getPortfolioSummary(), [refreshKey]);

  if (summary.assets.length === 0) {
    return <div className="chart-empty-msg"><span className="chart-empty-icon"><IconBarChart size={36} /></span><p>Sin datos de rendimiento</p></div>;
  }

  const sorted = [...summary.assets].sort((a, b) => b.changePercent - a.changePercent);
  const colors = sorted.map((a) => (a.changePercent >= 0 ? '#34d399' : '#f87171'));

  const data = {
    labels: sorted.map((a) => a.name),
    datasets: [{
      label: 'Rendimiento %',
      data: sorted.map((a) => a.changePercent),
      backgroundColor: colors.map((c) => c + '33'),
      borderColor: colors,
      borderWidth: 2,
      borderRadius: 6,
      barThickness: 28,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { labels: { color: '#a1a1aa', usePointStyle: true, padding: 16 } },
      tooltip: {
        backgroundColor: '#18181b', titleColor: '#ffffff', bodyColor: '#a1a1aa',
        borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, padding: 12, cornerRadius: 12,
        callbacks: { label: (ctx) => ` Rendimiento: ${ctx.parsed.x.toFixed(2)}%` },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#52525b', callback: (v) => v + '%' } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#52525b' } },
    },
  };

  return <Bar data={data} options={options} />;
}
