// mobile_app/screens/MobileDashboardScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInvestedProjects } from '../../services/projectService';
import { getWallet } from '../../services/walletService';
import { getInvestmentsByUser } from '../../services/investmentService';
import { Project, Investment, ProjectStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const StatCard: React.FC<{ label: string, value: string, icon: string, color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-md flex items-center gap-4">
        <div className={`flex items-center justify-center size-12 rounded-full ${color}`}>
            <span className="material-symbols-outlined text-white">{icon}</span>
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-lg font-bold text-text-light dark:text-text-dark">{value}</p>
        </div>
    </div>
);


const MobileDashboardScreen = () => {
    const { user } = useAuth();
    const { currency } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [investedProjects, setInvestedProjects] = useState<Project[]>([]);
    const [walletBalance, setWalletBalance] = useState(0);

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
                setWalletBalance(walletData?.balance ?? 0);
                setInvestments(investmentsData);
            } catch (error) {
                console.error("Failed to load dashboard data for mobile", error);
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


    if (loading) {
        return <div className="p-4 flex justify-center items-center h-full"><Spinner /></div>;
    }

    return (
        <div className="p-4 space-y-6">
            <section className="grid grid-cols-1 gap-4">
                <StatCard label="Solde du Portefeuille" value={`${new Intl.NumberFormat('fr-MA').format(walletBalance)} ${currency}`} icon="account_balance_wallet" color="bg-primary" />
                <StatCard label="Total Investi" value={`${new Intl.NumberFormat('fr-MA').format(totalInvested)} ${currency}`} icon="savings" color="bg-blue-500" />
                <StatCard label="Rendement Total" value={`+${new Intl.NumberFormat('fr-MA').format(totalReturn)} ${currency}`} icon="trending_up" color="bg-green-500" />
                <StatCard label="ROI" value={`${roi.toFixed(1)}%`} icon="percent" color="bg-accent" />
            </section>

            <section>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Mes Derniers Investissements</h2>
                    <Link to="/mobile/investments" className="text-sm font-semibold text-primary">Tout voir</Link>
                </div>
                <div className="space-y-3">
                    {investedProjects.length > 0 ? (
                        investedProjects.slice(0, 3).map(p => (
                            <Link to={`/mobile/project/${p.id}`} key={p.id} className="block bg-white dark:bg-card-dark p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{p.title}</h3>
                                        <p className="text-sm text-gray-500">{p.category}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                                </div>
                            </Link>
                        ))
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
        </div>
    );
};

export default MobileDashboardScreen;
