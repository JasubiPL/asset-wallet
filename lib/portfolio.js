/**
 * Portfolio — Lógica de negocio: cálculos de rendimiento y métricas
 */
import * as Storage from './storage';

export const ASSET_TYPES = {
  stock:      { label: 'Acciones',       icon: '📈', color: '#2563eb' },
  crypto:     { label: 'Criptomonedas',  icon: '₿',  color: '#f59e0b' },
  bond:       { label: 'Bonos',          icon: '🏦', color: '#22c55e' },
  realestate: { label: 'Bienes Raíces',  icon: '🏠', color: '#ef4444' },
  fund:       { label: 'Fondos',         icon: '💼', color: '#a855f7' },
  savings:    { label: 'Ahorro',         icon: '🏧', color: '#06b6d4' },
  commodity:  { label: 'Commodities',    icon: '🥇', color: '#eab308' },
  other:      { label: 'Otro',           icon: '📦', color: '#6b7280' },
};

export function getCurrentValue(assetId) {
  const txs = Storage.getTransactionsByAsset(assetId);
  return txs.length === 0 ? 0 : txs[txs.length - 1].value;
}

export function getAssetPerformance(assetId) {
  const txs = Storage.getTransactionsByAsset(assetId);
  if (txs.length < 1) {
    return { currentValue: 0, initialValue: 0, totalInvested: 0, totalContributions: 0, change: 0, changePercent: 0, history: [] };
  }
  const initialValue = txs[0].value;
  const currentValue = txs[txs.length - 1].value;
  // Total invertido = valor inicial + aportes a capital posteriores (se excluye el primero porque su value YA es la inversión inicial)
  const totalContributions = txs.slice(1).reduce((sum, t) => sum + (t.capitalContribution || 0), 0);
  const totalInvested = initialValue + totalContributions;
  const change = currentValue - totalInvested;
  const changePercent = totalInvested !== 0 ? (change / totalInvested) * 100 : 0;
  return {
    currentValue, initialValue, totalInvested, totalContributions, change, changePercent,
    history: txs.map((t) => ({ date: t.date, value: t.value, capitalContribution: t.capitalContribution || 0, note: t.note, id: t.id })),
  };
}

export function getPortfolioSummary() {
  const assets = Storage.getAssets();
  let totalCurrentValue = 0;
  let totalInitialValue = 0;
  let totalInvested = 0;
  const assetDetails = [];

  assets.forEach((asset) => {
    const perf = getAssetPerformance(asset.id);
    totalCurrentValue += perf.currentValue;
    totalInitialValue += perf.initialValue;
    totalInvested += perf.totalInvested;
    assetDetails.push({ ...asset, ...perf, allocation: 0 });
  });

  assetDetails.forEach((a) => {
    a.allocation = totalCurrentValue > 0 ? (a.currentValue / totalCurrentValue) * 100 : 0;
  });

  const totalChange = totalCurrentValue - totalInvested;
  const totalChangePercent = totalInvested !== 0 ? (totalChange / totalInvested) * 100 : 0;

  return { totalCurrentValue, totalInitialValue, totalInvested, totalChange, totalChangePercent, assetCount: assets.length, assets: assetDetails };
}

export function getPortfolioTimeline() {
  const assets = Storage.getAssets();
  const allDatesMap = new Map();

  assets.forEach((asset) => {
    const txs = Storage.getTransactionsByAsset(asset.id);
    txs.forEach((tx) => {
      if (!allDatesMap.has(tx.date)) allDatesMap.set(tx.date, {});
      allDatesMap.get(tx.date)[asset.id] = tx.value;
    });
  });

  const sortedDates = [...allDatesMap.keys()].sort();
  if (sortedDates.length === 0) return { labels: [], datasets: [], totals: [] };

  const currentValues = {};
  assets.forEach((a) => { currentValues[a.id] = 0; });
  const totals = [];
  const assetTimelines = {};
  assets.forEach((a) => { assetTimelines[a.id] = []; });

  sortedDates.forEach((date) => {
    const updates = allDatesMap.get(date);
    Object.keys(updates).forEach((id) => { currentValues[id] = updates[id]; });
    let total = 0;
    assets.forEach((a) => {
      const val = currentValues[a.id] || 0;
      assetTimelines[a.id].push(val);
      total += val;
    });
    totals.push(total);
  });

  return { labels: sortedDates, totals, assetTimelines, assets };
}

export function getAllocationByType() {
  const assets = Storage.getAssets();
  const typeMap = {};
  assets.forEach((asset) => {
    const val = getCurrentValue(asset.id);
    const type = asset.type || 'other';
    if (!typeMap[type]) typeMap[type] = { value: 0, count: 0, ...ASSET_TYPES[type] };
    typeMap[type].value += val;
    typeMap[type].count += 1;
  });
  const total = Object.values(typeMap).reduce((s, t) => s + t.value, 0);
  Object.values(typeMap).forEach((t) => {
    t.percent = total > 0 ? (t.value / total) * 100 : 0;
  });
  return typeMap;
}

export function formatCurrency(amount, settings) {
  const s = settings || Storage.getSettings();
  return new Intl.NumberFormat(s.locale, { style: 'currency', currency: s.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

export function formatPercent(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
