import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { useNotification } from '../../../context/NotificationContext';
import { PaymentGatewaySettings } from '../../../types';

const StatusIndicator: React.FC<{ configured: boolean }> = ({ configured }) => (
    <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${configured ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <p className={`text-sm font-semibold ${configured ? 'text-green-600' : 'text-red-600'}`}>
            {configured ? 'Configuré' : 'Non configuré'}
        </p>
    </div>
);

const PaymentGatewaySettings = () => {
    const { settings, updateSettings } = useSiteSettings();
    const { addNotification } = useNotification();
    const [localSettings, setLocalSettings] = React.useState(settings.integrations.paymentGateway);
    const [isSaving, setIsSaving] = React.useState(false);
    
    const [showStripeSecret, setShowStripeSecret] = React.useState(false);
    const [showPaypalSecret, setShowPaypalSecret] = React.useState(false);
    const [showCihApiKey, setShowCihApiKey] = React.useState(false);

    React.useEffect(() => {
        setLocalSettings(settings.integrations.paymentGateway);
    }, [settings.integrations.paymentGateway]);

    const handlePaymentGatewayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [gateway, key] = name.split('.') as [Exclude<keyof PaymentGatewaySettings, 'activeGateway'>, string];
        setLocalSettings(prev => ({
            ...prev,
            [gateway]: {
                ...prev[gateway],
                [key]: value,
            },
        }));
    };

    const handleActiveGatewayChange = (gateway: PaymentGatewaySettings['activeGateway']) => {
        setLocalSettings(prev => ({
            ...prev,
            activeGateway: gateway,
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings({ 
                integrations: {
                    ...settings.integrations,
                    paymentGateway: localSettings
                }
            });
            addNotification("Paramètres de paiement mis à jour avec succès !", 'success');
        } catch (error) {
            addNotification("Erreur lors de la mise à jour des paramètres.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const isPaymentGatewayConfigured = () => {
        const { activeGateway, cmi, stripe, paypal, cih } = localSettings;
        if (activeGateway === 'cmi') return !!cmi.merchantId && !!cmi.accessKey;
        if (activeGateway === 'stripe') return !!stripe.publicKey && !!stripe.secretKey;
        if (activeGateway === 'paypal') return !!paypal.clientId && !!paypal.clientSecret;
        if (activeGateway === 'cih') return !!cih.merchantId && !!cih.apiKey;
        return false;
    };

    return (
        <Card>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Passerelles de Paiement</h2>
                        <p className="text-gray-500 mt-1">Configurez les services pour accepter les paiements en ligne.</p>
                    </div>
                    <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                        Enregistrer
                    </Button>
                </div>

                <div className="p-6 border rounded-lg space-y-4 bg-gray-50 dark:bg-card-dark/50">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Configuration de la passerelle active</h3>
                        <StatusIndicator configured={isPaymentGatewayConfigured()} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choisissez et configurez la passerelle pour accepter les paiements.</p>
                    
                    <div className="flex border-b border-border-light dark:border-border-dark overflow-x-auto no-scrollbar">
                        {(['cmi', 'cih', 'stripe', 'paypal'] as const).map(gw => (
                             <button
                                key={gw}
                                onClick={() => handleActiveGatewayChange(gw)}
                                className={`px-4 py-2 text-sm font-semibold capitalize transition-colors duration-200 -mb-px border-b-2 flex-shrink-0 ${localSettings.activeGateway === gw ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                {gw}
                            </button>
                        ))}
                    </div>

                    {localSettings.activeGateway === 'cmi' && (
                        <div className="space-y-4 pt-4 animate-fade-in">
                            <Input id="cmi.merchantId" label="ID Marchand (Merchant ID)" name="cmi.merchantId" value={localSettings.cmi.merchantId} onChange={handlePaymentGatewayChange} />
                            <Input id="cmi.accessKey" label="Clé d'accès (Access Key)" name="cmi.accessKey" value={localSettings.cmi.accessKey} onChange={handlePaymentGatewayChange} />
                        </div>
                    )}
                    {localSettings.activeGateway === 'cih' && (
                        <div className="space-y-4 pt-4 animate-fade-in">
                            <Input id="cih.merchantId" label="ID Marchand (Merchant ID)" name="cih.merchantId" value={localSettings.cih.merchantId} onChange={handlePaymentGatewayChange} />
                             <div className="relative">
                                <Input id="cih.apiKey" label="Clé API (API Key)" name="cih.apiKey" type={showCihApiKey ? 'text' : 'password'} value={localSettings.cih.apiKey} onChange={handlePaymentGatewayChange} />
                                <button type="button" onClick={() => setShowCihApiKey(!showCihApiKey)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm">
                                    <span className="material-symbols-outlined text-gray-500">{showCihApiKey ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                    {localSettings.activeGateway === 'stripe' && (
                        <div className="space-y-4 pt-4 animate-fade-in">
                             <Input id="stripe.publicKey" label="Clé Publiable (Publishable Key)" name="stripe.publicKey" value={localSettings.stripe.publicKey} onChange={handlePaymentGatewayChange} />
                             <div className="relative">
                                <Input id="stripe.secretKey" label="Clé Secrète (Secret Key)" name="stripe.secretKey" type={showStripeSecret ? 'text' : 'password'} value={localSettings.stripe.secretKey} onChange={handlePaymentGatewayChange} />
                                <button type="button" onClick={() => setShowStripeSecret(!showStripeSecret)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm">
                                    <span className="material-symbols-outlined text-gray-500">{showStripeSecret ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                    {localSettings.activeGateway === 'paypal' && (
                        <div className="space-y-4 pt-4 animate-fade-in">
                             <Input id="paypal.clientId" label="ID Client (Client ID)" name="paypal.clientId" value={localSettings.paypal.clientId} onChange={handlePaymentGatewayChange} />
                            <div className="relative">
                                <Input id="paypal.clientSecret" label="Secret Client (Client Secret)" name="paypal.clientSecret" type={showPaypalSecret ? 'text' : 'password'} value={localSettings.paypal.clientSecret} onChange={handlePaymentGatewayChange} />
                                <button type="button" onClick={() => setShowPaypalSecret(!showPaypalSecret)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm">
                                    <span className="material-symbols-outlined text-gray-500">{showPaypalSecret ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default PaymentGatewaySettings;