// mobile_app/screens/MobileProjectDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById } from '../../services/projectService';
import { Project, Wallet, UserRole, KYCStatus, ProjectStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { getWallet } from '../../services/walletService';
import { useNotification } from '../../context/NotificationContext';
import { investInProject } from '../../services/investmentService';
import { useLanguage } from '../../context/LanguageContext';

const MobileProjectDetailsScreen = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const { t, language, currency } = useLanguage();

    const [project, setProject] = useState<Project | null>(null);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);
    const [investmentAmount, setInvestmentAmount] = useState(0);
    const [isInvesting, setIsInvesting] = useState(false);

    useEffect(() => {
        if (id) {
            Promise.all([
                getProjectById(id),
                user ? getWallet(user.id) : Promise.resolve(null)
            ]).then(([projectData, walletData]) => {
                setProject(projectData);
                setWallet(walletData);
                if (projectData) {
                    setInvestmentAmount(projectData.minimumInvestment);
                }
                setLoading(false);
            });
        }
    }, [id, user]);

    const handleInvest = async () => {
        if (!user || !project) return;
        setIsInvesting(true);
        try {
            await investInProject({
                investorId: user.id,
                projectId: project.id,
                amount: investmentAmount
            });
            addNotification("Investissement réussi !", 'success');
            navigate('/mobile/investments');
        } catch (error: any) {
            addNotification(error.message || "Erreur d'investissement.", 'error');
        } finally {
            setIsInvesting(false);
        }
    };
    
    const getButtonState = () => {
        if (!user || user.kycStatus !== KYCStatus.VERIFIED) return { disabled: true, text: "Vérification KYC requise" };
        if (project?.status !== ProjectStatus.ACTIVE) return { disabled: true, text: "Projet non actif" };
        if (!wallet || wallet.balance < investmentAmount) return { disabled: true, text: "Fonds insuffisants" };
        if (investmentAmount < (project?.minimumInvestment ?? 0)) return { disabled: true, text: `Minimum ${project?.minimumInvestment} ${currency}` };
        if ((project?.currentFunding ?? 0) + investmentAmount > (project?.fundingGoal ?? 0)) return { disabled: true, text: "Dépasse l'objectif" };
        return { disabled: false, text: "Investir Maintenant" };
    };
    
    const buttonState = getButtonState();

    if (loading) {
        return <div className="p-4 flex justify-center items-center h-full"><Spinner /></div>;
    }

    if (!project) {
        return <div className="p-4 text-center">Projet non trouvé.</div>;
    }

    const percentageFunded = Math.round((project.currentFunding / project.fundingGoal) * 100);

    return (
        <div>
            <div className="relative">
                <img src={project.imageUrl} alt={project.title[language]} className="w-full h-48 object-cover"/>
            </div>
            <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold">{project.title[language]}</h1>
                <p className="text-primary font-semibold">{project.category} - {project.location}</p>
                
                <div className="bg-white dark:bg-card-dark p-4 rounded-lg shadow-md">
                    <div className="flex justify-between text-sm">
                        <span className="font-bold">{new Intl.NumberFormat('fr-MA').format(project.currentFunding)} {currency}</span>
                        <span>{t('projectDetails.goalLabel')} {new Intl.NumberFormat('fr-MA').format(project.fundingGoal)} {currency}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentageFunded}%` }}></div>
                    </div>
                    <p className="text-right text-sm font-semibold mt-1">{percentageFunded}%</p>
                </div>
                
                <div className="bg-white dark:bg-card-dark p-4 rounded-lg shadow-md space-y-3">
                    <h2 className="font-bold text-lg">Investir</h2>
                    <p className="text-sm text-gray-500">
                        Solde: <span className="font-semibold">{new Intl.NumberFormat('fr-MA').format(wallet?.balance ?? 0)} {currency}</span>
                    </p>
                    <div>
                         <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Montant de l'investissement
                        </label>
                        <input
                            id="investmentAmount"
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-background-dark dark:border-border-dark"
                            placeholder={String(project.minimumInvestment)}
                        />
                    </div>
                    <button onClick={handleInvest} disabled={buttonState.disabled || isInvesting} className="w-full py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isInvesting ? 'Traitement...' : buttonState.text}
                    </button>
                </div>

                <div>
                    <h2 className="font-bold text-lg mb-2">Description</h2>
                    <p className="text-gray-700 dark:text-gray-300">{project.description[language]}</p>
                </div>
            </div>
        </div>
    );
};

export default MobileProjectDetailsScreen;
