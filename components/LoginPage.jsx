'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppLogo, IconXCircle } from '@/lib/icons';
import { HiOutlineLockClosed, HiOutlineEnvelope, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function LoginPage() {
  const { login, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (isRegister) {
        const result = await signUp(email.trim(), password);
        if (!result.success) {
          setError(result.message || 'Error al crear cuenta');
        } else if (result.message) {
          setInfo(result.message);
        }
      } else {
        const result = await login(email.trim(), password);
        if (!result.success) {
          setError(result.message || 'Credenciales incorrectas');
        }
      }
    } catch {
      setError('Error de conexión');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <AppLogo />
          <span className="login-logo-text">Asset Wallet</span>
        </div>
        <p className="login-subtitle">
          {isRegister ? 'Crea tu cuenta para comenzar' : 'Inicia sesión para acceder a tu portafolio'}
        </p>

        {error && (
          <div className="login-error">
            <IconXCircle size={16} />
            {error}
          </div>
        )}

        {info && (
          <div className="login-info">
            {info}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label><HiOutlineEnvelope size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label><HiOutlineLockClosed size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Contraseña</label>
            <div className="input-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={6}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="login-toggle">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button type="button" className="login-toggle-btn" onClick={() => { setIsRegister(!isRegister); setError(''); setInfo(''); }}>
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>

        <p className="login-footer">Asset Wallet v1.0.0 · Powered by <a className="author-link" href="https://jasubip.vercel.app" target="_blank" rel="noopener noreferrer">JasubiP</a></p>
      </div>
    </div>
  );
}
