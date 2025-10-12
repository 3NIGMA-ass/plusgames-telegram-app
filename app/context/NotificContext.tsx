'use client';

export interface NotificationContextProps {
  showNotification: (
    title: string,
    type: 'success' | 'error' | 'info',
    message?: string,
  ) => void;
}

// Простая заглушка для контекста уведомлений
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useNotification = () => {
  return {
    showNotification: (title: string, type: 'success' | 'error' | 'info', message?: string) => {
      console.log(`Notification: ${title} - ${type} - ${message || ''}`);
    },
  };
};