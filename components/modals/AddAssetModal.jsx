'use client';

import { useState, useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Portfolio from '@/lib/portfolio';
import * as Storage from '@/lib/storage';
import { ASSET_TYPE_ICONS } from '@/lib/icons';

export default function AddAssetModal() {
  const { closeModal, handleAddAsset, handleUpdateAsset, editAssetId } = usePortfolio();

  const isEdit = !!editAssetId;
  const existingAsset = isEdit ? Storage.getAssetById(editAssetId) : null;

  const [name, setName] = useState('');
  const [type, setType] = useState('stock');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  useEffect(() => {
    if (existingAsset) {
      setName(existingAsset.name);
      setType(existingAsset.type);
      setValue(Portfolio.getCurrentValue(editAssetId));
    }
  }, [existingAsset, editAssetId]);

  const onSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(value);
    if (!name.trim() || isNaN(val) || val < 0) return;

    if (isEdit) {
      handleUpdateAsset(editAssetId, name.trim(), type, val, date, note.trim());
    } else {
      handleAddAsset(name.trim(), type, val, date, note.trim());
    }
    closeModal();
  };

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? 'Editar Activo' : 'Agregar Activo'}</h3>
          <button className="modal-close" onClick={closeModal}>&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Nombre del activo</label>
              <input type="text" className="form-control" placeholder="Ej: Apple (AAPL), Bitcoin, CETES..." value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tipo de activo</label>
              <select className="form-control" value={type} onChange={(e) => setType(e.target.value)} required>
                {Object.entries(Portfolio.ASSET_TYPES).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Valor actual</label>
                <input type="number" className="form-control" placeholder="0.00" step="0.01" min="0" value={value} onChange={(e) => setValue(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>Nota (opcional)</label>
              <textarea className="form-control" placeholder="Descripción o notas..." value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
