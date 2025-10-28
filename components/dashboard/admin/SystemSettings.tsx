// components/dashboard/admin/SystemSettings.tsx
import React from 'react';
import Tabs from '../../ui/Tabs';
import TransactionSettings from './TransactionSettings';
import ProjectRulesSettings from './ProjectRulesSettings';
import SecuritySettings from './SecuritySettings';
import PerformanceSettings from './PerformanceSettings';
import PaymentGatewaySettings from './LocalPaymentGateways';

const SystemSettings = () => {
    const tabs = [
        {
            label: 'Transactions et Frais',
            content: <TransactionSettings />
        },
        {
            label: 'Règles des Projets',
            content: <ProjectRulesSettings />
        },
        {
            label: 'Sécurité',
            content: <SecuritySettings />
        },
        {
            label: 'Performance',
            content: <PerformanceSettings />
        },
        {
            label: 'Paiements',
            content: <PaymentGatewaySettings />
        },
    ];

    return (
        <Tabs tabs={tabs} />
    );
};

export default SystemSettings;