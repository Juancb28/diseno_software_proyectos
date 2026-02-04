import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  fecha: string;
  leida: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'fecha' | 'leida'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    titulo: 'Avance Pendiente de Revisión',
    mensaje: 'El proyecto "Sistema de Gestión Académica" tiene un avance del semestre 2025-2 pendiente de revisión',
    tipo: 'WARNING',
    fecha: '2026-02-03T10:30:00',
    leida: false,
    link: '/proyectos/1'
  },
  {
    id: 2,
    titulo: 'Ausencia Aprobada',
    mensaje: 'Tu solicitud de ausencia para el 10/02/2026 ha sido aprobada',
    tipo: 'SUCCESS',
    fecha: '2026-02-02T15:20:00',
    leida: false
  },
  {
    id: 3,
    titulo: 'Contrato Pendiente',
    mensaje: 'Recuerda subir tu contrato firmado',
    tipo: 'INFO',
    fecha: '2026-02-01T09:00:00',
    leida: true
  },
  {
    id: 4,
    titulo: 'Avance Rechazado',
    mensaje: 'El avance del semestre 2025-1 requiere correcciones. Revisa las observaciones',
    tipo: 'ERROR',
    fecha: '2026-01-31T14:45:00',
    leida: true,
    link: '/proyectos/1'
  }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.leida).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, leida: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, leida: true })));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'fecha' | 'leida'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.max(...notifications.map(n => n.id), 0) + 1,
      fecha: new Date().toISOString(),
      leida: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications debe usarse dentro de un NotificationProvider');
  }
  return context;
}
