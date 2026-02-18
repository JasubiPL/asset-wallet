'use client';

import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import '@/lib/chartSetup';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import { IconPieChart } from '@/lib/icons';

export default function AllocationPieChart() {
  const { refreshKey, fmt } = usePortfolio();

  const summary = useMemo(() => Portfolio.getPortfolioSummary(), [refreshKey]);

  if (summary.assets.length === 0) {
    return <div className="chart-empty-msg"><span className="chart-empty-icon"><IconPieChart size={36} /></span><p>Sin activos registrados</p></div>;
  }

  const labels = summary.assets.map((a) => a.name);
  const values = summary.assets.map((a) => a.currentValue);
  const colors = summary.assets.map((a) => {
    const t = Portfolio.ASSET_TYPES[a.type];
    return t ? t.color : '#6b7280';
  });

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderColor: '#0d0d0e',
      borderWidth: 3,
      hoverBorderColor: '#18181b',
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#a1a1aa',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 14,
          font: { size: 12 },
          generateLabels: (chart) => {
            const d = chart.data;
            const total = d.datasets[0].data.reduce((s, v) => s + v, 0);
            return d.labels.map((label, i) => {
              const pct = total > 0 ? ((d.datasets[0].data[i] / total) * 100).toFixed(1) : 0;
              return { text: `${label} (${pct}%)`, fillStyle: d.datasets[0].backgroundColor[i], strokeStyle: d.datasets[0].backgroundColor[i], fontColor: '#a1a1aa', hidden: false, index: i, pointStyle: 'circle' };
            });
          },
        },
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#ffffff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((s, v) => s + v, 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return ` ${ctx.label}: ${fmt(ctx.parsed)} (${pct}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
