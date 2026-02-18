'use client';

import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useAuth } from '@/context/AuthContext';
import { IconGlobe, IconDatabase, IconExport, IconImport, IconTrash } from '@/lib/icons';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

export default function Settings() {
  const { settings, handleSaveSettings, handleExport, handleImport, handleClearAll } = usePortfolio();
  const { logout } = useAuth();
  const [currency, setCurrency] = useState(settings.currency);
  const [locale, setLocale] = useState(settings.locale);

  const onSave = () => handleSaveSettings({ currency, locale });

  return (
    <section>
      <div className="settings-section">
        <h3><IconGlobe size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />Moneda y Región</h3>
        <p>Configura la moneda y formato de números para tu portafolio</p>
        <div className="form-row" style={{ maxWidth: 500 }}>
          <div className="form-group">
            <label>Moneda</label>
            <select className="form-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="MXN">MXN — Peso Mexicano</option>
              <option value="USD">USD — Dólar Americano</option>
              <option value="EUR">EUR — Euro</option>
              <option value="COP">COP — Peso Colombiano</option>
              <option value="ARS">ARS — Peso Argentino</option>
              <option value="CLP">CLP — Peso Chileno</option>
              <option value="PEN">PEN — Sol Peruano</option>
              <option value="BRL">BRL — Real Brasileño</option>
              <option value="GBP">GBP — Libra Esterlina</option>
            </select>
          </div>
          <div className="form-group">
            <label>Formato regional</label>
            <select className="form-control" value={locale} onChange={(e) => setLocale(e.target.value)}>
              <option value="es-MX">México</option>
              <option value="es-CO">Colombia</option>
              <option value="es-AR">Argentina</option>
              <option value="es-CL">Chile</option>
              <option value="es-PE">Perú</option>
              <option value="pt-BR">Brasil</option>
              <option value="en-US">Estados Unidos</option>
              <option value="en-GB">Reino Unido</option>
              <option value="de-DE">Alemania</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onSave}>Guardar Configuración</button>
      </div>

      <div className="settings-section">
        <h3><IconDatabase size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />Datos</h3>
        <p>Exporta, importa o elimina tus datos de portafolio</p>
        <div className="settings-actions">
          <button className="btn btn-secondary" onClick={handleExport}><IconExport size={16} /> Exportar Datos</button>
          <button className="btn btn-secondary" onClick={handleImport}><IconImport size={16} /> Importar Datos</button>
          <button className="btn btn-danger" onClick={handleClearAll}><IconTrash size={16} /> Eliminar Todo</button>
        </div>
      </div>

      <div className="settings-section">
        <h3><HiOutlineArrowRightOnRectangle size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />Sesión</h3>
        <p>Cerrar la sesión actual</p>
        <button className="btn btn-danger" onClick={logout}>
          <HiOutlineArrowRightOnRectangle size={16} /> Cerrar Sesión
        </button>
      </div>
    </section>
  );
}
