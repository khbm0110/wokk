// components/project/ProjectDetails.tsx
import React, { useState, useEffect } from 'react';
import { Project, UserRole, KYCStatus, ProjectStatus, Wallet } from '../../types';
import ProjectOwnerProfile from './ProjectOwnerProfile';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { investInProject, investInProjectDirectly } from '../../services/investmentService';
import { getWallet } from '../../services/walletService';
import Spinner from '../ui/Spinner';
import { useLanguage } from '../../context/LanguageContext';
import ProjectRoadmap from './ProjectRoadmap';
import ProjectStageBadge from './ProjectStageBadge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


interface ProjectDetailsProps {
    project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
    const { addNotification } = useNotification();
    const { user, isAuthenticated } = useAuth();
    const { t, language, currency } = useLanguage();
    const [isInvesting, setIsInvesting] = useState(false);
    const [isDirectInvesting, setIsDirectInvesting] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [investmentAmount, setInvestmentAmount] = useState(project.minimumInvestment);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loadingWallet, setLoadingWallet] = useState(true);

    const numberFormat = new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA');

    const percentageFunded = Math.round((project.currentFunding / project.fundingGoal) * 100);
    const daysLeft = Math.max(0, Math.ceil((project.deadline.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

    useEffect(() => {
        const fetchWallet = async () => {
            if (user && user.role === UserRole.INVESTOR) {
                setLoadingWallet(true);
                try {
                    const walletData = await getWallet(user.id);
                    setWallet(walletData);
                } catch (error) {
                    console.error("Failed to fetch wallet:", error);
                } finally {
                    setLoadingWallet(false);
                }
            } else {
                setLoadingWallet(false);
            }
        };
        fetchWallet();
    }, [user]);

    const handleWalletInvestClick = async () => {
        if (!user) return;
        setIsInvesting(true);
        try {
            await investInProject({
                investorId: user.id,
                projectId: project.id,
                amount: investmentAmount
            });
            addNotification(t('projectDetails.investmentSuccess'), "success");
        } catch (error: any) {
            console.error("Investment failed:", error);
            addNotification(error.message || t('projectDetails.investmentError'), "error");
        } finally {
            setIsInvesting(false);
        }
    };
    
    const handleDirectInvestClick = () => {
      setIsPaymentModalOpen(true);
    };

    const handleConfirmDirectInvestment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsDirectInvesting(true);
        try {
            await investInProjectDirectly({
                investorId: user.id,
                projectId: project.id,
                amount: investmentAmount
            });
            addNotification(t('investment.directSuccess'), "success");
            setIsPaymentModalOpen(false);
            // In a real app, refetch project data.
        } catch (error: any) {
            console.error("Direct investment failed:", error);
            addNotification(error.message || t('investment.directError'), "error");
        } finally {
            setIsDirectInvesting(false);
        }
    };

    const getBaseButtonState = () => {
        if (!isAuthenticated || !user || user.role !== UserRole.INVESTOR) {
            return { disabled: true, text: t('projectDetails.loginToInvest') };
        }
        if (user.kycStatus !== KYCStatus.VERIFIED) {
            return { disabled: true, text: t('projectDetails.kycRequired') };
        }
        if (project.status !== ProjectStatus.ACTIVE) {
            return { disabled: true, text: t('projectDetails.projectNotActive') };
        }
         if (investmentAmount < project.minimumInvestment) {
             return { disabled: true, text: t('projectDetails.minimumAmount', {amount: project.minimumInvestment, currency: currency}) };
        }
        if (project.currentFunding + investmentAmount > project.fundingGoal) {
            return { disabled: true, text: t('projectDetails.exceedsGoal') };
        }
        return { disabled: false, text: '' }; // No error
    };

    const getWalletButtonState = () => {
        const baseState = getBaseButtonState();
        if(baseState.disabled) return baseState;
        
        if (loadingWallet) {
            return { disabled: true, text: t('projectDetails.loadingWallet') };
        }
        if (!wallet || wallet.balance < investmentAmount) {
            return { disabled: true, text: t('projectDetails.insufficientFunds') };
        }
        
        return { disabled: false, text: t('projectDetails.investFromWallet') };
    };
    
    const getCardButtonState = () => {
        const baseState = getBaseButtonState();
        if(baseState.disabled) return baseState;
        
        return { disabled: false, text: t('projectDetails.investByCard') };
    }

    const walletButtonState = getWalletButtonState();
    const cardButtonState = getCardButtonState();


    return (
        <>
        <div className="bg-background-light dark:bg-background-dark">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <img src={project.imageUrl} alt={project.title[language]} className="w-full h-96 object-cover rounded-xl shadow-lg mb-8" />
                        
                        <div className="flex flex-wrap gap-4 items-center mb-2">
                             <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">{project.title[language]}</h1>
                             <ProjectStageBadge stage={project.stage} />
                        </div>
                       
                        <p className="text-gray-500 dark:text-gray-400 mb-6">{project.location}</p>
                        
                        <div className="flex items-center gap-4 mb-6 text-lg p-4 bg-primary/10 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-3xl">pie_chart</span>
                                <span className="font-bold text-text-light dark:text-text-dark">{t('projectDetails.equityOffered')}: {project.equityOffered}%</span>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                            <h2 className="font-bold text-xl mb-4 text-text-light dark:text-text-dark">{t('projectDetails.description')}</h2>
                            <p>{project.description[language]}</p>
                        </div>
                        
                        {project.financials && project.financials.length > 0 && (
                            <div className="mt-12">
                                <h2 className="font-bold text-2xl mb-8 text-text-light dark:text-text-dark">{t('financials.title')}</h2>
                                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark" style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={project.financials} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)"/>
                                            <XAxis dataKey="year" tickLine={false} axisLine={false} />
                                            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                                            <Tooltip formatter={(value: number, name: string) => [`${new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA').format(value)} ${currency}`, t(`financials.${name}`)]} />
                                            <Legend formatter={(value) => t(`financials.${value}`)} />
                                            <Bar dataKey="revenue" fill="#06e0ca" name="revenue" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="profit" fill="#F59E0B" name="profit" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {project.roadmap && project.roadmap.length > 0 && (
                            <div className="mt-12">
                                <h2 className="font-bold text-2xl mb-8 text-text-light dark:text-text-dark">{t('projectDetails.roadmap')}</h2>
                                <ProjectRoadmap project={project} />
                            </div>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark shadow-sm">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-2xl font-bold text-primary">{numberFormat.format(project.currentFunding)} {currency}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{t('projectDetails.raisedOf')} {numberFormat.format(project.fundingGoal)}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentageFunded}%` }}></div>
                            </div>
                            <div className="flex justify-between text-sm text-neutral dark:text-text-dark font-semibold">
                                <span>{percentageFunded}% {t('projectDetails.funded')}</span>
                                <span>{daysLeft} {t('projectDetails.daysLeft')}</span>
                            </div>
                        </div>

                        <div className="p-6 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark shadow-sm text-center">
                            <h3 className="font-bold text-lg mb-4 text-text-light dark:text-text-dark">{t('projectDetails.investInProject')}</h3>
                             {loadingWallet && user?.role === UserRole.INVESTOR ? <Spinner/> : (
                                <>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                        {t('projectDetails.minInvestment')} <span className="font-bold">{numberFormat.format(project.minimumInvestment)} {currency}</span>.
                                    </p>
                                    <Input 
                                        label={t('projectDetails.investmentAmount')}
                                        id="investmentAmount" 
                                        type="number" 
                                        placeholder={String(project.minimumInvestment)}
                                        value={investmentAmount}
                                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                        disabled={isInvesting || isDirectInvesting}
                                    />
                                    <div className="mt-4 space-y-3">
                                        <Button 
                                            className="w-full" 
                                            onClick={handleWalletInvestClick}
                                            isLoading={isInvesting}
                                            disabled={walletButtonState.disabled || isDirectInvesting}
                                        >
                                            {walletButtonState.disabled ? walletButtonState.text : `${t('projectDetails.investFromWallet')} (${numberFormat.format(wallet?.balance || 0)} ${currency})`}
                                        </Button>
                                        <Button 
                                            variant="secondary"
                                            className="w-full" 
                                            onClick={handleDirectInvestClick}
                                            disabled={cardButtonState.disabled || isInvesting || isDirectInvesting}
                                        >
                                            {cardButtonState.text}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        {project.owner && <ProjectOwnerProfile owner={project.owner} />}

                    </div>
                </div>
            </div>
        </div>
        {isPaymentModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={() => setIsPaymentModalOpen(false)}>
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                    <form onSubmit={handleConfirmDirectInvestment}>
                        <div className="flex justify-between items-center p-6 border-b border-border-light dark:border-border-dark">
                            <h2 className="text-xl font-bold text-text-light-primary dark:text-white">{t('paymentModal.title')}</h2>
                            <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="text-sm bg-gray-50 dark:bg-card-dark/50 p-3 rounded-lg">
                                <p className="flex justify-between">{t('paymentModal.project')} <span className="font-bold text-right">{project.title[language]}</span></p>
                                <p className="flex justify-between mt-1">{t('paymentModal.amount')} <span className="font-bold text-primary">{numberFormat.format(investmentAmount)} {currency}</span></p>
                            </div>

                            <h3 className="font-bold text-lg pt-2">{t('paymentModal.cardInfo')}</h3>
                            
                            <Input label={t('paymentModal.cardNumber')} id="cardNumber" type="text" placeholder="0000 0000 0000 0000" required />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label={t('paymentModal.expiry')} id="expiry" type="text" placeholder="MM/AA" required />
                                <Input label={t('paymentModal.cvc')} id="cvc" type="text" placeholder="123" required />
                            </div>
                        </div>

                        <div className="p-6 mt-auto border-t border-border-light dark:border-border-dark flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>{t('paymentModal.cancel')}</Button>
                            <Button type="submit" isLoading={isDirectInvesting} disabled={isDirectInvesting}>
                                {t('paymentModal.confirm', {amount: numberFormat.format(investmentAmount), currency: currency})}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
};

export default ProjectDetails;
