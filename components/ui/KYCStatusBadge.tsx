import React from 'react';
import { KYCStatus } from '../../types';

const KYCStatusBadge: React.FC<{ status: KYCStatus }> = ({ status }) => {
    const styles = {
        [KYCStatus.VERIFIED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [KYCStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [KYCStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return (
        <span className={`px-2 py-1 text-sm font-semibold rounded-full ${styles[status]}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

export default KYCStatusBadge;
