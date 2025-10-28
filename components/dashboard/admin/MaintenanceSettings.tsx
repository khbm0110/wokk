import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { useNotification } from '../../../context/NotificationContext';
import ToggleSwitch from '../../ui/ToggleSwitch';

const MaintenanceSettings = () => {
    const { settings, updateSettings } = useSiteSettings();
    const { addNotification } = useNotification();
    const [isEnabled, setIsEnabled] = useState(settings.maintenanceModeEnabled);
    const [message, setMessage] = useState(settings.maintenanceModeMessage);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setIsEnabled(settings.maintenanceModeEnabled);
        setMessage(settings.maintenanceModeMessage);
    }, [settings]);
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings({
                maintenanceModeEnabled: isEnabled,
                maintenanceModeMessage: message
            });
            addNotification("Les paramètres du mode maintenance ont été mis à jour.", "success");
        } catch (error) {
            addNotification("Une erreur est survenue lors de la sauvegarde.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold">Mode Maintenance</h2>
                    <p className="text-gray-500 mt-1">Activez ce mode pour mettre votre site hors ligne temporairement. Seuls les administrateurs connectés pourront y accéder.</p>
                </div>
                
                <div className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-text-light dark:text-text-dark">Activer le mode maintenance</h3>
                        <p className="text-sm text-gray-500">Lorsque ce mode est activé, les visiteurs verront la page de maintenance.</p>
                    </div>
                    <ToggleSwitch checked={isEnabled} onChange={setIsEnabled} />
                </div>

                {isEnabled && (
                    <div className="space-y-2 animate-fade-in">
                        <label htmlFor="maintenance-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message de maintenance</label>
                        <textarea
                            id="maintenance-message"
                            rows={5}
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm p-3 focus:ring-primary focus:border-primary"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Ce message sera affiché aux visiteurs pendant la maintenance.</p>
                    </div>
                )}
                
                <div className="flex justify-end pt-4 border-t border-border-light dark:border-border-dark">
                    <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                        Enregistrer les modifications
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default MaintenanceSettings;