

import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '../../ui/Card';
import { Project, ProjectStatus } from '../../../types';
import { getAllProjects, getPlatformStats } from '../../../services/adminService';
import Spinner from '../../ui/Spinner';
import { useLanguage } from '../../../context/LanguageContext';

const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#64748B', '#4f46e5'];

const Analytics = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { currency } = useLanguage();

    useEffect(() => {
        Promise.all([getAllProjects(), getPlatformStats()]).then(([projectsData, statsData]) => {
            setProjects(projectsData);
            setStats(statsData);
            setLoading(false);
        });
    }, []);

    const projectStatusData = useMemo(() => {
        if (!projects) return [];
        const statusCounts = projects.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {} as Record<ProjectStatus, number>);
        
        return Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
    }, [projects]);
    
    // Mock monthly data for visualization
    const financialData = [
        { name: 'Jan', investissements: 120000, gains: 0 },
        { name: 'Fév', investissements: 210000, gains: 0 },
        { name: 'Mar', investissements: 330000, gains: 10000 },
        { name: 'Avr', investissements: 250000, gains: 0 },
        { name: 'Mai', investissements: 480000, gains: 10000 },
        { name: 'Juin', investissements: 510000, gains: 20000 },
    ];


    if (loading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Indicateurs Clés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <Card><h3 className="font-semibold text-gray-500">Total Projets</h3><p className="text-2xl font-bold">{projects.length}</p></Card>
                 <Card><h3 className="font-semibold text-gray-500">Total Investi</h3><p className="text-2xl font-bold">{new Intl.NumberFormat('fr-MA').format(stats.totalInvestments)} {currency}</p></Card>
                 <Card><h3 className="font-semibold text-gray-500">Total Remboursé</h3><p className="text-2xl font-bold">{new Intl.NumberFormat('fr-MA').format(stats.totalRefunded)} {currency}</p></Card>
                 <Card><h3 className="font-semibold text-gray-500">Gains Plateforme</h3><p className="text-2xl font-bold text-success">{new Intl.NumberFormat('fr-MA').format(stats.totalEarnings)} {currency}</p></Card>
            </div>
            
            <h2 className="text-xl font-bold mt-8">Visualisations</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <h3 className="font-bold mb-4">Répartition des Projets par Statut</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                    {projectStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} projet(s)`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                 <Card>
                    <h3 className="font-bold mb-4">Performance Financière Mensuelle</h3>
                     <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={financialData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" orientation="left" stroke="#2563EB" />
                                <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" />
                                <Tooltip formatter={(value, name) => [`${new Intl.NumberFormat('fr-MA').format(value as number)} MAD`, name]} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="investissements" fill="#2563EB" name="Investissements" />
                                <Bar yAxisId="right" dataKey="gains" fill="#F59E0B" name="Gains Plateforme" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
