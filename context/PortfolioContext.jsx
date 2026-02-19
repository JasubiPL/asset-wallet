'use client';

import { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import * as Storage from '@/lib/storage';
import * as Portfolio from '@/lib/portfolio';
import { useAuth } from '@/context/AuthContext';

const PortfolioContext = createContext(null);

const initialState = {
  view: 'dashboard',
  assetId: null,
  refreshKey: 0,
  notifications: [],
  modal: null,
  editAssetId: null,
  recordAssetId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, view: action.view, assetId: action.assetId || null };
    case 'REFRESH':
      return { ...state, refreshKey: state.refreshKey + 1 };
    case 'OPEN_MODAL':
      return { ...state, modal: action.modal, editAssetId: action.editAssetId || null, recordAssetId: action.recordAssetId || null, editTxId: action.editTxId || null };
    case 'CLOSE_MODAL':
      return { ...state, modal: null, editAssetId: null, recordAssetId: null, editTxId: null };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, { id: Date.now(), message: action.message, type: action.notifType }] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.id) };
    default:
      return state;
  }
}

export function PortfolioProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [settings, setSettings] = useState({ currency: 'MXN', locale: 'es-MX' });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Inicializar Storage desde Supabase cuando el usuario se autentica
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        await Storage.init(user.id);
        if (cancelled) return;
        setSettings(Storage.getSettings());
        setMounted(true);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const navigateTo = useCallback((view, assetId) => {
    dispatch({ type: 'NAVIGATE', view, assetId });
  }, []);

  const refresh = useCallback(() => {
    dispatch({ type: 'REFRESH' });
  }, []);

  const notify = useCallback((message, notifType = 'success') => {
    dispatch({ type: 'ADD_NOTIFICATION', message, notifType });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', id });
  }, []);

  const openModal = useCallback((modal, opts = {}) => {
    dispatch({ type: 'OPEN_MODAL', modal, ...opts });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  // --- Actions (async) ---
  const handleAddAsset = useCallback(async (name, type, value, date, note) => {
    try {
      const asset = await Storage.addAsset({ name, type });
      await Storage.addTransaction({ assetId: asset.id, value, date, note: note || 'Valor inicial' });
      refresh();
      notify('Activo agregado exitosamente');
    } catch (err) {
      notify('Error al agregar activo', 'error');
      console.error(err);
    }
  }, [refresh, notify]);

  const handleUpdateAsset = useCallback(async (id, name, type, value, date, note) => {
    try {
      await Storage.updateAsset(id, { name, type });
      await Storage.addTransaction({ assetId: id, value, date, note: note || 'Valor actualizado' });
      refresh();
      notify('Activo actualizado');
    } catch (err) {
      notify('Error al actualizar activo', 'error');
      console.error(err);
    }
  }, [refresh, notify]);

  const handleDeleteAsset = useCallback(async (id) => {
    const asset = Storage.getAssetById(id);
    if (!asset) return;
    if (window.confirm(`¿Eliminar "${asset.name}"? Se borrarán todos sus registros de valor.`)) {
      try {
        await Storage.deleteAsset(id);
        refresh();
        notify('Activo eliminado');
        if (state.view === 'asset-detail') navigateTo('assets');
      } catch (err) {
        notify('Error al eliminar activo', 'error');
        console.error(err);
      }
    }
  }, [refresh, notify, navigateTo, state.view]);

  const handleRecordValue = useCallback(async (assetId, value, date, note, capitalContribution = 0) => {
    try {
      await Storage.addTransaction({ assetId, value, date, note, capitalContribution });
      refresh();
      notify('Valor registrado');
    } catch (err) {
      notify('Error al registrar valor', 'error');
      console.error(err);
    }
  }, [refresh, notify]);

  const handleDeleteTransaction = useCallback(async (txId) => {
    if (window.confirm('¿Eliminar este registro de valor?')) {
      try {
        await Storage.deleteTransaction(txId);
        refresh();
        notify('Registro eliminado');
      } catch (err) {
        notify('Error al eliminar registro', 'error');
        console.error(err);
      }
    }
  }, [refresh, notify]);

  const handleUpdateTransaction = useCallback(async (txId, updates) => {
    try {
      await Storage.updateTransaction(txId, updates);
      refresh();
      notify('Registro actualizado');
    } catch (err) {
      notify('Error al actualizar registro', 'error');
      console.error(err);
    }
  }, [refresh, notify]);

  const handleSaveSettings = useCallback(async (newSettings) => {
    try {
      await Storage.saveSettings(newSettings);
      setSettings(newSettings);
      refresh();
      notify('Configuración guardada');
    } catch (err) {
      notify('Error al guardar configuración', 'error');
      console.error(err);
    }
  }, [refresh, notify]);

  const handleExport = useCallback(() => {
    const data = Storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset-wallet-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Datos exportados correctamente');
  }, [notify]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          await Storage.importAll(data);
          setSettings(Storage.getSettings());
          refresh();
          notify('Datos importados correctamente');
        } catch {
          notify('Error al importar datos', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [refresh, notify]);

  const handleClearAll = useCallback(async () => {
    if (window.confirm('¿Estás seguro de eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      try {
        await Storage.clearAll();
        setSettings({ currency: 'MXN', locale: 'es-MX' });
        refresh();
        notify('Datos eliminados');
        navigateTo('dashboard');
      } catch (err) {
        notify('Error al eliminar datos', 'error');
        console.error(err);
      }
    }
  }, [refresh, notify, navigateTo]);

  const fmt = useCallback((amount) => Portfolio.formatCurrency(amount, settings), [settings]);
  const fmtPct = useCallback((value) => Portfolio.formatPercent(value), []);

  const value = {
    ...state,
    settings,
    mounted,
    loading,
    navigateTo,
    refresh,
    notify,
    removeNotification,
    openModal,
    closeModal,
    handleAddAsset,
    handleUpdateAsset,
    handleDeleteAsset,
    handleRecordValue,
    handleDeleteTransaction,
    handleUpdateTransaction,
    handleSaveSettings,
    handleExport,
    handleImport,
    handleClearAll,
    fmt,
    fmtPct,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
