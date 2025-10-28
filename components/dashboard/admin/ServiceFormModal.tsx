import React, { useState, useEffect } from 'react';
import { Service } from '../../../types';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { useLanguage } from '../../../context/LanguageContext';
import { useNotification } from '../../../context/NotificationContext';
import { translateText } from '../../../services/geminiService';

interface ServiceFormModalProps {
    service: Partial<Service> | null;
    onClose: () => void;
    onSave: (service: Partial<Service>) => void;
    isSaving: boolean;
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ service, onClose, onSave, isSaving }) => {
    const { t } = useLanguage();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState<Partial<Service>>({});
    const [isTranslating, setIsTranslating] = useState<'title' | 'description' | null>(null);

    useEffect(() => {
        if (service) {
            setFormData({
                ...service,
                title: service.title || { fr: '', ar: '' },
                description: service.description || { fr: '', ar: '' },
            });
        } else {
            setFormData({
                title: { fr: '', ar: '' },
                description: { fr: '', ar: '' },
                price: 0,
                deliveryTimeDays: 0,
                icon: ''
            });
        }
    }, [service]);

    if (!service) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (name.includes('.')) {
            const [field, lang] = name.split('.') as ['title' | 'description', 'fr' | 'ar'];
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...(prev[field] as any),
                    [lang]: value,
                }
            }));
        } else {
             setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? Number(value) : value,
            }));
        }
    };
    
    const handleTranslate = async (field: 'title' | 'description', sourceLang: 'fr' | 'ar', targetLang: 'fr' | 'ar') => {
        const textToTranslate = formData[field]?.[sourceLang];
        if (!textToTranslate?.trim()) {
            addNotification(`Veuillez d'abord remplir le champ en ${sourceLang === 'fr' ? 'français' : 'arabe'}.`, "error");
            return;
        }
        setIsTranslating(field);
        try {
            const translatedText = await translateText(textToTranslate, targetLang);
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...(prev[field] as any),
                    [targetLang]: translatedText,
                }
            }));
        } catch (error: any) {
            addNotification(error.message || "Erreur de traduction.", "error");
        } finally {
            setIsTranslating(null);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b border-border-light dark:border-border-dark">
                        <h2 className="text-xl font-bold">{formData.id ? t('admin.services.form.editTitle') : t('admin.services.form.addTitle')}</h2>
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-4">
                        <div>
                            <Input name="title.fr" label={t('admin.services.form.titleFr')} id="service-title-fr" value={formData.title?.fr || ''} onChange={handleChange} required />
                            <div className="flex justify-center my-2">
                                <Button type="button" size="sm" variant="ghost" onClick={() => handleTranslate('title', 'fr', 'ar')} disabled={isTranslating === 'title'}>
                                    {isTranslating === 'title' ? t('admin.services.form.translating') : t('admin.services.form.translateToAr')}
                                    <span className="material-symbols-outlined text-base ml-1 rtl:mr-1">translate</span>
                                </Button>
                            </div>
                            <Input name="title.ar" label={t('admin.services.form.titleAr')} id="service-title-ar" value={formData.title?.ar || ''} onChange={handleChange} dir="rtl" required />
                        </div>
                        
                        <div>
                             <label htmlFor="service-description-fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.services.form.descriptionFr')}</label>
                            <textarea
                                id="service-description-fr"
                                name="description.fr"
                                rows={4}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm p-2"
                                value={formData.description?.fr || ''}
                                onChange={handleChange}
                                required
                            />
                            <div className="flex justify-center my-2">
                                <Button type="button" size="sm" variant="ghost" onClick={() => handleTranslate('description', 'fr', 'ar')} disabled={isTranslating === 'description'}>
                                    {isTranslating === 'description' ? t('admin.services.form.translating') : t('admin.services.form.translateToAr')}
                                    <span className="material-symbols-outlined text-base ml-1 rtl:mr-1">translate</span>
                                </Button>
                            </div>
                             <label htmlFor="service-description-ar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.services.form.descriptionAr')}</label>
                             <textarea
                                id="service-description-ar"
                                name="description.ar"
                                rows={4}
                                dir="rtl"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm p-2"
                                value={formData.description?.ar || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input name="price" label="Prix (MAD)" id="service-price" type="number" value={formData.price || 0} onChange={handleChange} required />
                            <Input name="deliveryTimeDays" label="Délai de livraison (jours)" id="service-delivery" type="number" value={formData.deliveryTimeDays || 0} onChange={handleChange} required />
                        </div>
                        <Input name="icon" label="Nom de l'icône (Material Symbols)" id="service-icon" placeholder="e.g., description, monitoring" value={formData.icon || ''} onChange={handleChange} required />
                        <p className="text-xs text-gray-500">
                            Trouvez les noms d'icônes sur <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Fonts</a>.
                        </p>
                    </div>
                    <div className="p-6 mt-auto border-t border-border-light dark:border-border-dark flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>{t('common.close')}</Button>
                        <Button type="submit" isLoading={isSaving} disabled={isSaving}>
                            {t('common.save')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceFormModal;