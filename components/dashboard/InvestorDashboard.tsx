// components/dashboard/InvestorDashboard.tsx
import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Tabs from '../ui/Tabs';
import ProfileView from './investor/ProfileView';
import WalletView from './investor/WalletView';
import { getWallet, getTransactions } from '../../services/walletService';
import { Wallet, Transaction, Project } from '../../types';
import ProjectList from '../project/ProjectList'; 
import { getProjects } from '../../services/projectService';
import { useLanguage } from '../../context/LanguageContext';

const InvestorDashboard = () => {
    const { t } = useLanguage();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [investedProjects, setInvestedProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const walletData = await getWallet('usr_inv1'); // Mock user id
            const transactionsData = await getTransactions('wlt_inv1'); // Mock wallet id
            const projectsData = await getProjects(3); // Mock: show some projects as "invested"
            setWallet(walletData);
            setTransactions(transactionsData);
            setInvestedProjects(projectsData);
        };
        fetchData();
    }, []);

    const portfolioContent = (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-bold mb-4">{t('investor.myInvestments')}</h2>
                <p className="text-gray-600 mb-6">{t('investor.followProgress')}</p>
                <ProjectList projects={investedProjects} />
            </Card>
        </div>
    );

    const tabs = [
        { label: t('investorDashboard.tabs.portfolio'), content: portfolioContent },
        { label: t('investorDashboard.tabs.wallet'), content: <WalletView wallet={wallet} transactions={transactions} /> },
        { label: t('investorDashboard.tabs.profile'), content: <ProfileView /> }
    ];

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">{t('investorDashboard.title')}</h1>
            <Tabs tabs={tabs} />
        </div>
    );
};

export default InvestorDashboard;