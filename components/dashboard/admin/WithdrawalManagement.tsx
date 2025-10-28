// components/dashboard/admin/WithdrawalManagement.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { PopulatedWithdrawalRequest, getWithdrawalRequests, updateWithdrawalRequestStatus } from '../../../services/walletService';
import { WithdrawalStatus } from '../../../types';
import Card from '../../ui/Card';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';
import { useNotification } from '../../../context/NotificationContext';
import { useLanguage } from '../../../context/LanguageContext';

const StatusBadge: React.FC<{ status: WithdrawalStatus }> = ({ status }) => {
  const { t } = useLanguage();
  const styles = {
    [WithdrawalStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [WithdrawalStatus.APPROVED]: 'bg-blue-100 text-blue-800',
    [WithdrawalStatus.REJECTED]: 'bg-red-100 text-red-800',
    [WithdrawalStatus.COMPLETED]: 'bg-green-100 text-green-800',
  };
  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>{t(`admin.withdrawals.status.${status}`)}</span>;
}

const WithdrawalManagement = () => {
    const [requests, setRequests] = useState<PopulatedWithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const { addNotification } = useNotification();
    const { currency } = useLanguage();

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getWithdrawalRequests();
            setRequests(data);
        } catch(e) {
            addNotification("Erreur lors du chargement des demandes de retrait.", "error");
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (requestId: string, status: WithdrawalStatus) => {
        try {
            await updateWithdrawalRequestStatus(requestId, status);
            addNotification('Statut de la demande mis à jour.', 'success');
            fetchData(); // Refresh list
        } catch (error) {
            addNotification('Erreur lors de la mise à jour.', 'error');
        }
    };

    const filteredRequests = useMemo(() => {
        if (filter === 'all') return requests;
        return requests.filter(r => r.status === filter);
    }, [requests, filter]);

    if (loading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Gestion des Retraits ({filteredRequests.length})</h2>
                <select onChange={(e) => setFilter(e.target.value)} className="border rounded-md p-2">
                    <option value="all">Tous</option>
                    {Object.values(WithdrawalStatus).map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Utilisateur</th>
                            <th className="px-6 py-3">Montant</th>
                            <th className="px-6 py-3">Infos Bancaires</th>
                            <th className="px-6 py-3">Date de Demande</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => (
                            <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">{req.user.firstName} {req.user.lastName}<p className="font-normal text-gray-400">{req.user.email}</p></td>
                                <td className="px-6 py-4 font-bold">{new Intl.NumberFormat('fr-MA').format(req.amount)} {currency}</td>
                                <td className="px-6 py-4">{req.bankName}<p className="font-mono text-xs text-gray-500">{req.rib}</p></td>
                                <td className="px-6 py-4">{req.requestDate.toLocaleString('fr-FR')}</td>
                                <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                <td className="px-6 py-4">
                                    {req.status === WithdrawalStatus.PENDING && (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Button size="sm" onClick={() => handleUpdateStatus(req.id, WithdrawalStatus.APPROVED)}>Approuver</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(req.id, WithdrawalStatus.REJECTED)}>Rejeter</Button>
                                        </div>
                                    )}
                                     {req.status === WithdrawalStatus.APPROVED && (
                                        <Button size="sm" onClick={() => handleUpdateStatus(req.id, WithdrawalStatus.COMPLETED)}>Marquer comme Complété</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default WithdrawalManagement;
