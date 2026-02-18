'use client';

import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Storage from '@/lib/storage';

export default function RecordValueModal() {
  const { closeModal, handleRecordValue, recordAssetId } = usePortfolio();

  const asset = Storage.getAssetById(recordAssetId);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  if (!asset) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(value);
    if (isNaN(val) || val < 0) return;
    handleRecordValue(recordAssetId, val, date, note.trim());
    closeModal();
  };

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Registrar Valor</h3>
          <button className="modal-close" onClick={closeModal}>&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
              Registrar nuevo valor para: <strong>{asset.name}</strong>
            </p>
            <div className="form-row">
              <div className="form-group">
                <label>Nuevo valor</label>
                <input type="number" className="form-control" placeholder="0.00" step="0.01" min="0" value={value} onChange={(e) => setValue(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>Nota (opcional)</label>
              <textarea className="form-control" placeholder="Ej: Dividendos recibidos, compra adicional..." value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
