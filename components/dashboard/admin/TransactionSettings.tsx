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

const TransactionSettings = () => {
    const { settings, updateSettings } = useSiteSettings();
    const { addNotification } = useNotification();
    const [localSettings, setLocalSettings] = useState(settings.systemSettings.transactions);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setLocalSettings(settings.systemSettings.transactions);
    }, [settings.systemSettings.transactions]);

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
                    transactions: localSettings 
                } 
            });
            addNotification("Les paramètres de transaction ont été mis à jour.", "success");
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
                        <h1 className="text-xl font-bold">Transactions et Frais</h1>
                        <p className="text-gray-500 mt-1">Définissez le modèle économique de la plateforme.</p>
                    </div>
                    <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                        Enregistrer
                    </Button>
                </div>
                <div className="space-y-6">
                    <SettingRow label="Frais de la plateforme (%)" description="Le pourcentage prélevé sur chaque projet financé avec succès.">
                        <input type="number" id="fee" value={localSettings.platformFeePercentage} onChange={(e) => handleNumericChange('platformFeePercentage', e.target.value)} className={inputClasses} />
                    </SettingRow>
                    <SettingRow label="Dépôt minimum (MAD)" description="Le montant minimum qu'un utilisateur peut déposer sur son portefeuille.">
                        <input type="number" id="minDeposit" value={localSettings.minDeposit} onChange={(e) => handleNumericChange('minDeposit', e.target.value)} className={inputClasses} />
                    </SettingRow>
                    <SettingRow label="Dépôt maximum (MAD)" description="Le montant maximum qu'un utilisateur peut déposer en une seule fois.">
                        <input type="number" id="maxDeposit" value={localSettings.maxDeposit} onChange={(e) => handleNumericChange('maxDeposit', e.target.value)} className={inputClasses} />
                    </SettingRow>
                    <SettingRow label="Répercuter les frais de transaction" description="Si activé, les frais de la passerelle de paiement sont ajoutés au montant du dépôt.">
                        <ToggleSwitch checked={localSettings.passFeesToUser} onChange={(val) => handleToggleChange('passFeesToUser', val)} />
                    </SettingRow>
                </div>
            </div>
        </Card>
    );
};

export default TransactionSettings;