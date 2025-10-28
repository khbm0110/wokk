// components/dashboard/investor/InvestorDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../ui/Card';
import ProfileView from './ProfileView';
import WalletView from './WalletView';
import { getWallet, getTransactions } from '../../../services/walletService';
import { Wallet, Transaction, Project, Investment, ProjectStatus } from '../../../types';
import { getInvestedProjects } from '../../../services/projectService';
import { getInvestmentsByUser } from '../../../services/investmentService';
import { useAuth } from '../../../context/AuthContext';
import Spinner from '../../ui/Spinner';
import { useLanguage } from '../../../context/LanguageContext';
import DashboardLayout from '../../layout/DashboardLayout';

type ActiveView = 'dashboard' | 'wallet' | 'profile';

const InvestorDashboardHome: React.FC<{
    investments: Investment[];
    investedProjects: Project[];
    t: (key: string) => string;
    CURRENCY: string;
}> = ({ investments, investedProjects, t, CURRENCY }) => {
    
    const portfolioData = useMemo(() => investments.map(investment => {
        const project = investedProjects.find(p => p.id === investment.projectId);
        // Mocking return for demonstration
        const mockReturn = project?.status === ProjectStatus.COMPLETED ? investment.amount * 0.15 : investment.amount * 0.082;
        return { ...investment, project, mockReturn };
    }).filter(item => item.project), [investments, investedProjects]);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturn = portfolioData.reduce((sum, item) => sum + item.mockReturn, 0);
    const activeProjectsCount = investedProjects.filter(p => p.status === ProjectStatus.ACTIVE).length;
    
    const recentActivity = [
        { icon: 'add_card', text: 'Nouvel investissement confirmé pour AgriTech Solutions.', time: 'il y a 2 heures', color: 'success' },
        { icon: 'campaign', text: 'Eco-Builders Maroc a publié une nouvelle mise à jour du projet.', time: 'il y a 1 jour', color: 'blue' },
        { icon: 'payments', text: 'Paiement de dividende reçu du projet Artisanat Digital.', time: 'il y a 3 jours', color: 'accent' }
    ];

    return (
        <div className="space-y-8">
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-medium leading-normal">{t('investorDashboard.totalInvestment')}</p>
                        <p className="text-text-main-light dark:text-text-main-dark tracking-tight text-3xl font-bold leading-tight">{new Intl.NumberFormat('fr-MA').format(totalInvested)} {CURRENCY}</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-medium leading-normal">{t('investorDashboard.estimatedReturn')}</p>
                        <p className="text-text-main-light dark:text-text-main-dark tracking-tight text-3xl font-bold leading-tight">+{new Intl.NumberFormat('fr-MA').format(totalReturn)} {CURRENCY}</p>
                        <p className="text-success text-base font-medium leading-normal">+{((totalReturn / totalInvested) * 100 || 0).toFixed(1)}%</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-medium leading-normal">{t('investorDashboard.activeProjects')}</p>
                        <p className="text-text-main-light dark:text-text-main-dark tracking-tight text-3xl font-bold leading-tight">{activeProjectsCount}</p>
                    </div>
                </div>
            </section>
            <section>
                <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-xl border border-border-light dark:border-border-dark">
                     <h2 className="text-text-main-light dark:text-text-main-dark text-xl font-bold leading-tight tracking-tight mb-4">{t('investorDashboard.investmentPortfolio')}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-border-light dark:border-border-dark">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{t('investorDashboard.project')}</th>
                                    <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{t('investorDashboard.investedAmount')}</th>
                                    <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{t('investorDashboard.status')}</th>
                                    <th className="p-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">{t('investorDashboard.return')}</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolioData.slice(0, 5).map(({ project, amount, mockReturn }) => {
                                    return (
                                        <tr key={project!.id} className="border-b border-border-light dark:border-border-dark last:border-b-0">
                                            <td className="p-4 font-semibold text-text-main-light dark:text-text-main-dark">{project!.title.fr}</td>
                                            <td className="p-4 text-text-secondary-light dark:text-text-secondary-dark">{new Intl.NumberFormat('fr-MA').format(amount)} {CURRENCY}</td>
                                            <td className="p-4"><span className={`inline-flex items-center rounded-full bg-success-bg px-2.5 py-1 text-xs font-semibold text-success`}>{project!.status.replace('_', ' ')}</span></td>
                                            <td className="p-4 font-semibold text-success">+{new Intl.NumberFormat('fr-MA').format(mockReturn)} {CURRENCY}</td>
                                            <td className="p-4"><Link to={`/projet/${project!.id}`} className="font-semibold text-primary hover:underline">{t('investorDashboard.viewDetails')}</Link></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};


const InvestorDashboard = () => {
    const { user, logout } = useAuth();
    const { t, currency: CURRENCY } = useLanguage();
    const navigate = useNavigate();
    
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [investedProjects, setInvestedProjects] = useState<Project[]>([]);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<ActiveView>('dashboard');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [investmentsData, projectsData, walletData] = await Promise.all([
                    getInvestmentsByUser(user.id),
                    getInvestedProjects(user.id),
                    getWallet(user.id)
                ]);

                setInvestments(investmentsData);
                setInvestedProjects(projectsData);
                setWallet(walletData);

                if (walletData) {
                    const transactionsData = await getTransactions(walletData.id);
                    setTransactions(transactionsData);
                }
            } catch (error) {
                console.error("Failed to fetch investor dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { id: 'dashboard', icon: 'dashboard', label: t('dashboard') },
        { id: 'wallet', icon: 'account_balance_wallet', label: t('investorDashboard.nav.wallet') },
        { id: 'profile', icon: 'person', label: t('investorDashboard.nav.profile') },
    ];
    
    const activeViewLabel = useMemo(() => navItems.find(item => item.id === activeView)?.label || 'Tableau de bord', [navItems, activeView]);

    const sidebarHeader = (
        <>
            <Link to="/" className="flex items-center gap-2 p-3">
                <span className="material-symbols-outlined text-primary text-3xl">savings</span>
                <h1 className="text-xl font-bold text-text-light-primary dark:text-white">{t('siteName')}</h1>
            </Link>
            <div className="flex gap-3 items-center mt-4">
                <img className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" alt="User avatar" src={user?.profilePictureUrl} />
                <div className="flex flex-col">
                    <h2 className="text-text-light-primary dark:text-white text-base font-medium leading-normal">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-text-light-secondary dark:text-primary/80 text-sm font-normal leading-normal">{t('roleSelection.investorTitle')}</p>
                </div>
            </div>
        </>
    );
    
    const sidebarFooter = (
        <div className="flex flex-col gap-1 border-t border-border-light dark:border-border-dark pt-4">
             <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 w-full text-left">
                <span className="material-symbols-outlined text-text-light-primary dark:text-gray-300">logout</span>
                <p className="text-text-light-primary dark:text-gray-300 text-sm font-medium leading-normal">{t('logout')}</p>
            </button>
        </div>
    );

    const renderContent = () => {
        if(loading) {
            return <div className="flex justify-center items-center h-full pt-20"><Spinner/></div>
        }
        switch (activeView) {
            case 'dashboard':
                return <InvestorDashboardHome investments={investments} investedProjects={investedProjects} t={t} CURRENCY={CURRENCY} />;
            case 'wallet':
                return <WalletView wallet={wallet} transactions={transactions} />;
            case 'profile':
                return <Card className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6"><ProfileView /></Card>;
            default:
                return null;
        }
    };
    
    return (
        <DashboardLayout
            sidebarHeader={sidebarHeader}
            sidebarFooter={sidebarFooter}
            navItems={navItems}
            activeViewId={activeView}
            onNavItemClick={(id) => setActiveView(id as ActiveView)}
        >
             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-text-main-light dark:text-text-main-dark tracking-tight text-3xl font-bold leading-tight">{activeViewLabel}</h1>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">{t('investorDashboard.welcome')}</p>
                </div>
            </header>
            {renderContent()}
        </DashboardLayout>
    );
};

export default InvestorDashboard;
