import React, { useState, useEffect } from 'react';
import { getPlatformStats, getAllUsers, getAllProjects } from '../../../services/adminService';
import { User, Project, KYCStatus, ProjectStatus } from '../../../types';
import Card from '../../ui/Card';
import Spinner from '../../ui/Spinner';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

const StatCard: React.FC<{ title: string; value: string | number; currencySymbol?: string }> = ({ title, value, currencySymbol }) => (
    <Card>
        <h3 className="font-semibold text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">
            {currencySymbol ? new Intl.NumberFormat('fr-MA').format(value as number) : value} {currencySymbol || ''}
        </p>
    </Card>
);

const QuickAccessList: React.FC<{ items: any[], titleKey: string, subtitleKey: string, type: 'user' | 'project' }> = ({ items, titleKey, subtitleKey, type }) => (
    <div className="space-y-3">
        {items.slice(0, 3).map(item => (
            <div key={item.id} className="p-3 border rounded-md flex justify-between items-center bg-white hover:bg-gray-50">
                <div>
                    <p className="font-semibold">{item[titleKey]}</p>
                    <p className="text-sm text-gray-500">{item[subtitleKey]}</p>
                </div>
                <Button variant="ghost" size="sm">
                    {type === 'user' ? "Vérifier" : "Valider"}
                </Button>
            </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Aucune demande en attente.</p>}
    </div>
);

const DashboardHome = () => {
    const [stats, setStats] = useState<any>(null);
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
    const [activeProjects, setActiveProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { currency } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsData, usersData, projectsData] = await Promise.all([
                    getPlatformStats(),
                    getAllUsers(),
                    getAllProjects()
                ]);
                setStats(statsData);
                setPendingUsers(usersData.filter(u => u.kycStatus === KYCStatus.PENDING));
                setPendingProjects(projectsData.filter(p => p.status === ProjectStatus.PENDING_APPROVAL));
                setActiveProjects(projectsData.filter(p => p.status === ProjectStatus.ACTIVE));
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }

    if (!stats) {
        return <p>Erreur de chargement des données.</p>;
    }

    const formattedPendingUsers = pendingUsers.map(user => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`
    }));

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold">Aperçu de la Plateforme</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Investi" value={stats.totalInvestments} currencySymbol={currency} />
                <StatCard title="Gains de la Plateforme" value={stats.totalEarnings} currencySymbol={currency} />
                <StatCard title="Projets Actifs" value={stats.projectCounts.active} />
                <StatCard title="Utilisateurs en Attente" value={stats.userCounts.pending} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-base-100">
                    <h3 className="font-bold mb-4">Projets en Attente d'Approbation ({pendingProjects.length})</h3>
                    <QuickAccessList items={pendingProjects.map(p => ({...p, title: p.title.fr}))} titleKey="title" subtitleKey="location" type="project" />
                </Card>
                 <Card className="bg-base-100">
                    <h3 className="font-bold mb-4">Utilisateurs en Attente de Vérification ({pendingUsers.length})</h3>
                    <QuickAccessList 
                        items={formattedPendingUsers} 
                        titleKey="fullName"
                        subtitleKey="email"
                        type="user"
                     />
                </Card>
            </div>
            
            <div>
                 <h2 className="text-xl font-bold mb-4">Projets Actifs ({stats.projectCounts.active})</h2>
                 <Card>
                    {/* A simple list for now, could be a more detailed table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Projet</th>
                                    <th className="px-6 py-3">Progression</th>
                                    <th className="px-6 py-3">Superviseur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeProjects.slice(0, 3).map(p => (
                                    <tr key={p.id} className="bg-white border-b">
                                        <td className="px-6 py-4 font-semibold">{p.title.fr}</td>
                                        <td className="px-6 py-4">{Math.round((p.currentFunding / p.fundingGoal) * 100)}%</td>
                                        <td className="px-6 py-4">{p.supervisorId || 'Non assigné'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </Card>
            </div>
        </div>
    );
};

export default DashboardHome;