'use client';

import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Storage from '@/lib/storage';

export default function RecordValueModal() {
  const { closeModal, handleRecordValue, recordAssetId } = usePortfolio();

  const asset = Storage.getAssetById(recordAssetId);
  const [type, setType] = useState('value');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  if (!asset) return null;

  const currentValue = Storage.getTransactionsByAsset(recordAssetId).slice(-1)[0]?.value || 0;

  const handleTypeChange = (newType) => {
    setType(newType);
    setAmount('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) return;

    if (type === 'value') {
      // Registrar nuevo valor actual, sin aporte
      handleRecordValue(recordAssetId, val, date, note.trim(), 0);
    } else if (type === 'contribution') {
      // Aporte a capital: el nuevo valor = valor actual + aporte
      const newValue = currentValue + val;
      handleRecordValue(recordAssetId, newValue, date, note.trim() || 'Aporte a capital', val);
    } else {
      // Retiro: el nuevo valor = valor actual - retiro (no menor a 0)
      const newValue = Math.max(0, currentValue - val);
      handleRecordValue(recordAssetId, newValue, date, note.trim() || 'Retiro de capital', -val);
    }
    closeModal();
  };

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Registrar Movimiento</h3>
          <button className="modal-close" onClick={closeModal}>&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
              <strong>{asset.name}</strong> · Valor actual: <strong>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(currentValue)}</strong>
            </p>
            <div className="form-group">
              <label>Tipo de registro</label>
              <select className="form-control" value={type} onChange={(e) => handleTypeChange(e.target.value)}>
                <option value="value">Actualizar valor actual</option>
                <option value="contribution">Aporte a capital</option>
                <option value="withdrawal">Retiro</option>
              </select>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                {type === 'value'
                  ? 'Registra el valor actual de tu inversión.'
                  : type === 'contribution'
                    ? 'Dinero nuevo que inyectas. No se contará como rendimiento.'
                    : 'Dinero que retiras. Se restará del capital invertido.'}
              </small>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{type === 'value' ? 'Nuevo valor' : type === 'contribution' ? 'Monto del aporte' : 'Monto del retiro'}</label>
                <input key={type} type="number" className="form-control" placeholder="0.00" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>
              <div className="form-group">
                <label>Nota (opcional)</label>
                <textarea className="form-control" placeholder={type === 'value' ? 'Ej: Dividendos recibidos...' : type === 'contribution' ? 'Ej: Compra adicional de acciones...' : 'Ej: Retiro parcial de la inversión...'} value={note} onChange={(e) => setNote(e.target.value)} />
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
