'use client';

import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import * as Storage from '@/lib/storage';

export default function EditTransactionModal() {
  const { closeModal, handleUpdateTransaction, editTxId } = usePortfolio();

  const tx = Storage.getTransactions().find((t) => t.id === editTxId);
  const isContribution = tx && (tx.capitalContribution || 0) > 0;

  const [type, setType] = useState(isContribution ? 'contribution' : 'value');
  const [amount, setAmount] = useState(tx ? String(isContribution ? tx.capitalContribution : tx.value) : '');
  const [date, setDate] = useState(tx ? tx.date : new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(tx ? tx.note || '' : '');

  if (!tx) return null;

  // Para aportes necesitamos saber el valor anterior para recalcular
  const txs = Storage.getTransactionsByAsset(tx.assetId);
  const txIndex = txs.findIndex((t) => t.id === tx.id);
  const prevValue = txIndex > 0 ? txs[txIndex - 1].value : 0;

  const handleTypeChange = (newType) => {
    setType(newType);
    setAmount('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) return;

    if (type === 'value') {
      handleUpdateTransaction(editTxId, { value: val, capitalContribution: 0, date, note: note.trim() });
    } else {
      // Aporte: el valor total = valor anterior + aporte
      const newValue = prevValue + val;
      handleUpdateTransaction(editTxId, { value: newValue, capitalContribution: val, date, note: note.trim() || 'Aporte a capital' });
    }
    closeModal();
  };

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Editar Registro</h3>
          <button className="modal-close" onClick={closeModal}>&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Tipo de registro</label>
              <select className="form-control" value={type} onChange={(e) => handleTypeChange(e.target.value)}>
                <option value="value">Actualizar valor actual</option>
                <option value="contribution">Aporte a capital</option>
              </select>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                {type === 'value'
                  ? 'Registra el valor actual de tu inversión.'
                  : 'Dinero nuevo que inyectaste. No se contará como rendimiento.'}
              </small>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{type === 'value' ? 'Valor' : 'Monto del aporte'}</label>
                <input key={type} type="number" className="form-control" placeholder="0.00" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>Nota (opcional)</label>
              <textarea className="form-control" placeholder={type === 'value' ? 'Ej: Dividendos recibidos...' : 'Ej: Compra adicional...'} value={note} onChange={(e) => setNote(e.target.value)} />
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
