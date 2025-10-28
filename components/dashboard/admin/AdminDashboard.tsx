// components/dashboard/admin/AdminDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getPlatformStats, getAllProjects, getAllUsers } from '../../../services/adminService';
import { UserRole, Project, ProjectStatus } from '../../../types';
import Spinner from '../../ui/Spinner';
import { useLanguage } from '../../../context/LanguageContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import DashboardLayout from '../../layout/DashboardLayout';
import UserManagement from './UserManagement';
import ProjectManagement from './ProjectManagement';
import Analytics from './Analytics';
import AdminManagement from './AdminManagement';
import ContentManagement from './ContentManagement';
import GeneralSettings from './GeneralSettings';
import SystemSettings from './SystemSettings';
import ServiceManagement from './ServiceManagement';
import WithdrawalManagement from './WithdrawalManagement';

type AdminView = 'dashboard' | 'users' | 'projects' | 'admins' | 'finance' | 'content' | 'analytics' | 'settings' | 'general_settings' | 'services' | 'withdrawals';

const PERMISSIONS = {
    [UserRole.SUPER_ADMIN]: ['dashboard', 'users', 'projects', 'services', 'admins', 'finance', 'content', 'analytics', 'settings', 'general_settings', 'withdrawals'],
    [UserRole.VALIDATOR_ADMIN]: ['dashboard', 'users', 'projects', 'services'],
    [UserRole.FINANCIAL_ADMIN]: ['dashboard', 'finance', 'analytics', 'withdrawals'],
    [UserRole.SERVICE_ADMIN]: ['dashboard', 'services', 'users', 'projects']
};

const COLORS = ['#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#64748b', '#8b5cf6'];

// New Dashboard Home View with Charts
const DashboardHome: React.FC<{ stats: any; projects: Project[], currency: string; userRole: UserRole; }> = ({ stats, projects, currency, userRole }) => {
    const canViewFinancials = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.FINANCIAL_ADMIN;

    const projectStatusData = useMemo(() => {
        if (!projects) return [];
        const statusCounts = projects.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {} as Record<ProjectStatus, number>);
        
        return Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
    }, [projects]);

    const monthlyFinancialData = [
        { name: 'Jan', Investissements: 120000, Gains: 5000 },
        { name: 'Fév', Investissements: 210000, Gains: 8000 },
        { name: 'Mar', Investissements: 330000, Gains: 10000 },
        { name: 'Avr', Investissements: 250000, Gains: 9000 },
        { name: 'Mai', Investissements: 480000, Gains: 15000 },
        { name: 'Juin', Investissements: 510000, Gains: 20000 },
    ];
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                    <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-300">Utilisateurs Totaux</p>
                    <p className="tracking-light text-3xl font-bold leading-tight">{stats.totalUsers}</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                    <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-300">Projets Actifs</p>
                    <p className="tracking-light text-3xl font-bold leading-tight">{stats.projectCounts.active}</p>
                </div>
                {canViewFinancials && (
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                        <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-300">Fonds Levés ({currency})</p>
                        <p className="tracking-light text-3xl font-bold leading-tight">{new Intl.NumberFormat('fr-MA').format(stats.totalInvestments)}</p>
                    </div>
                )}
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                    <p className="text-base font-medium leading-normal text-gray-600 dark:text-gray-300">Approbations en Attente</p>
                    <p className="tracking-light text-3xl font-bold leading-tight text-amber-500">{stats.userCounts.pending + stats.projectCounts.pending}</p>
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                    <h3 className="font-bold mb-4">Performance Financière Mensuelle</h3>
                     <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={monthlyFinancialData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)"/>
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                                <Tooltip formatter={(value, name) => [`${new Intl.NumberFormat('fr-MA').format(value as number)} ${currency}`, name]} />
                                <Legend />
                                <Bar dataKey="Investissements" fill="#06e0ca" name="Investissements" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Gains" fill="#f59e0b" name="Gains Plateforme" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                    <h3 className="font-bold mb-4">Répartition des Projets</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                    {projectStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, name]}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { currency } = useLanguage();
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const userPermissions = useMemo(() => {
        if (!user) return [];
        return PERMISSIONS[user.role as keyof typeof PERMISSIONS] || [];
    }, [user]);

    useEffect(() => {
        if (user && !userPermissions.includes(activeView)) {
            setActiveView('dashboard');
        }
    }, [activeView, userPermissions, user]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsData, usersData, projectsData] = await Promise.all([
                    getPlatformStats(),
                    getAllUsers(),
                    getAllProjects()
                ]);
                setStats({...statsData, totalUsers: usersData.length});
                setProjects(projectsData);
            } catch (error) {
                console.error("Failed to fetch admin dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const allNavItems: { id: AdminView; icon: string; label: string; }[] = [
        { id: 'dashboard', icon: 'dashboard', label: 'Tableau de bord' },
        { id: 'users', icon: 'group', label: 'Gestion des Utilisateurs' },
        { id: 'projects', icon: 'fact_check', label: 'Gestion des Projets' },
        { id: 'services', icon: 'construction', label: 'Gestion des Services' },
        { id: 'withdrawals', icon: 'payments', label: 'Gestion des Retraits' },
        { id: 'admins', icon: 'admin_panel_settings', label: 'Gestion des Admins' },
        { id: 'content', icon: 'article', label: 'Gestion de Contenu' },
        { id: 'analytics', icon: 'bar_chart', label: 'Analytique et Rapports' },
        { id: 'settings', icon: 'settings', label: 'Paramètres Système' },
        { id: 'general_settings', icon: 'tune', label: 'Paramètres Généraux' },
    ];
    const navItems = useMemo(() => allNavItems.filter(item => userPermissions.includes(item.id)), [userPermissions]);
    const activeViewLabel = useMemo(() => navItems.find(item => item.id === activeView)?.label || 'Tableau de bord', [navItems, activeView]);


    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-full pt-20"><Spinner /></div>;
        }
        
        switch (activeView) {
            case 'dashboard':
                return stats && user ? <DashboardHome stats={stats} projects={projects} currency={currency} userRole={user.role} /> : null;
            case 'users': return <UserManagement />;
            case 'projects': return <ProjectManagement />;
            case 'services': return <ServiceManagement />;
            case 'withdrawals': return <WithdrawalManagement />;
            case 'admins': return <AdminManagement />;
            case 'analytics': return <Analytics />;
            case 'content': return <ContentManagement />;
            case 'settings': return <SystemSettings />;
            case 'general_settings': return <GeneralSettings />;
            default: return null;
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const sidebarHeader = (
        <>
            <Link to="/" className="flex items-center gap-2 p-3 h-16 border-b border-border-light dark:border-border-dark -m-4 mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">savings</span>
                <h1 className="text-xl font-bold text-text-light-primary dark:text-white">InvestMaroc</h1>
            </Link>
            <div className="flex gap-3 items-center mt-4">
                <img className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" alt="Avatar de l'administrateur" src={user?.profilePictureUrl} />
                <div className="flex flex-col">
                    <h2 className="text-text-light dark:text-text-dark text-sm font-medium leading-tight">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-primary text-xs font-semibold leading-tight capitalize">
                        {user?.role.replace(/_/g, ' ').toLowerCase()}
                    </p>
                </div>
            </div>
        </>
    );

    const sidebarFooter = (
        <div className="flex flex-col gap-1 border-t border-border-light dark:border-border-dark pt-4">
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors duration-200 text-red-500">
                <span className="material-symbols-outlined">logout</span>
                <p className="text-sm font-medium leading-normal">Déconnexion</p>
            </a>
        </div>
    );
    
    return (
        <DashboardLayout
            sidebarHeader={sidebarHeader}
            sidebarFooter={sidebarFooter}
            navItems={navItems}
            activeViewId={activeView}
            onNavItemClick={(id) => setActiveView(id as AdminView)}
        >
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight">{activeViewLabel}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Bienvenue, {user?.firstName}.</p>
                </div>
            </div>
            {renderContent()}
        </DashboardLayout>
    );
};

export default AdminDashboard;
