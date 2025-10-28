import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { getAvailableServices } from '../services/professionalService';
import Spinner from '../components/ui/Spinner';
import ServiceCard from '../components/dashboard/project-owner/services/ServiceCard';
import PublicServiceDetailsModal from '../components/services/PublicServiceDetailsModal';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useLanguage } from '../context/LanguageContext';

const ServicesPage = () => {
    const { settings } = useSiteSettings();
    const { language } = useLanguage();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            setError(null);
            try {
                const servicesData = await getAvailableServices();
                setServices(servicesData);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                setError("Impossible de charger les services.");
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);
    
    const handleViewDetails = (service: Service) => {
        setSelectedService(service);
    };

    const handleCloseModal = () => {
        setSelectedService(null);
    };

    return (
        <>
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center mb-4 text-text-light dark:text-text-dark">{settings.servicesPageTitle[language]}</h1>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                    {settings.servicesPageDescription[language]}
                </p>

                {loading ? (
                    <div className="flex justify-center py-20"><Spinner /></div>
                ) : error ? (
                    <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map(service => (
                            <ServiceCard key={service.id} service={service} onViewDetails={handleViewDetails} />
                        ))}
                    </div>
                )}
            </div>
            <PublicServiceDetailsModal
                service={selectedService}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default ServicesPage;