// mobile_app/components/NotificationBellMobile.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

const NotificationBellMobile = () => {
    const { unreadCount } = useNotification();

    return (
        <Link to="/mobile/notifications" className="relative p-2 text-neutral dark:text-text-dark">
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                    {unreadCount}
                </span>
            )}
        </Link>
    );
};

export default NotificationBellMobile;