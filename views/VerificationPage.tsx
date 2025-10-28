import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import KYCForm from '../components/auth/KYCForm';
import { useLanguage } from '../context/LanguageContext';

const VerificationPage = () => {
    const { role } = useParams<{ role: string }>();
    const navigate = useNavigate();
    const { completeRegistration } = useAuth();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    const userRole = role?.toLowerCase() === 'investisseur' ? UserRole.INVESTOR : UserRole.PROJECT_OWNER;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => { // Simulate API call for document upload and processing
            completeRegistration(userRole);
            setIsLoading(false);
            if(userRole === UserRole.INVESTOR) {
                alert(t('kyc.alertInvestor'));
            } else {
                alert(t('kyc.alertOwner'));
            }
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <div className="bg-white dark:bg-card-dark p-8 rounded-xl shadow-lg border border-border-light dark:border-border-dark">
                <h2 className="text-2xl font-bold text-center mb-2 text-text-light dark:text-text-dark">{t('kyc.title')}</h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-8">{t('kyc.subtitle')}</p>
                
                <KYCForm 
                    userRole={userRole}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default VerificationPage;