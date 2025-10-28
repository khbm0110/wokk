// components/dashboard/admin/NotificationSettings.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { useNotification } from '../../../context/NotificationContext';
import ToggleSwitch from '../../ui/ToggleSwitch';

const NotificationItem: React.FC<{
    title: string;
    description: string;
    isEnabled: boolean;
    onToggle: (isEnabled: boolean) => void;
}> = ({ title, description, isEnabled, onToggle }) => (
    <div className="p-4 border rounded-lg flex justify-between items-center bg-gray-50 dark:bg-card-dark/50">
        <div>
            <h3 className="font-semibold text-text-light dark:text-text-dark">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ToggleSwitch checked={isEnabled} onChange={onToggle} />
    </div>
);

const NotificationSettings = () => {
    const { settings, updateSettings } = useSiteSettings();
    const { addNotification } = useNotification();
    const [localNotifications, setLocalNotifications] = useState(settings.notifications);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setLocalNotifications(settings.notifications);
    }, [settings.notifications]);

    const handleToggle = useCallback((section: 'user' | 'admin', key: string, value: boolean) => {
        setLocalNotifications(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    }, []);
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings({ notifications: localNotifications });
            addNotification("Les paramètres de notification ont été mis à jour.", "success");
        } catch (error) {
            addNotification("Une erreur est survenue lors de la sauvegarde.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Paramètres de Notification</h2>
                        <p className="text-gray-500 mt-1">Gérez les e-mails automatiques envoyés par la plateforme.</p>
                    </div>
                    <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                        Enregistrer les modifications
                    </Button>
                </div>

                {/* User Notifications Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Notifications aux Utilisateurs</h3>
                    <div className="space-y-3">
                        <NotificationItem
                            title="Approbation de Projet"
                            description="Envoyer un e-mail au porteur de projet lorsque son projet est approuvé."
                            isEnabled={localNotifications.user.onProjectApproved}
                            onToggle={(val) => handleToggle('user', 'onProjectApproved', val)}
                        />
                        <NotificationItem
                            title="Rejet de Compte (KYC)"
                            description="Informer l'utilisateur lorsque sa vérification d'identité a été rejetée."
                            isEnabled={localNotifications.user.onKycRejected}
                            onToggle={(val) => handleToggle('user', 'onKycRejected', val)}
                        />
                        <NotificationItem
                            title="Nouvel Investissement"
                            description="Notifier le porteur de projet à chaque fois qu'il reçoit un nouvel investissement."
                            isEnabled={localNotifications.user.onNewInvestment}
                            onToggle={(val) => handleToggle('user', 'onNewInvestment', val)}
                        />
                    </div>
                </div>

                {/* Admin Notifications Section */}
                 <div className="space-y-4 pt-6 border-t border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-bold">Notifications aux Administrateurs</h3>
                     <div className="space-y-3">
                        <NotificationItem
                            title="Nouveau Projet Soumis"
                            description="Alerter les administrateurs lorsqu'un nouveau projet est en attente de validation."
                            isEnabled={localNotifications.admin.onNewProjectPending}
                            onToggle={(val) => handleToggle('admin', 'onNewProjectPending', val)}
                        />
                        <NotificationItem
                            title="Nouvel Utilisateur Inscrit"
                            description="Alerter les administrateurs lorsqu'un nouvel utilisateur s'inscrit et est en attente de KYC."
                            isEnabled={localNotifications.admin.onNewUserRegistered}
                            onToggle={(val) => handleToggle('admin', 'onNewUserRegistered', val)}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default NotificationSettings;