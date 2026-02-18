'use client';

import { useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { IconCheckCircle, IconXCircle, IconInfo } from '@/lib/icons';

export default function Notifications() {
  const { notifications, removeNotification } = usePortfolio();

  return (
    <div id="notifications">
      {notifications.map((n) => (
        <Toast key={n.id} notification={n} onRemove={removeNotification} />
      ))}
    </div>
  );
}

function Toast({ notification, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(notification.id), 3000);
    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const Icon = notification.type === 'success' ? IconCheckCircle : notification.type === 'error' ? IconXCircle : IconInfo;

  return (
    <div className={`toast toast-${notification.type} show`}>
      <span className="toast-icon"><Icon size={18} /></span>
      <span>{notification.message}</span>
    </div>
  );
}
