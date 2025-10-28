import React, { useState, useEffect, useMemo } from 'react';
import { Service, ServiceStatus } from '../../../types';
import {
    AdminServiceRequest,
    getAllServiceRequests,
    updateServiceRequestStatus,
    getAvailableServices,
    addService,
    updateService,
    deleteService
} from '../../../services/professionalService';
import Card from '../../ui/Card';
import Spinner from '../../ui/Spinner';
import { useNotification } from '../../../context/NotificationContext';
import ServiceRequestModal from './ServiceRequestModal';
import Tabs from '../../ui/Tabs';
import Button from '../../ui/Button';
import ServiceFormModal from './ServiceFormModal';
import { useLanguage } from '../../../context/LanguageContext';

const StatusBadge: React.FC<{ status: ServiceStatus }> = ({ status }) => {
  const styles = {
    [ServiceStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    [ServiceStatus.AWAITING_PAYMENT]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
    [ServiceStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [ServiceStatus.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [ServiceStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };
  const statusText = status.replace(/_/g, ' ');
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${styles[status]}`}>{statusText}</span>;
};

const ManageServicesView: React.FC<{
    services: Service[];
    onAdd: () => void;
    onEdit: (service: Service) => void;
    onDelete: (serviceId: string) => void;
}> = ({ services, onAdd, onEdit, onDelete }) => {
    const { language, currency } = useLanguage();
    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={onAdd}>
                    <span className="material-symbols-outlined mr-2">add</span>
                    Ajouter un service
                </Button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-card-dark/50">
                        <tr>
                            <th className="px-6 py-3">Service</th>
                            <th className="px-6 py-3">Prix</th>
                            <th className="px-6 py-3">Délai</th>
                            <th className="px-6 py-3">Icône</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.id} className="bg-white dark:bg-card-dark border-b dark:border-border-dark hover:bg-gray-50 dark:hover:bg-card-dark/80">
                                <td className="px-6 py-4 font-semibold">{service.title[language]}</td>
                                <td className="px-6 py-4">{new Intl.NumberFormat('fr-MA').format(service.price)} {currency}</td>
                                <td className="px-6 py-4">{service.deliveryTimeDays} jours</td>
                                <td className="px-6 py-4"><span className="material-symbols-outlined">{service.icon}</span></td>
                                <td className="px-6 py-4 flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => onEdit(service)}>Modifier</Button>
                                    <Button size="sm" variant="danger" onClick={() => onDelete(service.id)}>Supprimer</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const ServiceManagement: React.FC = () => {
    const [requests, setRequests] = useState<AdminServiceRequest[]>([]);
    const [requestFilter, setRequestFilter] = useState<string>('all');
    const [selectedRequest, setSelectedRequest] = useState<AdminServiceRequest | null>(null);
    const { language, currency } = useLanguage();
    
    const [services, setServices] = useState<Service[]>([]);
    const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { addNotification } = useNotification();

    const fetchData = async () => {
        // Don't set loading to true here to avoid flicker on refetch
        try {
            const [requestsData, servicesData] = await Promise.all([
                getAllServiceRequests(),
                getAvailableServices()
            ]);
            setRequests(requestsData);
            setServices(servicesData);
        } catch (error) {
            addNotification("Erreur lors de la récupération des données de service.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const handleStatusUpdate = async (requestId: string, newStatus: ServiceStatus) => {
        setIsUpdating(true);
        try {
            await updateServiceRequestStatus(requestId, newStatus);
            addNotification("Le statut de la demande a été mis à jour.", "success");
            setSelectedRequest(null);
            fetchData();
        } catch (error) {
            addNotification("Erreur lors de la mise à jour du statut.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredRequests = useMemo(() => {
        if (requestFilter === 'all') return requests;
        return requests.filter(req => req.status === requestFilter);
    }, [requests, requestFilter]);

    const handleAddService = () => setEditingService({});
    const handleEditService = (service: Service) => setEditingService(service);
    
    const handleDeleteService = async (serviceId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.")) {
            setIsUpdating(true);
            try {
                await deleteService(serviceId);
                addNotification("Service supprimé avec succès.", "success");
                fetchData();
            } catch (error) {
                addNotification("Erreur lors de la suppression du service.", "error");
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleSaveService = async (serviceData: Partial<Service>) => {
        setIsUpdating(true);
        try {
            if (serviceData.id) {
                await updateService(serviceData as Service);
                addNotification("Service mis à jour avec succès.", "success");
            } else {
                await addService(serviceData as Omit<Service, 'id'>);
                addNotification("Service ajouté avec succès.", "success");
            }
            setEditingService(null);
            fetchData();
        } catch (error) {
            addNotification("Erreur lors de l'enregistrement du service.", "error");
        } finally {
            setIsUpdating(false);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }

    const requestsContent = (
         <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Demandes des clients ({filteredRequests.length})</h3>
                <select onChange={(e) => setRequestFilter(e.target.value)} className="border rounded-md p-2 bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark">
                    <option value="all">Tous</option>
                    {Object.values(ServiceStatus).map(status => (
                        <option key={status} value={status} className="capitalize">{status.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-card-dark/50">
                       <tr>
                            <th className="px-6 py-3">Client</th>
                            <th className="px-6 py-3">Service Demandé</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Prix</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => (
                            <tr key={req.id} className="bg-white dark:bg-card-dark border-b dark:border-border-dark hover:bg-gray-50 dark:hover:bg-card-dark/80">
                                <td className="px-6 py-4 font-semibold">{req.user.firstName} {req.user.lastName}<p className="font-normal text-gray-400">{req.user.email}</p></td>
                                <td className="px-6 py-4 font-medium">{req.service.title[language]}</td>
                                <td className="px-6 py-4">{req.requestDate.toLocaleDateString('fr-FR')}</td>
                                <td className="px-6 py-4 font-semibold">{new Intl.NumberFormat('fr-MA').format(req.service.price)} {currency}</td>
                                <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                <td className="px-6 py-4">
                                    <button onClick={() => setSelectedRequest(req)} className="font-medium text-primary hover:underline">Gérer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const servicesContent = (
        <ManageServicesView
            services={services}
            onAdd={handleAddService}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
        />
    );

    const tabs = [
        { label: "Demandes de Service", content: requestsContent },
        { label: "Gérer les Services", content: servicesContent },
    ];

    return (
        <>
            <Card>
                <div className="mb-6">
                    <h2 className="text-xl font-bold">Gestion des Services Professionnels</h2>
                    <p className="text-gray-500 mt-1">Gérez les demandes des clients et le catalogue des services disponibles.</p>
                </div>
                <Tabs tabs={tabs} />
            </Card>
            <ServiceRequestModal 
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={isUpdating}
            />
            <ServiceFormModal
                service={editingService}
                onClose={() => setEditingService(null)}
                onSave={handleSaveService}
                isSaving={isUpdating}
            />
        </>
    );
};

export default ServiceManagement;
