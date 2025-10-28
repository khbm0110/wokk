// components/dashboard/admin/AdminManagement.tsx
import React, { useState, useEffect } from 'react';
import { getAdmins, inviteAdmin } from '../../../services/adminService';
import { User, UserRole } from '../../../types';
import Card from '../../ui/Card';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { useNotification } from '../../../context/NotificationContext';

// New Modal Component for inviting admins
const InviteAdminModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string, role: UserRole) => Promise<void>;
}> = ({ isOpen, onClose, onInvite }) => {
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.VALIDATOR_ADMIN);
    const [isInviting, setIsInviting] = useState(false);
    const { addNotification } = useNotification();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail || !/\S+@\S+\.\S+/.test(inviteEmail)) {
            addNotification("Veuillez entrer une adresse email valide.", "error");
            return;
        }
        setIsInviting(true);
        try {
            await onInvite(inviteEmail, selectedRole);
            setInviteEmail('');
            setSelectedRole(UserRole.VALIDATOR_ADMIN);
            onClose(); // Close modal on success
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-2xl w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Inviter un nouvel administrateur</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">L'utilisateur recevra une invitation par e-mail pour créer un compte avec le rôle assigné. Son compte sera activé sans nécessiter de vérification d'identité (KYC).</p>
                    
                    <Input
                        label="Adresse Email"
                        id="invite-email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="exemple@investmaroc.com"
                        disabled={isInviting}
                        required
                    />

                    <div>
                        <label htmlFor="admin-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Assigner un Rôle
                        </label>
                        <select
                            id="admin-role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-border-dark dark:bg-card-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                            disabled={isInviting}
                        >
                            <option value={UserRole.VALIDATOR_ADMIN}>Validateur</option>
                            <option value={UserRole.FINANCIAL_ADMIN}>Financier</option>
                            <option value={UserRole.SERVICE_ADMIN}>Gestionnaire de Services</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                        <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
                        <Button type="submit" isLoading={isInviting} disabled={isInviting}>
                            Envoyer l'invitation
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminManagement = () => {
    const [admins, setAdmins] = useState<Partial<User>[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const adminsData = await getAdmins();
                setAdmins(adminsData);
            } catch (error) {
                addNotification("Erreur lors de la récupération des administrateurs.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchAdmins();
    }, []);

    const handleInvite = async (email: string, role: UserRole) => {
        try {
            await inviteAdmin(email, role);
            addNotification(`Invitation envoyée avec succès à ${email} avec le rôle de ${formatRole(role)}.`, "success");
        } catch (error) {
            addNotification("Erreur lors de l'envoi de l'invitation.", "error");
        }
    };

    const formatRole = (role: UserRole | undefined) => {
        if (!role) return 'N/A';
        switch (role) {
            case UserRole.SUPER_ADMIN:
                return 'Super Admin';
            case UserRole.VALIDATOR_ADMIN:
                return 'Validateur';
            case UserRole.FINANCIAL_ADMIN:
                return 'Financier';
            case UserRole.SERVICE_ADMIN:
                return 'Gestionnaire de Services';
            default:
                return role;
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }

    return (
        <div className="space-y-8">
            <InviteAdminModal 
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
            />
            
            <Card className="bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-border-light dark:border-border-dark">
                    <div>
                        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Administrateurs Actuels ({admins.length})</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérer les accès et les rôles de l'équipe d'administration.</p>
                    </div>
                    <Button onClick={() => setIsInviteModalOpen(true)} className="w-full sm:w-auto">
                        <span className="material-symbols-outlined mr-2">person_add</span>
                        Inviter un Admin
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-card-dark/50">
                            <tr>
                                <th className="px-6 py-3">Nom</th>
                                <th className="px-6 py-3">Rôle</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Inscrit le</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map(admin => (
                                <tr key={admin.id} className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark last:border-b-0 hover:bg-gray-50 dark:hover:bg-card-dark/80">
                                    <td className="px-6 py-4 font-semibold text-text-light dark:text-text-dark">{admin.firstName} {admin.lastName}</td>
                                    <td className="px-6 py-4 font-medium">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            admin.role === UserRole.SUPER_ADMIN ? 'bg-primary/20 text-primary' :
                                            admin.role === UserRole.VALIDATOR_ADMIN ? 'bg-blue-100 text-blue-800' :
                                            admin.role === UserRole.SERVICE_ADMIN ? 'bg-green-100 text-green-800' :
                                            'bg-amber-100 text-amber-800'
                                        }`}>
                                            {formatRole(admin.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{admin.email}</td>
                                    <td className="px-6 py-4">{admin.createdAt?.toLocaleDateString('fr-FR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminManagement;