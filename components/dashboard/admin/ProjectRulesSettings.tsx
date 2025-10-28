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

const ProjectRulesSettings = () => {
    const { settings, updateSettings } = useSiteSettings();
    const { addNotification } = useNotification();
    const [localSettings, setLocalSettings] = useState(settings.systemSettings.projects);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setLocalSettings(settings.systemSettings.projects);
    }, [settings.systemSettings.projects]);

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
                    projects: localSettings 
                } 
            });
            addNotification("Les règles des projets ont été mises à jour.", "success");
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
                        <h1 className="text-xl font-bold">Règles des Projets</h1>
                        <p className="text-gray-500 mt-1">Établissez les règles qui gouvernent les campagnes de financement.</p>
                    </div>
                    <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                        Enregistrer
                    </Button>
                </div>
                <div className="space-y-6">
                    <SettingRow label="Durée de campagne par défaut (jours)" description="La durée standard pour une campagne de financement.">
                        <input type="number" id="campaignDuration" value={localSettings.defaultCampaignDurationDays} onChange={(e) => handleNumericChange('defaultCampaignDurationDays', e.target.value)} className={inputClasses} />
                    </SettingRow>
                    <SettingRow label="Objectif de financement minimum (MAD)" description="Le plus petit montant qu'un porteur de projet peut demander.">
                        <input type="number" id="minGoal" value={localSettings.minFundingGoal} onChange={(e) => handleNumericChange('minFundingGoal', e.target.value)} className={inputClasses} />
                    </SettingRow>
                    <SettingRow label="Objectif de financement maximum (MAD)" description="Le plus grand montant qu'un porteur de projet peut demander.">
                        <input type="number" id="maxGoal" value={localSettings.maxFundingGoal} onChange={(e) => handleNumericChange('maxFundingGoal', e.target.value)} className={inputClasses} />
                    </SettingRow>
                    <SettingRow label="Remboursement automatique si échec" description="Si activé, les fonds sont automatiquement remboursés aux investisseurs si un projet échoue.">
                        <ToggleSwitch checked={localSettings.autoRefundOnFailure} onChange={(val) => handleToggleChange('autoRefundOnFailure', val)} />
                    </SettingRow>
                </div>
            </div>
        </Card>
    );
};

export default ProjectRulesSettings;