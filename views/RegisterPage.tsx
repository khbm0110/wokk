import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UserRole } from '../types';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const RegisterPage = () => {
    const { role } = useParams<{ role: string }>();
    const navigate = useNavigate();
    const { register } = useAuth();
    const { addNotification } = useNotification();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    const userRole = role?.toLowerCase() === 'investisseur' ? UserRole.INVESTOR : UserRole.PROJECT_OWNER;
    const rolePath = role?.toLowerCase() === 'investisseur' ? 'investisseur' : 'porteur_de_projet';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Partial<typeof formData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        if (errors[id as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };
    
    const validateForm = (): boolean => {
        const newErrors: Partial<typeof formData> = {};

        if (!formData.firstName.trim()) newErrors.firstName = t('register.errorRequired', { field: t('register.firstName') });
        if (!formData.lastName.trim()) newErrors.lastName = t('register.errorRequired', { field: t('register.lastName') });
        
        if (!formData.email) {
            newErrors.email = t('register.errorRequired', { field: t('authPage.emailLabel') });
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('register.errorEmail');
        }
        
        if (!formData.phone) {
            newErrors.phone = t('register.errorRequired', { field: t('register.phone') });
        } else if (!/^\+212[67]\d{8}$/.test(formData.phone)) {
            newErrors.phone = t('register.errorPhone');
        }

        if (userRole === UserRole.PROJECT_OWNER) {
            if (!formData.city.trim()) newErrors.city = t('register.errorRequired', { field: t('register.city') });
            if (!formData.address.trim()) newErrors.address = t('register.errorRequired', { field: t('register.address') });
        }

        if (!formData.password) {
            newErrors.password = t('register.errorRequired', { field: t('authPage.passwordLabel') });
        } else if (formData.password.length < 6) {
            newErrors.password = t('register.errorPasswordLength');
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('register.errorPasswordMatch');
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            addNotification(t('register.errorForm'), "error");
            return;
        }
        setIsLoading(true);
        try {
            await register({ ...formData, password: formData.password }, userRole);
            addNotification(t('register.success'), 'success');
            navigate(`/verification-telephone/${rolePath}`);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setErrors(prev => ({ ...prev, email: t('register.errorEmailExists') }));
                addNotification(t('register.errorEmailExists'), 'error');
            } else {
                 addNotification(error.message || t('register.errorGeneric'), 'error');
            }
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <div className="bg-white dark:bg-card-dark p-8 rounded-xl shadow-lg border border-border-light dark:border-border-dark">
                <h2 className="text-2xl font-bold text-center mb-2 text-text-light dark:text-text-dark">
                    {userRole === UserRole.INVESTOR ? t('register.titleInvestor') : t('register.titleProjectOwner')}
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-8">{t('register.subtitle')} <Link to="/connexion" className="text-primary hover:underline">{t('register.loginLink')}</Link></p>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label={t('register.firstName')} id="firstName" type="text" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
                        <Input label={t('register.lastName')} id="lastName" type="text" value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
                    </div>
                    <Input label={t('authPage.emailLabel')} id="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                    <Input label={t('register.phone')} id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder={t('register.phonePlaceholder')} error={errors.phone} required />
                    {userRole === UserRole.PROJECT_OWNER && (
                        <>
                            <Input label={t('register.city')} id="city" type="text" value={formData.city} onChange={handleChange} error={errors.city} required />
                            <Input label={t('register.address')} id="address" type="text" value={formData.address} onChange={handleChange} error={errors.address} required />
                        </>
                    )}
                    <Input label={t('authPage.passwordLabel')} id="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} required />
                    <Input label={t('register.confirmPassword')} id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />
                    <div className="text-right">
                        <Button type="submit" isLoading={isLoading}>{t('register.submitButton')}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;