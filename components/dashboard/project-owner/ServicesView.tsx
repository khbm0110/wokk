import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { Service, ServiceRequest } from '../../../types';
import { getAvailableServices, getMyServiceRequests, requestService } from '../../../services/professionalService';
import Spinner from '../../ui/Spinner';
import Card from '../../ui/Card';
import ServiceCard from './services/ServiceCard';
import ServiceDetailsModal from './services/ServiceDetailsModal';
import MyRequestsList from './services/MyRequestsList';
import Tabs from '../../ui/Tabs';

const ServicesView = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [services, setServices] = useState<Service[]>([]);
  const [myRequests, setMyRequests] = useState<(ServiceRequest & { service: Service })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [servicesData, requestsData] = await Promise.all([
        getAvailableServices(),
        getMyServiceRequests(user.id),
      ]);
      setServices(servicesData);
      setMyRequests(requestsData);
    } catch (error) {
      console.error("Failed to fetch services data:", error);
      addNotification("Erreur lors du chargement des services.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleConfirmRequest = async (service: Service) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await requestService(user.id, service.id);
      addNotification(`Votre demande pour le service "${service.title}" a bien été envoyée.`, "success");
      fetchData(); // Refresh requests list
      handleCloseModal();
    } catch (error: any) {
      addNotification(error.message || "Erreur lors de la demande de service.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableServicesContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map(service => (
        <ServiceCard key={service.id} service={service} onViewDetails={handleViewDetails} />
      ))}
    </div>
  );

  const myRequestsContent = <MyRequestsList requests={myRequests} />;

  const tabs = [
    { label: 'Services Disponibles', content: availableServicesContent },
    { label: `Mes Demandes (${myRequests.length})`, content: myRequestsContent },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  }

  return (
    <>
      <Card>
        <div className="mb-6">
          <h2 className="text-text-light-primary dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Services Professionnels</h2>
          <p className="text-text-light-secondary dark:text-primary/80 text-base font-normal leading-normal mt-1">Accélérez le développement de votre projet avec l'aide de nos experts.</p>
        </div>
        <Tabs tabs={tabs} />
      </Card>
      <ServiceDetailsModal
        service={selectedService}
        onClose={handleCloseModal}
        onConfirmRequest={handleConfirmRequest}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default ServicesView;
