// mobile_app/components/MobileLayout.tsx
import React from 'react';
import BottomNavBar from './BottomNavBar';
import MobileHeader from './MobileHeader';

interface MobileLayoutProps {
  children: React.ReactNode;
  theme: string;
  toggleTheme: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, theme, toggleTheme }) => {
  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-background-light dark:bg-background-dark shadow-2xl">
      <MobileHeader theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 overflow-y-auto pb-16 no-scrollbar">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
};

export default MobileLayout;