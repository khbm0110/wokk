// mobile_app/screens/MobileNotificationsScreen.tsx
import React, { useEffect } from 'react';
import { useNotification, AppNotification } from '../../context/NotificationContext';

const NotificationIcon = ({ type }: { type: AppNotification['type'] }) => {
    const baseClass = "size-10 rounded-full flex items-center justify-center mr-3 text-white flex-shrink-0";
    if (type === 'success') {
        return <div className={`${baseClass} bg-green-500`}><span className="material-symbols-outlined">check_circle</span></div>
    }
    if (type === 'error') {
        return <div className={`${baseClass} bg-red-500`}><span className="material-symbols-outlined">error</span></div>
    }
    return <div className={`${baseClass} bg-blue-500`}><span className="material-symbols-outlined">info</span></div>
}

const MobileNotificationsScreen = () => {
    const { notifications, markAsRead } = useNotification();

    useEffect(() => {
        // Mark all as read when component mounts
        notifications.forEach(notif => {
            if (!notif.read) {
                markAsRead(notif.id);
            }
        });
    }, [notifications, markAsRead]);

    return (
        <div className="p-4 space-y-3">
             {notifications.length > 0 ? (
                notifications.map(notif => (
                    <div key={notif.id} className="p-3 rounded-lg flex items-start bg-white dark:bg-card-dark shadow-sm">
                        <NotificationIcon type={notif.type} />
                        <div className="flex-grow">
                            <p className="text-gray-800 dark:text-gray-200 text-sm">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(notif.createdAt)}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-10">Aucune notification pour le moment.</p>
            )}
        </div>
    );
};

export default MobileNotificationsScreen;