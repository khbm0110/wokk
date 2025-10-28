// mobile_app/screens/MobileMyInvestmentsScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInvestedProjects } from '../../services/projectService';
import { getInvestmentsByUser } from '../../services/investmentService';
import { Project, Investment, ProjectStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const InvestmentCard: React.FC<{ investment: Investment, project?: Project }> = ({ investment, project }) => {
    const { currency } = useLanguage();
    if (!project) return null;

    const percentage = Math.round((project.currentFunding / project.fundingGoal) * 100);
    const mockReturn = project.status === ProjectStatus.COMPLETED ? investment.amount * 0.15 : 0;

    return (
        <Link to={`/mobile/project/${project.id}`} className="block bg-white dark:bg-card-dark p-4 rounded-lg shadow-md space-y-3">
            <h3 className="font-bold text-lg">{project.title}</h3>
            <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between"><span>Montant Investi:</span> <span className="font-semibold">{new Intl.NumberFormat('fr-MA').format(investment.amount)} {currency}</span></div>
                <div className="flex justify-between"><span>Statut du Projet:</span> <span className="font-semibold">{project.status.replace(/_/g, ' ')}</span></div>
                <div className="flex justify-between"><span>Rendement:</span> <span className={`font-semibold ${mockReturn > 0 ? 'text-green-600' : 'text-gray-500'}`}>+{new Intl.NumberFormat('fr-MA').format(mockReturn)} {currency}</span></div>
            </div>
            <div>
                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <p className="text-right text-xs mt-1">{percentage}% financé</p>
            </div>
        </Link>
    );
};


const MobileMyInvestmentsScreen = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [investedProjects, setInvestedProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [investmentsData, projectsData] = await Promise.all([
                    getInvestmentsByUser(user.id),
                    getInvestedProjects(user.id),
                ]);
                setInvestments(investmentsData);
                setInvestedProjects(projectsData);
            } catch (error) {
                console.error("Failed to load investments data for mobile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const portfolioData = useMemo(() => {
        return investments.map(inv => ({
            ...inv,
            project: investedProjects.find(p => p.id === inv.projectId)
        }));
    }, [investments, investedProjects]);


    if (loading) {
        return <div className="p-4 flex justify-center items-center h-full"><Spinner /></div>;
    }

    return (
        <div className="p-4 space-y-4">
             {portfolioData.length > 0 ? (
                portfolioData.map(item => <InvestmentCard key={item.id} investment={item} project={item.project} />)
             ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">Vous n'avez aucun investissement actif.</p>
                </div>
             )}
        </div>
    );
};

export default MobileMyInvestmentsScreen;
