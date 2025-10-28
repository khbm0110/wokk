// components/dashboard/admin/SeoSettings.tsx
import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { useNotification } from '../../../context/NotificationContext';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';

const GooglePreview: React.FC<{ title: string; description: string; url: string }> = ({ title, description, url }) => (
    <div className="p-4 border border-border-light dark:border-border-dark rounded-lg font-sans">
        <p className="text-sm text-text-light dark:text-text-dark truncate">{url}</p>
        <h3 className="text-blue-600 text-xl font-medium truncate group-hover:underline">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description.length > 160 ? `${description.substring(0, 157)}...` : description}
        </p>
    </div>
);

const SocialPreview: React.FC<{ title: string; description: string; imageUrl: string, url: string }> = ({ title, description, imageUrl, url }) => (
    <div className="border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
        {imageUrl ? (
            <img src={imageUrl} alt="Social media preview" className="w-full h-48 object-cover" />
        ) : (
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">Image preview</div>
        )}
        <div className="p-4 bg-gray-50 dark:bg-card-dark/50">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400 truncate">{url.replace('https://', '').split('/')[0]}</p>
            <h3 className="font-bold text-text-light dark:text-text-dark truncate">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{description}</p>
        </div>
    </div>
);


const SeoSettings = () => {
    const { settings, updateSettings, loading: contextLoading } = useSiteSettings();
    const { addNotification } = useNotification();
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setLocalSettings(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'faviconUrl' | 'ogImageUrl') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalSettings(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCopyFromSeo = (field: 'title' | 'description') => {
        if(field === 'title') {
            setLocalSettings(prev => ({...prev, ogTitle: prev.seoTitle}));
        } else {
             setLocalSettings(prev => ({...prev, ogDescription: prev.seoDescription}));
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            await updateSettings(localSettings);
            addNotification('Paramètres SEO mis à jour avec succès !', 'success');
        } catch (error) {
            addNotification('Erreur lors de la mise à jour des paramètres SEO.', 'error');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (contextLoading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Paramètres SEO</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez comment votre site apparaît sur les moteurs de recherche et les réseaux sociaux.</p>
                </div>
                <Button onClick={handleSaveChanges} isLoading={isSaving} disabled={isSaving}>
                    Enregistrer les modifications
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold border-b border-border-light dark:border-border-dark pb-3 mb-4">Moteurs de Recherche</h2>
                        <div className="space-y-4">
                            <Input label="Titre SEO (Title Tag)" id="seoTitle" value={localSettings.seoTitle} onChange={handleTextChange} />
                            <p className="text-xs text-gray-500 -mt-2">Caractères: {localSettings.seoTitle.length} (Recommandé: 50-60)</p>
                            
                            <div>
                                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Méta Description</label>
                                <textarea id="seoDescription" rows={4} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.seoDescription} onChange={handleTextChange} />
                                <p className="text-xs text-gray-500 mt-1">Caractères: {localSettings.seoDescription.length} (Recommandé: 150-160)</p>
                            </div>

                            <Input label="Mots-clés (séparés par une virgule)" id="seoKeywords" value={localSettings.seoKeywords} onChange={handleTextChange} />
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-bold border-b border-border-light dark:border-border-dark pb-3 mb-4">Partage sur les Réseaux Sociaux (Open Graph)</h2>
                        <div className="space-y-4">
                             <div>
                                <Input label="Titre Open Graph" id="ogTitle" value={localSettings.ogTitle} onChange={handleTextChange} />
                                <div className="text-right -mt-6">
                                    <button onClick={() => handleCopyFromSeo('title')} className="text-xs text-primary hover:underline">Copier du titre SEO</button>
                                </div>
                             </div>
                             <div>
                                <div className="flex justify-between items-center">
                                    <label htmlFor="ogDescription" className="block text-sm font-medium">Description Open Graph</label>
                                     <button onClick={() => handleCopyFromSeo('description')} className="text-xs text-primary hover:underline">Copier de la méta-description</button>
                                </div>
                                <textarea id="ogDescription" rows={3} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.ogDescription} onChange={handleTextChange} />
                             </div>
                             <div>
                                <label htmlFor="ogImageUrl" className="block text-sm font-medium">Image de Partage Social</label>
                                <p className="text-xs text-gray-500 mb-2">Recommandé: 1200x630px.</p>
                                <input type="file" id="ogImageUrl" accept="image/*" onChange={(e) => handleImageChange(e, 'ogImageUrl')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"/>
                             </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-bold border-b border-border-light dark:border-border-dark pb-3 mb-4">Identité du Site</h2>
                        <div className="flex items-center gap-6">
                            <div className="flex-1">
                                <label htmlFor="faviconUrl" className="block text-sm font-medium">Favicon</label>
                                <p className="text-xs text-gray-500 mb-2">Fichier .ico, .png ou .svg.</p>
                                <input type="file" id="faviconUrl" accept="image/*,.ico" onChange={(e) => handleImageChange(e, 'faviconUrl')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"/>
                            </div>
                            <div className="flex-shrink-0">
                                <p className="text-sm font-medium text-center mb-1">Aperçu</p>
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-border-light dark:border-border-dark">
                                    <img src={localSettings.faviconUrl} alt="Favicon preview" className="w-10 h-10 object-contain"/>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24">
                    <Card>
                        <h3 className="text-md font-bold mb-2">Aperçu - Recherche Google</h3>
                        <GooglePreview title={localSettings.seoTitle} description={localSettings.seoDescription} url={`https://www.investmaroc.com/`} />
                    </Card>
                     <Card>
                        <h3 className="text-md font-bold mb-2">Aperçu - Partage Social</h3>
                        <SocialPreview title={localSettings.ogTitle} description={localSettings.ogDescription} imageUrl={localSettings.ogImageUrl} url="https://www.investmaroc.com" />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SeoSettings;