// components/layout/DashboardLayout.tsx
import React from 'react';

interface NavItem {
    id: string;
    icon: string;
    label: string;
    to?: string;
}

interface DashboardLayoutProps {
    sidebarHeader: React.ReactNode;
    sidebarFooter: React.ReactNode;
    navItems: NavItem[];
    activeViewId: string;
    onNavItemClick: (id: string) => void;
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    sidebarHeader,
    sidebarFooter,
    navItems,
    activeViewId,
    onNavItemClick,
    children,
}) => {
    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
            <aside className="w-64 flex-shrink-0 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark flex-col hidden lg:flex">
                <div className="flex flex-col justify-between flex-1 p-4">
                    <div>
                        {sidebarHeader}
                        <nav className="flex flex-col gap-2 mt-6">
                            {navItems.map(item => (
                                <a
                                    key={item.id}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onNavItemClick(item.id); }}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                                        activeViewId === item.id 
                                        ? 'bg-primary/20 text-primary dark:text-primary dark:bg-primary/30' 
                                        : 'text-text-light-primary dark:text-gray-300 hover:bg-primary/10'
                                    }`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    <p className="text-sm font-medium leading-normal">{item.label}</p>
                                </a>
                            ))}
                        </nav>
                    </div>
                    {sidebarFooter}
                </div>
            </aside>
            <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
