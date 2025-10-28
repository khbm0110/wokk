

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { KYCStatus } from '../../../types';
import Button from '../../ui/Button';
import KYCStatusBadge from '../../ui/KYCStatusBadge';
import { useLanguage } from '../../../context/LanguageContext';

const ProfileView = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    if (!user) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold font-display mb-4 text-text-light dark:text-text-dark">{t('profile.myProfile')}</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b dark:border-gray-700">
                    <span className="text-text-light/80 dark:text-text-dark/80">{t('profile.fullName')}</span>
                    <span className="font-semibold text-text-light dark:text-text-dark">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b dark:border-gray-700">
                    <span className="text-text-light/80 dark:text-text-dark/80">{t('profile.email')}</span>
                    <span className="font-semibold text-text-light dark:text-text-dark">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b dark:border-gray-700">
                    <span className="text-text-light/80 dark:text-text-dark/80">{t('profile.phone')}</span>
                    <span className="font-semibold text-text-light dark:text-text-dark">{user.phone}</span>
                </div>
                 <div className="flex justify-between items-center py-3">
                    <span className="text-text-light/80 dark:text-text-dark/80">{t('profile.kycStatus')}</span>
                    <KYCStatusBadge status={user.kycStatus} />
                </div>
                {user.kycStatus !== KYCStatus.VERIFIED && (
                    <div className="mt-6 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-center border-yellow-200 dark:border-yellow-800">
                        <p className="font-semibold text-yellow-800 dark:text-yellow-200">{t('profile.notVerifiedTitle')}</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">{t('profile.notVerifiedDesc')}</p>
                        <Button className="mt-4">
                            {t('profile.completeVerification')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileView;