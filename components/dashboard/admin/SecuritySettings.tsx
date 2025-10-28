import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { useNotification } from '../../../context/NotificationContext';

const SettingRow: React.FC<{ label: string; description: string; children: React.ReactNode }> = ({ label, description, children }) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-card-dark/50">
        <div className="flex-1">
            <h3 className="font-semibold text-text-light dark:text-text-dark">{label}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto sm:max-w-xs">{children}</div>
    </div>
);

const SecuritySettings = () => {
    const { settings, updateSettings } = useSiteSettings();
    const { addNotification } = useNotification();
    const [localSettings, setLocalSettings] = useState(settings.systemSettings.security);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setLocalSettings(settings.systemSettings.security);
    }, [settings.systemSettings.security]);

    const handleNumericChange = useCallback((key: keyof typeof localSettings, value: string) => {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        if (!isNaN(numValue)) {
            setLocalSettings(prev => ({ ...prev, [key]: numValue }));
        }
    }, []);

    const handleToggleChange = useCallback((key: keyof typeof localSettings, value: boolean) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    }, []);
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings({ 
                systemSettings: { 
                    ...settings.systemSettings, 
                    security: localSettings 
                } 
            });
            addNotification("Les paramètres de sécurité ont été mis à jour.", "success");
        } catch (error) {
            addNotification("Une erreur est survenue lors de la sauvegarde.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = "appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-card-dark dark:text-text-dark focus:ring-primary focus:border-primary rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none sm:text-sm";

    return (
        <Card>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <h1 className="text-xl font-bold">Sécurité</h1>
                        <p className="text-gray-500 mt-1">Configurez les politiques de sécurité pour tous les utilisateurs.</p>
                    </div>
                    <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                        Enregistrer
                    </Button>
                </div>
                <div className="space-y-6">
                    <SettingRow label="Longueur minimale du mot de passe" description="Le nombre minimum de caractères pour les mots de passe.">
                        <input type="number" id="passwordMinLength" value={localSettings.passwordMinLength} onChange={(e) => handleNumericChange('passwordMinLength', e.target.value)} className={inputClasses} />
                    </SettingRow>
                    <SettingRow label="Exiger un chiffre" description="Les mots de passe doivent contenir au moins un chiffre (0-9).">
                        <ToggleSwitch checked={localSettings.passwordRequiresNumber} onChange={(val) => handleToggleChange('passwordRequiresNumber', val)} />
                    </SettingRow>
                    <SettingRow label="Exiger un symbole" description="Les mots de passe doivent contenir au moins un symbole (ex: @, #, $).">
                        <ToggleSwitch checked={localSettings.passwordRequiresSymbol} onChange={(val) => handleToggleChange('passwordRequiresSymbol', val)} />
                    </SettingRow>
                    <SettingRow label="Durée de la session (minutes)" description="Temps d'inactivité avant qu'un utilisateur ne soit déconnecté automatiquement.">
                        <input type="number" id="sessionDuration" value={localSettings.sessionDurationMinutes} onChange={(e) => handleNumericChange('sessionDurationMinutes', e.target.value)} className={inputClasses} />
                    </SettingRow>
                    <SettingRow label="Activer l'authentification à 2 facteurs (2FA)" description="Permettre aux utilisateurs de sécuriser leur compte avec une deuxième étape de vérification.">
                        <ToggleSwitch checked={localSettings.twoFactorAuthEnabled} onChange={(val) => handleToggleChange('twoFactorAuthEnabled', val)} />
                    </SettingRow>
                </div>
            </div>
        </Card>
    );
};

export default SecuritySettings;