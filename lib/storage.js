/**
 * Storage — Persistencia con Supabase + cache en memoria
 *
 * Lecturas: síncronas desde cache (_assets, _transactions, _settings)
 * Escrituras: async → Supabase + actualización inmediata del cache
 */
import { supabase } from './supabase';

let _assets = [];
let _transactions = [];
let _settings = { currency: 'MXN', locale: 'es-MX' };
let _userId = null;
let _initialized = false;

// --- Mappers (Supabase snake_case → app camelCase) ---
function mapAsset(row) {
  return { id: row.id, name: row.name, type: row.type, createdAt: row.created_at, updatedAt: row.updated_at };
}

function mapTx(row) {
  return { id: row.id, assetId: row.asset_id, value: Number(row.value), capitalContribution: Number(row.capital_contribution || 0), date: row.date, note: row.note, createdAt: row.created_at };
}

// --- Init / Reload ---
export async function init(userId) {
  _userId = userId;
  await reload();
  _initialized = true;
}

export async function reload() {
  if (!_userId) return;
  const [a, t, s] = await Promise.all([
    supabase.from('assets').select('*').eq('user_id', _userId).order('created_at'),
    supabase.from('transactions').select('*').eq('user_id', _userId).order('created_at'),
    supabase.from('settings').select('*').eq('user_id', _userId).maybeSingle(),
  ]);
  _assets = (a.data || []).map(mapAsset);
  _transactions = (t.data || []).map(mapTx);
  if (s.data) _settings = { currency: s.data.currency, locale: s.data.locale };
}

export function isInitialized() { return _initialized; }

export function reset() {
  _assets = [];
  _transactions = [];
  _settings = { currency: 'MXN', locale: 'es-MX' };
  _userId = null;
  _initialized = false;
}

// ===================== SYNC READS =====================

export function getAssets() { return _assets; }

export function getAssetById(id) {
  return _assets.find((a) => a.id === id) || null;
}

export function getTransactions() { return _transactions; }

export function getTransactionsByAsset(assetId) {
  return _transactions
    .filter((t) => t.assetId === assetId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getSettings() { return _settings; }

// ===================== ASYNC WRITES =====================

// --- Assets ---
export async function addAsset(asset) {
  const { data, error } = await supabase
    .from('assets')
    .insert({ name: asset.name, type: asset.type, user_id: _userId })
    .select()
    .single();
  if (error) throw error;
  const mapped = mapAsset(data);
  _assets.push(mapped);
  return mapped;
}

export async function updateAsset(id, updates) {
  const { data, error } = await supabase
    .from('assets')
    .update({ name: updates.name, type: updates.type, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  const mapped = mapAsset(data);
  const idx = _assets.findIndex((a) => a.id === id);
  if (idx !== -1) _assets[idx] = mapped;
  return mapped;
}

export async function deleteAsset(id) {
  const { error } = await supabase.from('assets').delete().eq('id', id);
  if (error) throw error;
  _assets = _assets.filter((a) => a.id !== id);
  _transactions = _transactions.filter((t) => t.assetId !== id);
  return true;
}

// --- Transactions ---
export async function addTransaction(tx) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ asset_id: tx.assetId, user_id: _userId, value: tx.value, capital_contribution: tx.capitalContribution || 0, date: tx.date, note: tx.note || null })
    .select()
    .single();
  if (error) throw error;
  const mapped = mapTx(data);
  _transactions.push(mapped);
  return mapped;
}

export async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
  _transactions = _transactions.filter((t) => t.id !== id);
  return true;
}

export async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from('transactions')
    .update({ value: updates.value, capital_contribution: updates.capitalContribution || 0, date: updates.date, note: updates.note || null })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  const mapped = mapTx(data);
  const idx = _transactions.findIndex((t) => t.id === id);
  if (idx !== -1) _transactions[idx] = mapped;
  return mapped;
}

// --- Settings ---
export async function saveSettings(settings) {
  const { error } = await supabase
    .from('settings')
    .upsert({ user_id: _userId, currency: settings.currency, locale: settings.locale }, { onConflict: 'user_id' });
  if (error) throw error;
  _settings = { currency: settings.currency, locale: settings.locale };
  return true;
}

// --- Export / Import ---
export function exportAll() {
  return {
    assets: _assets,
    transactions: _transactions,
    settings: _settings,
    exportedAt: new Date().toISOString(),
  };
}

export async function importAll(data) {
  // Borrar datos existentes
  await supabase.from('transactions').delete().eq('user_id', _userId);
  await supabase.from('assets').delete().eq('user_id', _userId);

  if (data.assets && data.assets.length > 0) {
    const idMap = {};
    for (const asset of data.assets) {
      const { data: row } = await supabase
        .from('assets')
        .insert({ name: asset.name, type: asset.type, user_id: _userId })
        .select()
        .single();
      if (row) idMap[asset.id] = row.id;
    }

    if (data.transactions && data.transactions.length > 0) {
      const rows = data.transactions
        .filter((tx) => idMap[tx.assetId])
        .map((tx) => ({ asset_id: idMap[tx.assetId], user_id: _userId, value: tx.value, capital_contribution: tx.capitalContribution || 0, date: tx.date, note: tx.note || null }));
      if (rows.length > 0) await supabase.from('transactions').insert(rows);
    }
  }

  if (data.settings) await saveSettings(data.settings);
  await reload();
  return true;
}

export async function clearAll() {
  await supabase.from('transactions').delete().eq('user_id', _userId);
  await supabase.from('assets').delete().eq('user_id', _userId);
  await supabase.from('settings').delete().eq('user_id', _userId);
  _assets = [];
  _transactions = [];
  _settings = { currency: 'MXN', locale: 'es-MX' };
}
