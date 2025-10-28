import React from 'react';
import { AdminServiceRequest } from '../../../services/professionalService';
import { ServiceStatus } from '../../../types';
import Button from '../../ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

interface ServiceRequestModalProps {
    request: AdminServiceRequest | null;
    onClose: () => void;
    onStatusUpdate: (requestId: string, newStatus: ServiceStatus) => void;
    isUpdating: boolean;
}

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode; }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-border-light dark:border-border-dark/50">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-sm font-semibold text-right">{value}</span>
    </div>
);

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ request, onClose, onStatusUpdate, isUpdating }) => {
    const { language, currency: CURRENCY } = useLanguage();
    if (!request) return null;

    const { user, service, status, requestDate } = request;

    const handleWhatsAppClick = () => {
        const phoneNumber = user.phone.replace('+', '');
        window.open(`https://wa.me/${phoneNumber}?text=Bonjour%20${user.firstName},%20concernant%20votre%20demande%20pour%20le%20service%20'${service.title[language]}'%20sur%20InvestMaroc...`, '_blank');
    };

    const renderActions = () => {
        const actionButtons: React.ReactNode[] = [];

        switch (status) {
            case ServiceStatus.PENDING:
                actionButtons.push(
                    <Button key="approve" onClick={() => onStatusUpdate(request.id, ServiceStatus.AWAITING_PAYMENT)} isLoading={isUpdating}>
                        Approuver pour Paiement
                    </Button>
                );
                break;
            case ServiceStatus.AWAITING_PAYMENT:
                actionButtons.push(
                    <Button key="confirm_payment" onClick={() => onStatusUpdate(request.id, ServiceStatus.IN_PROGRESS)} isLoading={isUpdating}>
                        Confirmer le Paiement & Démarrer
                    </Button>
                );
                break;
            case ServiceStatus.IN_PROGRESS:
                actionButtons.push(
                    <Button key="complete" onClick={() => onStatusUpdate(request.id, ServiceStatus.COMPLETED)} isLoading={isUpdating}>
                        Marquer comme Terminé
                    </Button>
                );
                break;
            default:
                break;
        }

        if (status !== ServiceStatus.COMPLETED && status !== ServiceStatus.CANCELLED) {
             actionButtons.push(
                <Button key="cancel" variant="danger" onClick={() => onStatusUpdate(request.id, ServiceStatus.CANCELLED)} isLoading={isUpdating}>
                    Annuler la Demande
                </Button>
            );
        }

        return actionButtons;
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-bold">Demande de Service</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-bold mb-2">Détails du Client</h3>
                        <DetailRow label="Nom" value={`${user.firstName} ${user.lastName}`} />
                        <DetailRow label="Email" value={<a href={`mailto:${user.email}`} className="text-primary hover:underline">{user.email}</a>} />
                        <DetailRow label="Téléphone" value={user.phone} />
                         <div className="mt-4 flex gap-2">
                             <Button onClick={handleWhatsAppClick} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                                <span className="material-symbols-outlined mr-2 !text-base">chat</span>
                                Contacter via WhatsApp
                             </Button>
                         </div>
                    </div>
                     <div className="p-4 border rounded-lg">
                        <h3 className="font-bold mb-2">Détails de la Demande</h3>
                        <DetailRow label="Service" value={service.title[language]} />
                        <DetailRow label="Prix du service" value={`${new Intl.NumberFormat('fr-MA').format(service.price)} ${CURRENCY}`} />
                        <DetailRow label="Date de la demande" value={requestDate.toLocaleString('fr-FR')} />
                        <DetailRow label="Statut actuel" value={<span className="font-bold text-primary capitalize">{status.replace(/_/g, ' ')}</span>} />
                    </div>
                </div>

                <div className="p-6 mt-auto border-t border-border-light dark:border-border-dark flex justify-between items-center gap-3">
                    <Button variant="ghost" onClick={onClose}>Fermer</Button>
                    <div className="flex gap-3">
                        {renderActions()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestModal;