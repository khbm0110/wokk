import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const RoleCard: React.FC<{ to: string; icon: string; title: string; description: string }> = ({ to, icon, title, description }) => {
    const { t } = useLanguage();
    return (
        <Link to={to} className="block group p-8 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark text-center hover:border-primary dark:hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/20 text-primary mx-auto transition-colors group-hover:bg-primary group-hover:text-white">
                <span className="material-symbols-outlined text-4xl">{icon}</span>
            </div>
            <h3 className="mt-6 text-xl font-bold font-display text-text-light dark:text-text-dark">{title}</h3>
            <p className="mt-2 text-text-light/80 dark:text-text-dark/80">{description}</p>
            <span className="mt-6 inline-block font-bold text-primary group-hover:underline">{t('roleSelection.chooseRole')}</span>
        </Link>
    );
};


const RegisterRoleSelectionPage = () => {
    const { t } = useLanguage();
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-display text-text-light dark:text-text-dark">{t('roleSelection.title')}</h1>
                <p className="mt-4 text-lg text-text-light/80 dark:text-text-dark/80">
                    {t('roleSelection.subtitle')}
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <RoleCard 
                    to="/inscription/investisseur"
                    icon="trending_up"
                    title={t('roleSelection.investorTitle')}
                    description={t('roleSelection.investorDesc')}
                />
                <RoleCard 
                    to="/inscription/porteur_de_projet"
                    icon="rocket_launch"
                    title={t('roleSelection.projectOwnerTitle')}
                    description={t('roleSelection.projectOwnerDesc')}
                />
            </div>
             <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-12">
                {t('roleSelection.loginPrompt')} <Link to="/connexion" className="text-primary hover:underline font-semibold">{t('roleSelection.loginLink')}</Link>
            </p>
        </div>
    );
};

export default RegisterRoleSelectionPage;