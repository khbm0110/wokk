
import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotification();

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };
    
    useEffect(() => {
        if (isOpen) {
            // Mark all unread notifications as read when the dropdown opens
            notifications.forEach(notif => {
                if (!notif.read) {
                    markAsRead(notif.id);
                }
            });
        }
    }, [isOpen, notifications, markAsRead]);


    return (
        <div className="relative">
            <button onClick={handleToggle} className="relative text-neutral dark:text-text-dark hover:text-primary focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white text-xs">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-card-dark dark:border dark:border-border-dark rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2">
                        <div className="px-4 py-2 font-bold text-neutral dark:text-text-dark border-b dark:border-border-dark">Notifications</div>
                        <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(notif => (
                            <div key={notif.id} className={`flex items-start px-4 py-3 border-b dark:border-border-dark/50 hover:bg-gray-100 dark:hover:bg-gray-700 ${!notif.read ? 'bg-teal-50 dark:bg-primary/10' : ''}`}>
                                <div className={`w-2 h-2 rounded-full mr-3 mt-1 ${!notif.read ? 'bg-primary' : 'bg-transparent'}`}></div>
                                <div className="text-sm">
                                    <p className="text-gray-700 dark:text-gray-200">{notif.message}</p>
                                    <p className="text-gray-400 text-xs">
                                        {Math.round((new Date().getTime() - notif.createdAt.getTime()) / (1000 * 3600))}h ago
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Aucune notification pour le moment.</p>
                        )}
                        </div>
                         <a href="#" className="block bg-gray-50 dark:bg-card-dark/50 text-center text-primary text-sm py-2">Voir toutes les notifications</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;