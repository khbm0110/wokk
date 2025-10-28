

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { KYCStatus } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import KYCStatusBadge from '../../ui/KYCStatusBadge';
import { useLanguage } from '../../../context/LanguageContext';

const Profile = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    if (!user) return null;
    
    const isEditable = user.kycStatus === KYCStatus.PENDING;

    return (
        <Card>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold">{t('poDashboard.profile.title')}</h2>
                    <p className="text-gray-500">{t('poDashboard.profile.subtitle')}</p>
                </div>
                <KYCStatusBadge status={user.kycStatus} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center">
                    <img src={user.profilePictureUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4" />
                    <Button variant="ghost" size="sm">{t('poDashboard.profile.changePhoto')}</Button>
                </div>

                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-bold border-b pb-2">{t('poDashboard.profile.personalInfo')}</h3>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('profile.fullName')}</span>
                        <span className="font-semibold">{user.firstName} {user.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('profile.email')}</span>
                        <span className="font-semibold">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('profile.phone')}</span>
                        <span className="font-semibold">{user.phone}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('register.city')}</span>
                        <span className="font-semibold">{user.city || t('common.notApplicable')}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('register.address')}</span>
                        <span className="font-semibold">{user.address || t('common.notApplicable')}</span>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                         <Button variant="secondary" disabled={!isEditable}>{t('poDashboard.profile.editInfo')}</Button>
                         <Button variant="ghost">{t('poDashboard.profile.changePassword')}</Button>
                    </div>

                     <h3 className="font-bold border-b pb-2 pt-6">{t('poDashboard.profile.submittedDocs')}</h3>
                     <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                        <li>Pièce d'identité (ID_Card_Recto.jpg, ID_Card_Verso.jpg) - <span className="text-green-600 font-semibold">{t('poDashboard.profile.docVerified')}</span></li>
                        <li>Selfie de vérification (Selfie.jpg) - <span className="text-green-600 font-semibold">{t('poDashboard.profile.docVerified')}</span></li>
                        <li>Documents de l'entreprise (Registre_Commerce.pdf) - <span className="text-yellow-600 font-semibold">{t('poDashboard.profile.docPending')}</span></li>
                     </ul>

                </div>
            </div>
        </Card>
    );
};

export default Profile;