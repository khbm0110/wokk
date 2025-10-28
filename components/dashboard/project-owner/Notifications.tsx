

import React from 'react';
import Card from '../../ui/Card';
import { useNotification, AppNotification } from '../../../context/NotificationContext';
import Button from '../../ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

const NotificationIcon = ({ type }: { type: AppNotification['type'] }) => {
    const baseClass = "h-8 w-8 rounded-full flex items-center justify-center mr-4 text-white";
    if (type === 'success') {
        return <div className={`${baseClass} bg-green-500`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
    }
    if (type === 'error') {
        return <div className={`${baseClass} bg-red-500`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
    }
    return <div className={`${baseClass} bg-blue-500`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
}


const Notifications = () => {
    const { notifications, markAsRead, unreadCount } = useNotification();
    const { t } = useLanguage();
    
    const handleMarkAsRead = (id: number) => {
        markAsRead(id);
    }
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t('poDashboard.notifications.title', { count: unreadCount })}</h2>
                <Button variant="ghost" size="sm">{t('poDashboard.notifications.markAllAsRead')}</Button>
            </div>
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} className={`p-4 rounded-lg flex items-start ${!notif.read ? 'bg-teal-50' : 'bg-gray-50'}`}>
                            <NotificationIcon type={notif.type} />
                            <div className="flex-grow">
                                <p className="text-gray-800">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(notif.createdAt)}
                                </p>
                            </div>
                            {!notif.read && (
                                 <button onClick={() => handleMarkAsRead(notif.id)} className="text-xs text-primary hover:underline ml-4 flex-shrink-0">{t('poDashboard.notifications.markAsRead')}</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('poDashboard.notifications.none')}</p>
                )}
            </div>
        </Card>
    );
};

export default Notifications;