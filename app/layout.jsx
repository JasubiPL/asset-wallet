import './globals.css';

export const metadata = {
  title: 'Asset Wallet — Portafolio de Activos',
  description: 'Registra, analiza y visualiza el rendimiento de tu portafolio de activos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
