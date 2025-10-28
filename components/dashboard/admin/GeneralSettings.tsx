import React from 'react';
import Tabs from '../../ui/Tabs';
import SeoSettings from './SeoSettings';
import MaintenanceSettings from './MaintenanceSettings';
import IntegrationsSettings from './IntegrationsSettings';
import NotificationSettings from './NotificationSettings';

const GeneralSettings = () => {
    const tabs = [
        {
            label: 'Paramètres SEO',
            content: <SeoSettings />
        },
        {
            label: 'Notifications',
            content: <NotificationSettings />
        },
        {
            label: 'Intégrations',
            content: <IntegrationsSettings />
        },
        {
            label: 'Mode Maintenance',
            content: <MaintenanceSettings />
        },
    ];

    return (
        <Tabs tabs={tabs} />
    );
};

export default GeneralSettings;