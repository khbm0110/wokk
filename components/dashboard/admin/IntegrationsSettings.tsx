// components/dashboard/admin/IntegrationsSettings.tsx
import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { useNotification } from '../../../context/NotificationContext';

const StatusIndicator: React.FC<{ configured: boolean }> = ({ configured }) => (
    <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${configured ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <p className={`text-sm font-semibold ${configured ? 'text-green-600' : 'text-red-600'}`}>
            {configured ? 'Configuré' : 'Non configuré'}
        </p>
    </div>
);

const IntegrationsSettings = () => {
    const { settings, updateSettings } = useSiteSettings();
    const { addNotification } = useNotification();
    const [localSettings, setLocalSettings] = React.useState(settings.integrations);
    const [isSaving, setIsSaving] = React.useState(false);
    
    const [showEmailApiKey, setShowEmailApiKey] = React.useState(false);
    const [showStorageSecretKey, setShowStorageSecretKey] = React.useState(false);

    React.useEffect(() => {
        setLocalSettings(settings.integrations);
    }, [settings.integrations]);

    const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        
        if (keys.length > 1) {
            const [section, key] = keys;
            setLocalSettings(prev => ({
                ...prev,
                [section]: {
                    ...(prev as any)[section],
                    [key]: value
                }
            }));
        } else {
            setLocalSettings(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings({ integrations: localSettings });
            addNotification("Paramètres d'intégration mis à jour avec succès !", 'success');
        } catch (error) {
            addNotification("Erreur lors de la mise à jour des intégrations.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Intégrations & Clés API</h2>
                        <p className="text-gray-500 mt-1">Connectez votre plateforme à des services externes pour étendre ses fonctionnalités.</p>
                    </div>
                    <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                        Enregistrer les modifications
                    </Button>
                </div>

                {/* Google Analytics Section */}
                <div className="p-6 border rounded-lg space-y-4 bg-gray-50 dark:bg-card-dark/50">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Google Analytics</h3>
                        <StatusIndicator configured={!!localSettings.googleAnalyticsId} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Suivez le trafic et le comportement des utilisateurs sur votre site.
                        <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">En savoir plus</a>
                    </p>
                    <Input 
                        label="ID de suivi Google Analytics (Ex: G-XXXXXXXXXX)"
                        id="ga-id"
                        name="googleAnalyticsId"
                        value={localSettings.googleAnalyticsId}
                        onChange={handleGeneralChange}
                    />
                </div>

                {/* Email Service Section */}
                <div className="p-6 border rounded-lg space-y-4 bg-gray-50 dark:bg-card-dark/50">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Service d'Envoi d'E-mails (SendGrid)</h3>
                        <StatusIndicator configured={!!localSettings.emailService.apiKey && !!localSettings.emailService.senderEmail} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Assurez une haute délivrabilité pour les e-mails transactionnels (notifications, etc.).
                        <a href="https://sendgrid.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">Obtenir une clé API</a>
                    </p>
                    <div className="space-y-4">
                        <Input
                            label="Email de l'expéditeur"
                            id="es-sender-email"
                            name="emailService.senderEmail"
                            type="email"
                            placeholder="noreply@investmaroc.com"
                            value={localSettings.emailService.senderEmail}
                            onChange={handleGeneralChange}
                        />
                        <div className="relative">
                            <Input
                                label="Clé API SendGrid"
                                id="es-api-key"
                                name="emailService.apiKey"
                                type={showEmailApiKey ? 'text' : 'password'}
                                value={localSettings.emailService.apiKey}
                                onChange={handleGeneralChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowEmailApiKey(!showEmailApiKey)}
                                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5"
                                aria-label="Toggle API key visibility"
                            >
                                <span className="material-symbols-outlined text-gray-500">
                                    {showEmailApiKey ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Cloud Storage Section */}
                <div className="p-6 border rounded-lg space-y-4 bg-gray-50 dark:bg-card-dark/50">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Stockage de Fichiers Cloud (Amazon S3)</h3>
                        <StatusIndicator configured={!!localSettings.cloudStorage.accessKeyId && !!localSettings.cloudStorage.secretAccessKey && !!localSettings.cloudStorage.bucketName} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Stockez les fichiers des utilisateurs (documents KYC, business plans) de manière sécurisée.
                        <a href="https://aws.amazon.com/s3/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">Configurer un bucket S3</a>
                    </p>
                    <div className="space-y-4">
                        <Input
                            label="Nom du Bucket"
                            id="cs-bucket-name"
                            name="cloudStorage.bucketName"
                            value={localSettings.cloudStorage.bucketName}
                            onChange={handleGeneralChange}
                        />
                        <Input
                            label="Région (Ex: eu-west-3)"
                            id="cs-region"
                            name="cloudStorage.region"
                            value={localSettings.cloudStorage.region}
                            onChange={handleGeneralChange}
                        />
                         <Input
                            label="Clé d'accès ID (Access Key ID)"
                            id="cs-access-key-id"
                            name="cloudStorage.accessKeyId"
                            value={localSettings.cloudStorage.accessKeyId}
                            onChange={handleGeneralChange}
                        />
                        <div className="relative">
                            <Input
                                label="Clé d'accès secrète (Secret Access Key)"
                                id="cs-secret-access-key"
                                name="cloudStorage.secretAccessKey"
                                type={showStorageSecretKey ? 'text' : 'password'}
                                value={localSettings.cloudStorage.secretAccessKey}
                                onChange={handleGeneralChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowStorageSecretKey(!showStorageSecretKey)}
                                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5"
                                aria-label="Toggle secret key visibility"
                            >
                                <span className="material-symbols-outlined text-gray-500">
                                    {showStorageSecretKey ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default IntegrationsSettings;