'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PortfolioProvider } from '@/context/PortfolioContext';
import AppShell from '@/components/AppShell';
import LoginPage from '@/components/LoginPage';

function AppGate() {
  const { isAuthenticated, checking } = useAuth();

  if (checking) return null;

  if (!isAuthenticated) return <LoginPage />;

  return (
    <PortfolioProvider>
      <AppShell />
    </PortfolioProvider>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}
