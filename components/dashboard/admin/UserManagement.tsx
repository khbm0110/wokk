
import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, updateUserStatus } from '../../../services/adminService';
import { User, KYCStatus } from '../../../types';
import Card from '../../ui/Card';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';
import { useNotification } from '../../../context/NotificationContext';
import KYCStatusBadge from '../../ui/KYCStatusBadge';

const ActionModal: React.FC<{ user: User, action: 'approve' | 'reject', onClose: () => void, onConfirm: (user: User, message: string) => void }> = ({ user, action, onClose, onConfirm }) => {
    const [message, setMessage] = useState('');
    const title = action === 'approve' ? 'Approuver' : 'Rejeter';
    const defaultMessage = action === 'approve' 
        ? `Bonjour ${user.firstName}, félicitations ! Votre compte a été vérifié et approuvé. Vous pouvez maintenant commencer.`
        : `Bonjour ${user.firstName}, nous avons rencontré un problème lors de la vérification de votre compte. Veuillez consulter vos emails pour plus de détails ou contacter le support.`;

    useEffect(() => {
        setMessage(defaultMessage);
    }, [defaultMessage]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">{title} l'utilisateur: {user.firstName} {user.lastName}</h2>
                <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full p-2 border rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">Ce message sera envoyé à l'utilisateur.</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="ghost" onClick={onClose}>Annuler</Button>
                    <Button variant={action === 'approve' ? 'primary' : 'danger'} onClick={() => onConfirm(user, message)}>
                        Confirmer et Envoyer
                    </Button>
                </div>
            </div>
        </div>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [modalState, setModalState] = useState<{ user: User; action: 'approve' | 'reject' } | null>(null);
    const { addNotification } = useNotification();

    useEffect(() => {
        getAllUsers().then(data => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    const handleActionConfirm = async (user: User, message: string) => {
        const newStatus = modalState?.action === 'approve' ? KYCStatus.VERIFIED : KYCStatus.REJECTED;
        try {
            await updateUserStatus(user.id, newStatus, message);
            setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, kycStatus: newStatus } : u));
            addNotification(`Statut de l'utilisateur ${user.firstName} mis à jour.`, 'success');
        } catch (error) {
            addNotification(`Erreur lors de la mise à jour.`, 'error');
        } finally {
            setModalState(null);
        }
    };

    const filteredUsers = useMemo(() => {
        if (filter === 'all') return users;
        return users.filter(u => u.kycStatus === filter);
    }, [users, filter]);

    if (loading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }

    return (
        <Card>
            {modalState && <ActionModal {...modalState} onClose={() => setModalState(null)} onConfirm={handleActionConfirm} />}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Gestion des Utilisateurs ({filteredUsers.length})</h2>
                <select onChange={(e) => setFilter(e.target.value)} className="border rounded-md p-2">
                    <option value="all">Tous</option>
                    <option value={KYCStatus.PENDING}>En attente</option>
                    <option value={KYCStatus.VERIFIED}>Vérifié</option>
                    <option value={KYCStatus.REJECTED}>Rejeté</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nom</th>
                            <th className="px-6 py-3">Rôle</th>
                            <th className="px-6 py-3">Statut KYC</th>
                            <th className="px-6 py-3">Vérifications</th>
                            <th className="px-6 py-3">Inscrit le</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">{user.firstName} {user.lastName}<p className="font-normal text-gray-400">{user.email}</p></td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4"><KYCStatusBadge status={user.kycStatus} /></td>
                                <td className="px-6 py-4">
                                    <p>Tél: {user.phoneVerified ? '✅' : '❌'}</p>
                                    <p>Identité: {user.kycStatus === KYCStatus.VERIFIED ? '✅' : '⏳'}</p>
                                </td>
                                <td className="px-6 py-4">{user.createdAt.toLocaleDateString('fr-FR')}</td>
                                <td className="px-6 py-4">
                                    {user.kycStatus === KYCStatus.PENDING && (
                                        <div className="flex space-x-2">
                                            <Button size="sm" onClick={() => setModalState({ user, action: 'approve' })}>Approuver</Button>
                                            <Button size="sm" variant="danger" onClick={() => setModalState({ user, action: 'reject' })}>Rejeter</Button>
                                        </div>
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

export default UserManagement;