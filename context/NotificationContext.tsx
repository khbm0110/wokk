
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export interface AppNotification {
    id: number;
    message: string;
    type: 'success' | 'info' | 'error';
    read: boolean;
    createdAt: Date;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (message: string, type?: AppNotification['type']) => void;
    markAsRead: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: AppNotification[] = [
    { id: 1, message: "Votre projet 'Restaurant de Fusion à Casablanca' a été approuvé et est maintenant en ligne !", type: 'success', read: false, createdAt: new Date(Date.now() - 3600000 * 2) },
    { id: 2, message: "L'administrateur a demandé une modification sur votre projet 'Concept Store Artisanal'. Veuillez consulter vos emails.", type: 'error', read: false, createdAt: new Date(Date.now() - 3600000 * 5) },
    { id: 3, message: "Félicitations ! Votre projet a atteint 50% de son objectif de financement.", type: 'info', read: true, createdAt: new Date(Date.now() - 3600000 * 24) },
    { id: 4, message: "Votre vérification KYC a été validée avec succès.", type: 'success', read: true, createdAt: new Date(Date.now() - 3600000 * 48) },
];


// FIX: Changed to React.FC to solve child prop type inference errors.
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
    
    const addNotification = useCallback((message: string, type: AppNotification['type'] = 'info') => {
        const newNotification: AppNotification = {
            id: Date.now(),
            message,
            type,
            read: false,
            createdAt: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = (id: number) => {
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};