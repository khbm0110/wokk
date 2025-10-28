import React, { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const ContactPage = () => {
    const { addNotification } = useNotification();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate sending a message
        setTimeout(() => {
            setIsLoading(false);
            addNotification(t('contact.success'), "success");
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold font-display text-text-light dark:text-text-dark">{t('contact.title')}</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-text-light/80 dark:text-text-dark/80">
                        {t('contact.subtitle')}
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 bg-white dark:bg-card-dark p-8 rounded-xl shadow-lg border border-border-light dark:border-border-dark">
                        <h2 className="text-2xl font-bold font-display text-text-light dark:text-text-dark">{t('contact.infoTitle')}</h2>
                        <p className="mt-2 text-text-light/70 dark:text-text-dark/70">{t('contact.infoSubtitle')}</p>
                        <div className="mt-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{t('contact.address')}</h3>
                                    <p className="text-text-light/80 dark:text-text-dark/80">789 Boulevard Anfa, Casablanca, Maroc</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{t('contact.email')}</h3>
                                    <a href="mailto:contact@investmaroc.com" className="text-primary hover:underline">contact@investmaroc.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">call</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{t('contact.phone')}</h3>
                                    <p className="text-text-light/80 dark:text-text-dark/80">+212 5 22 00 00 00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white dark:bg-card-dark p-8 rounded-xl shadow-lg border border-border-light dark:border-border-dark">
                         <h2 className="text-2xl font-bold font-display text-text-light dark:text-text-dark">{t('contact.formTitle')}</h2>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input label={t('contact.nameLabel')} id="name" type="text" value={formData.name} onChange={handleChange} required />
                                <Input label={t('contact.emailLabel')} id="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <Input label={t('contact.subjectLabel')} id="subject" type="text" value={formData.subject} onChange={handleChange} required />
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contact.messageLabel')}</label>
                                <textarea
                                    id="message"
                                    rows={6}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card-light text-neutral dark:bg-card-dark dark:text-text-dark"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="text-right">
                                <Button type="submit" isLoading={isLoading}>
                                    {t('contact.submitButton')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;