// mobile_app/screens/MobileProfileScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KYCStatus, Investment, Project, ProjectStatus, Wallet, Transaction, TransactionType } from '../../types';
import KYCStatusBadge from '../../components/ui/KYCStatusBadge';
import Spinner from '../../components/ui/Spinner';
import { getInvestedProjects } from '../../services/projectService';
import { getWallet, getTransactions } from '../../services/walletService';
import { getInvestmentsByUser } from '../../services/investmentService';
import { useLanguage } from '../../context/LanguageContext';


const StatCard: React.FC<{ label: string, value: string, icon: string, color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-white dark:bg-card-dark p-3 rounded-xl shadow-md flex items-center gap-3">
        <div className={`flex items-center justify-center size-10 rounded-full ${color}`}>
            <span className="material-symbols-outlined text-white text-xl">{icon}</span>
        </div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-base font-bold text-text-light dark:text-text-dark">{value}</p>
        </div>
    </div>
);

const InvestmentCard: React.FC<{ investment: Investment, project?: Project }> = ({ investment, project }) => {
    const { currency } = useLanguage();
    if (!project) return null;

    return (
        <Link to={`/mobile/project/${project.id}`} className="block bg-white dark:bg-card-dark p-4 rounded-lg shadow-md space-y-3">
            <h3 className="font-bold text-lg">{project.title}</h3>
            <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between"><span>Montant Investi:</span> <span className="font-semibold">{new Intl.NumberFormat('fr-MA').format(investment.amount)} {currency}</span></div>
                <div className="flex justify-between"><span>Statut du Projet:</span> <span className="font-semibold">{project.status.replace(/_/g, ' ')}</span></div>
            </div>
        </Link>
    );
};


const ProfileMenuItem: React.FC<{ icon: string; label: string; onClick?: () => void; isDestructive?: boolean }> = ({ icon, label, onClick, isDestructive }) => (
    <button onClick={onClick} className={`w-full flex items-center p-4 text-left ${isDestructive ? 'text-red-600' : 'text-text-light dark:text-text-dark'}`}>
        <span className="material-symbols-outlined mr-4">{icon}</span>
        <span className="flex-grow font-medium">{label}</span>
        {!isDestructive && <span className="material-symbols-outlined text-gray-400">chevron_right</span>}
    </button>
);

const MobileProfileScreen = () => {
    const { user, logout } = useAuth();
    const { currency } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [investedProjects, setInvestedProjects] = useState<Project[]>([]);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [projectsData, walletData, investmentsData] = await Promise.all([
                    getInvestedProjects(user.id),
                    getWallet(user.id),
                    getInvestmentsByUser(user.id),
                ]);
                setInvestedProjects(projectsData);
                setWallet(walletData);
                setInvestments(investmentsData);

                if (walletData) {
                    const transactionsData = await getTransactions(walletData.id);
                    setTransactions(transactionsData);
                }
            } catch (error) {
                console.error("Failed to load profile data for mobile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);
    
    const { totalInvested, totalReturn, roi } = useMemo(() => {
        const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalReturn = investments.reduce((sum, investment) => {
            const project = investedProjects.find(p => p.id === investment.projectId);
            if (project?.status === ProjectStatus.COMPLETED) {
                return sum + (investment.amount * 0.15); // Mock return of 15%
            }
            return sum;
        }, 0);
        const roi = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
        return { totalInvested, totalReturn, roi };
    }, [investments, investedProjects]);

    const portfolioData = useMemo(() => {
        return investments.map(inv => ({
            ...inv,
            project: investedProjects.find(p => p.id === inv.projectId)
        })).sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [investments, investedProjects]);


    const handleLogout = () => {
        logout();
        navigate('/mobile/login', { replace: true });
    };

    if (loading || !user) {
        return <div className="p-4 flex justify-center items-center h-full"><Spinner /></div>;
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-col items-center text-center">
                <img 
                    src={user.profilePictureUrl} 
                    alt="Profile" 
                    className="size-24 rounded-full object-cover mb-4 border-4 border-white dark:border-card-dark shadow-lg"
                />
                <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-2">
                    <KYCStatusBadge status={user.kycStatus} />
                </div>
            </div>

            <div className="bg-primary text-white p-6 rounded-xl shadow-lg text-center">
                <p className="text-sm opacity-80">Solde Actuel</p>
                <p className="text-4xl font-bold mt-1">{new Intl.NumberFormat('fr-MA').format(wallet?.balance || 0)} {currency}</p>
            </div>

            <section className="grid grid-cols-2 gap-4">
                <Link to="/mobile/deposit" className="flex items-center justify-center gap-2 p-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined">add_card</span>
                    <span>Déposer</span>
                </Link>
                <Link to="/mobile/withdraw" className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                    <span className="material-symbols-outlined">payments</span>
                    <span>Retirer</span>
                </Link>
            </section>

            <section className="grid grid-cols-2 gap-4">
                 <StatCard label="Projets Investis" value={`${investedProjects.length}`} icon="rocket_launch" color="bg-accent" />
                <StatCard label="Total Investi" value={`${new Intl.NumberFormat('fr-MA').format(totalInvested)} ${currency}`} icon="savings" color="bg-blue-500" />
                <StatCard label="Rendement" value={`+${new Intl.NumberFormat('fr-MA').format(totalReturn)} ${currency}`} icon="trending_up" color="bg-green-500" />
                <StatCard label="ROI" value={`${roi.toFixed(1)}%`} icon="percent" color="bg-accent" />
            </section>
            
            <section>
                <h2 className="text-lg font-semibold mb-2">Mes Investissements</h2>
                <div className="space-y-3">
                    {portfolioData.length > 0 ? (
                        portfolioData.slice(0, 3).map(item => item.project ? <InvestmentCard key={item.id} investment={item} project={item.project} /> : null)
                    ) : (
                         <div className="bg-white dark:bg-card-dark p-6 rounded-lg shadow-md text-center">
                            <p className="text-gray-500">Vous n'avez pas encore investi.</p>
                             <Link to="/mobile/projects" className="mt-4 inline-block bg-primary text-white font-semibold py-2 px-4 rounded-lg">
                                Découvrir les projets
                            </Link>
                         </div>
                    )}
                </div>
            </section>
            
            <section>
                <h2 className="text-lg font-semibold mb-2">Historique des Transactions</h2>
                <div className="space-y-3">
                    {transactions.length > 0 ? transactions.map(t => (
                        <div key={t.id} className="bg-white dark:bg-card-dark p-4 rounded-lg shadow-md flex items-center">
                            <div className={`flex items-center justify-center size-10 rounded-full mr-4 ${t.type === TransactionType.DEPOSIT ? 'bg-green-100' : 'bg-red-100'}`}>
                                <span className={`material-symbols-outlined ${t.type === TransactionType.DEPOSIT ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === TransactionType.DEPOSIT ? 'add' : 'remove'}
                                </span>
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{t.description}</p>
                                <p className="text-xs text-gray-500">{t.date.toLocaleDateString('fr-FR')}</p>
                            </div>
                            <span className={`font-bold ${t.type === TransactionType.DEPOSIT ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === TransactionType.DEPOSIT ? '+' : '-'} {t.amount} {currency}
                            </span>
                        </div>
                    )) : <p className="text-center text-gray-500 py-6">Aucune transaction.</p>}
                </div>
            </section>

            {user.kycStatus !== KYCStatus.VERIFIED && (
                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-center border-yellow-200 dark:border-yellow-800">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200">Votre compte n'est pas encore vérifié.</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">Vous devez compléter la vérification pour pouvoir investir.</p>
                </div>
            )}

            <div className="bg-white dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-border-light dark:divide-border-dark">
                    <li><ProfileMenuItem icon="account_circle" label="Modifier le profil" /></li>
                    <li><ProfileMenuItem icon="lock" label="Changer le mot de passe" /></li>
                    <li><ProfileMenuItem icon="notifications" label="Notifications" /></li>
                    <li><ProfileMenuItem icon="help_outline" label="Aide & Support" /></li>
                </ul>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
                 <ProfileMenuItem icon="logout" label="Déconnexion" onClick={handleLogout} isDestructive />
            </div>

        </div>
    );
};

export default MobileProfileScreen;
