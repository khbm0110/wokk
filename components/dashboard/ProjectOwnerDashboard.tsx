import React, { useState, useEffect, useMemo } from 'react';
import Card from '../ui/Card';
import { Project, ProjectStatus, KYCStatus } from '../../types';
import ProjectSubmissionForm from '../project/ProjectSubmissionForm';
import { useAuth } from '../../context/AuthContext';
import ProjectList from './project-owner/ProjectList';
import Profile from './project-owner/Profile';
import Notifications from './project-owner/Notifications';
import { getProjectsByOwner } from '../../services/projectService';
import { mockInvestments } from '../../services/mockData';
import Spinner from '../ui/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import ServicesView from './project-owner/ServicesView';
import { useLanguage } from '../../context/LanguageContext';
import DashboardLayout from '../layout/DashboardLayout';

type ActiveView = 'dashboard' | 'projects' | 'submit' | 'messages' | 'profile' | 'settings' | 'services';

const DashboardView: React.FC<{stats: any, projects: Project[], setActiveView: (view: ActiveView) => void}> = ({ stats, projects, setActiveView }) => {
    const { t, currency } = useLanguage();
    return (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                <p className="text-text-light-primary dark:text-gray-300 text-base font-medium leading-normal">{t('poDashboard.stats.raised', { currency: currency })}</p>
                <p className="text-text-light-primary dark:text-white tracking-light text-3xl font-bold leading-tight">{new Intl.NumberFormat('fr-MA').format(stats.totalRaised)}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                <p className="text-text-light-primary dark:text-gray-300 text-base font-medium leading-normal">{t('poDashboard.stats.investors')}</p>
                <p className="text-text-light-primary dark:text-white tracking-light text-3xl font-bold leading-tight">{stats.totalInvestors}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                <p className="text-text-light-primary dark:text-gray-300 text-base font-medium leading-normal">{t('poDashboard.stats.activeProjects')}</p>
                <p className="text-text-light-primary dark:text-white tracking-light text-3xl font-bold leading-tight">{stats.activeProjectsCount}</p>
            </div>
        </div>
        
        <div className="flex flex-col gap-6 mb-10">
            <div className="flex justify-between items-center">
                <h2 className="text-text-light-primary dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">{t('poDashboard.projects.manage')}</h2>
                <button onClick={() => setActiveView('submit')} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white gap-2 pl-3 text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-lg">add</span>
                    <span className="truncate">{t('poDashboard.projects.new')}</span>
                </button>
            </div>
            <ProjectList projects={projects} />
        </div>
    </>
)};

const ProjectOwnerDashboard = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState<ActiveView>('dashboard');
    const [myProjects, setMyProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwnerProjects = async () => {
            if (user) {
                setLoading(true);
                try {
                    const projects = await getProjectsByOwner(user.id);
                    setMyProjects(projects);
                } catch (err: any) {
                    console.error("Failed to fetch owner's projects:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOwnerProjects();
    }, [user]);
    
    const stats = useMemo(() => {
        const totalRaised = myProjects
            .filter(p => p.status === ProjectStatus.FUNDED || p.status === ProjectStatus.ACTIVE || p.status === ProjectStatus.COMPLETED)
            .reduce((sum, p) => sum + p.currentFunding, 0);
        
        const activeProjectsCount = myProjects.filter(p => p.status === ProjectStatus.ACTIVE).length;

        const projectIds = myProjects.map(p => p.id);
        const investorIds = new Set(
            mockInvestments.filter(inv => projectIds.includes(inv.projectId)).map(inv => inv.userId)
        );
        const totalInvestors = investorIds.size;

        return { totalRaised, activeProjectsCount, totalInvestors };
    }, [myProjects]);


    if (user?.kycStatus !== KYCStatus.VERIFIED) {
        return (
            <div className="container mx-auto px-6 py-8 text-center">
                <Card>
                    <h2 className="text-2xl font-bold">{t('poDashboard.verification.title')}</h2>
                     <p className="mt-4 text-gray-600">
                        {t('poDashboard.verification.desc')}
                        <br/>
                        {t('poDashboard.verification.status')} <span className="font-semibold text-yellow-600">{user?.kycStatus}</span>
                    </p>
                </Card>
            </div>
        );
    }

    const navItems = [
        { id: 'dashboard', icon: 'dashboard', label: t('poDashboard.nav.dashboard') },
        { id: 'projects', icon: 'folder', label: t('poDashboard.nav.myProjects') },
        { id: 'services', icon: 'design_services', label: t('poDashboard.nav.services') },
        { id: 'messages', icon: 'chat_bubble', label: t('poDashboard.nav.messages') },
        { id: 'profile', icon: 'person', label: t('poDashboard.nav.profile') },
        { id: 'settings', icon: 'settings', label: t('poDashboard.nav.settings') }
    ];
    
    const activeViewLabel = useMemo(() => navItems.find(item => item.id === activeView)?.label || 'Tableau de bord', [navItems, activeView]);

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-full pt-20"><Spinner/></div>
        }
        switch (activeView) {
            case 'dashboard':
                return <DashboardView stats={stats} projects={myProjects} setActiveView={setActiveView} />;
            case 'projects':
                return <Card className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6"><ProjectList projects={myProjects} /></Card>;
            case 'services':
                return <ServicesView />;
            case 'submit':
                return <Card className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6"><ProjectSubmissionForm /></Card>;
            case 'messages':
                return <Card className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6"><Notifications /></Card>;
            case 'profile':
                return <Profile />;
            case 'settings':
                 return <Card className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6"><h2>{t('poDashboard.nav.settings')}</h2><p>{t('poDashboard.settings.wip')}</p></Card>;
            default:
                return null;
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const sidebarHeader = (
        <>
            <Link to="/" className="flex items-center gap-2 p-3">
                <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
                <h1 className="text-xl font-bold text-text-light-primary dark:text-white">{t('siteName')}</h1>
            </Link>
            <div className="flex gap-3 items-center mt-4">
                <img className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" alt="User avatar" src={user?.profilePictureUrl} />
                <div className="flex flex-col">
                    <h2 className="text-text-light-primary dark:text-white text-base font-medium leading-normal">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-text-light-secondary dark:text-primary/80 text-sm font-normal leading-normal">{t('poDashboard.projectOwnerRole')}</p>
                </div>
            </div>
        </>
    );

    const sidebarFooter = (
        <div className="flex flex-col gap-4">
            <button onClick={() => setActiveView('submit')} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                <span className="truncate">{t('poDashboard.nav.submitProject')}</span>
            </button>
            <div className="flex flex-col gap-1 border-t border-border-light dark:border-border-dark pt-4">
                 <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 w-full text-left">
                    <span className="material-symbols-outlined text-text-light-primary dark:text-gray-300">logout</span>
                    <p className="text-text-light-primary dark:text-gray-300 text-sm font-medium leading-normal">{t('logout')}</p>
                </button>
            </div>
        </div>
    );


    return (
        <DashboardLayout
            sidebarHeader={sidebarHeader}
            sidebarFooter={sidebarFooter}
            navItems={navItems}
            activeViewId={activeView}
            onNavItemClick={(id) => setActiveView(id as ActiveView)}
        >
            <div className="flex flex-wrap justify-between gap-3 mb-8">
                <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-text-light-primary dark:text-white text-3xl font-bold leading-tight tracking-tight">{activeViewLabel}</p>
                    <p className="text-text-light-secondary dark:text-primary/80 text-base font-normal leading-normal">{t('poDashboard.header.subtitle')}</p>
                </div>
            </div>
            {renderContent()}
        </DashboardLayout>
    );
};

export default ProjectOwnerDashboard;
