import React from 'react';
import { UserRole } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useLanguage } from '../../context/LanguageContext';

interface KYCFormProps {
    userRole: UserRole;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

const KYCForm: React.FC<KYCFormProps> = ({ userRole, onSubmit, isLoading }) => {
    const { t } = useLanguage();
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label htmlFor="id-doc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('kyc.idDoc')}</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('kyc.idDocDesc')}</p>
                <input type="file" id="id-doc" multiple className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" required/>
            </div>
             <div>
                <label htmlFor="selfie" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('kyc.selfie')}</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('kyc.selfieDesc')}</p>
                <input type="file" id="selfie" capture="user" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" required/>
            </div>
            {userRole === UserRole.INVESTOR && (
                 <div className="space-y-6">
                    <Input label={t('register.city')} id="city" type="text" placeholder="Ex: Rabat" required />
                    <Input label={t('register.address')} id="address" type="text" placeholder="Ex: 123 Avenue Mohammed V" required />
                 </div>
            )}
            {userRole === UserRole.PROJECT_OWNER && (
                <div>
                    <label htmlFor="project-docs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('kyc.companyDocs')}</label>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('kyc.companyDocsDesc')}</p>
                    <input type="file" id="project-docs" multiple className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" required/>
                </div>
            )}
            <div className="pt-4 text-right">
                <Button type="submit" isLoading={isLoading}>
                    {isLoading ? t('kyc.submitButtonLoading') : t('kyc.submitButton')}
                </Button>
            </div>
        </form>
    );
};

export default KYCForm;