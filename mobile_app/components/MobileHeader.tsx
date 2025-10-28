// mobile_app/components/MobileHeader.tsx
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import NotificationBellMobile from './NotificationBellMobile';

const screenTitles: { [key: string]: string } = {
    '/mobile/home': 'Accueil',
    '/mobile/projects': 'Découvrir les Projets',
    '/mobile/profile': 'Mon Profil',
    '/mobile/deposit': 'Effectuer un Dépôt',
    '/mobile/withdraw': 'Effectuer un Retrait',
    '/mobile/notifications': 'Notifications',
    '/mobile/about': 'À propos',
};

const pageParamTitles: { [key: string]: string } = {
    'about-us': 'À propos de nous',
    'privacy': 'Confidentialité',
    'terms': 'Conditions',
    'contact': 'Contact',
};

interface MobileHeaderProps {
  theme: string;
  toggleTheme: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ theme, toggleTheme }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Match dynamic routes
    const isProjectDetails = /^\/mobile\/project\/.+/.test(location.pathname);
    const isAboutPage = /^\/mobile\/about\/.+/.test(location.pathname);

    let title = screenTitles[location.pathname] || '';
    if (isProjectDetails) {
        title = 'Détails du Projet';
    }
    if (isAboutPage) {
        const pageParam = location.pathname.split('/').pop() || '';
        title = pageParamTitles[pageParam] || 'Information';
    }

    const baseScreens = ['/mobile/home', '/mobile/projects', '/mobile/profile', '/mobile/about'];
    const showBackButton = !baseScreens.includes(location.pathname);

    return (
        <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white/80 dark:bg-card-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
            <div className="flex-1 flex justify-start">
                {showBackButton && (
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                )}
            </div>
            <h1 className="text-lg font-bold text-center truncate">{title}</h1>
            <div className="flex-1 flex justify-end items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="p-2 text-neutral dark:text-text-dark"
                    aria-label="Changer le thème"
                >
                    <span className="material-symbols-outlined">
                        {theme === 'light' ? 'dark_mode' : 'light_mode'}
                    </span>
                </button>
                <NotificationBellMobile />
            </div>
        </header>
    );
};

export default MobileHeader;