
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
    const activeClass = 'text-primary';
    const inactiveClass = 'text-gray-500 dark:text-gray-400';

    return (
        <NavLink
            to={to}
            className={({ isActive }) => `flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${isActive ? activeClass : inactiveClass}`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
        </NavLink>
    );
};

const BottomNavBar = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white/80 dark:bg-card-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark flex justify-around">
      <NavItem to="/mobile/home" icon="home" label="Accueil" />
      <NavItem to="/mobile/projects" icon="search" label="Projets" />
      <NavItem to="/mobile/about" icon="info" label="À propos" />
      {isAuthenticated ? (
         <NavItem to="/mobile/profile" icon="person" label="Profil" />
      ) : (
         <NavItem to="/mobile/login" icon="login" label="Connexion" />
      )}
    </div>
  );
};

export default BottomNavBar;