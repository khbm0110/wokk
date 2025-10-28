import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import NotificationBell from '../shared/NotificationBell';

interface HeaderProps {
  toggleTheme: () => void;
  theme: string;
}

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = (lang: 'ar' | 'fr') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-text-light dark:text-text-dark border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Changer la langue"
      >
        <span className="material-symbols-outlined">language</span>
      </button>
      {isOpen && (
        <div className="absolute end-0 mt-2 w-32 bg-white dark:bg-card-dark dark:border dark:border-border-dark rounded-md shadow-lg overflow-hidden z-20">
          <ul className="py-1">
            <li>
              <button onClick={() => toggleLanguage('ar')} className={`w-full text-start px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${language === 'ar' ? 'font-bold text-primary' : ''}`}>
                العربية
              </button>
            </li>
            <li>
              <button onClick={() => toggleLanguage('fr')} className={`w-full text-start px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${language === 'fr' ? 'font-bold text-primary' : ''}`}>
                Français
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { settings } = useSiteSettings();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-4 text-primary">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] font-display text-text-light dark:text-text-dark">{t('siteName')}</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-light dark:text-text-dark">{t('home')}</Link>
            <Link to="/projets" className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-light dark:text-text-dark">{t('projects')}</Link>
            <Link to="/services" className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-light dark:text-text-dark">{t('services')}</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-light dark:text-text-dark">{t('dashboard')}</Link>
            )}
             <a href="#" className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-light dark:text-text-dark">{t('about')}</a>
             <Link to="/contact" className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-light dark:text-text-dark">{t('contact')}</Link>
             <Link to="/mobile" className="flex items-center gap-1 text-sm font-medium leading-normal hover:text-primary transition-colors text-text-light dark:text-text-dark">
                <span className="material-symbols-outlined text-base">phone_iphone</span>
                {t('mobileApp')}
              </Link>
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <span className="hidden sm:block text-sm font-medium px-4 text-text-light dark:text-text-dark">{t('hello')}, {user?.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-transparent text-text-light dark:text-text-dark border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
                >
                  <span className="truncate">{t('logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-transparent text-text-light dark:text-text-dark border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                  <span className="truncate">{t('login')}</span>
                </Link>
                <Link to="/inscription" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-md">
                  <span className="truncate">{t('createAccount')}</span>
                </Link>
              </>
            )}
             <LanguageSwitcher />
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-text-light dark:text-text-dark border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={t('changeTheme')}
            >
                <span className="material-symbols-outlined">
                    {theme === 'light' ? 'dark_mode' : 'light_mode'}
                </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
