import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import InvestorDashboard from '../components/dashboard/investor/InvestorDashboard';
import ProjectOwnerDashboard from '../components/dashboard/ProjectOwnerDashboard';
import AdminDashboard from '../components/dashboard/admin/AdminDashboard';
import Spinner from '../components/ui/Spinner';

const DashboardPage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }
    
    const renderDashboard = () => {
        switch (user.role) {
            case UserRole.INVESTOR:
                return <InvestorDashboard />;
            case UserRole.PROJECT_OWNER:
                return <ProjectOwnerDashboard />;
            case UserRole.SUPER_ADMIN:
            case UserRole.VALIDATOR_ADMIN:
            case UserRole.FINANCIAL_ADMIN:
            case UserRole.SERVICE_ADMIN:
                return <AdminDashboard />;
            default:
                return <p>Rôle utilisateur non reconnu.</p>;
        }
    };

    return (
        <div>
            {renderDashboard()}
        </div>
    );
};

export default DashboardPage;