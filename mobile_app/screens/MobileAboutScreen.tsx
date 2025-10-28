// mobile_app/screens/MobileAboutScreen.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem: React.FC<{ icon: string; label: string; to: string; }> = ({ icon, label, to }) => (
    <Link to={to} className="w-full flex items-center p-4 text-left bg-white dark:bg-card-dark rounded-lg shadow-sm active:bg-gray-100 dark:active:bg-gray-700 transition-colors">
        <span className="material-symbols-outlined mr-4 text-primary">{icon}</span>
        <span className="flex-grow font-medium text-text-light dark:text-text-dark">{label}</span>
        <span className="material-symbols-outlined text-gray-400">chevron_right</span>
    </Link>
);

const MobileAboutScreen = () => {
    return (
        <div className="p-4 space-y-3">
            <MenuItem icon="info" label="À propos de InvestMaroc" to="/mobile/about/about-us" />
            <MenuItem icon="policy" label="Politique de confidentialité" to="/mobile/about/privacy" />
            <MenuItem icon="gavel" label="Conditions d'utilisation" to="/mobile/about/terms" />
            <MenuItem icon="mail" label="Contactez-nous" to="/mobile/about/contact" />
        </div>
    );
};

export default MobileAboutScreen;
