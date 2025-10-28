import React from 'react';
import { Service } from '../../../../types';
import { useLanguage } from '../../../../context/LanguageContext';

interface ServiceCardProps {
  service: Service;
  onViewDetails: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails }) => {
  const { language, currency } = useLanguage();
  return (
    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6 flex flex-col items-start h-full transform transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-center size-12 rounded-lg bg-primary/20 text-primary mb-4">
        <span className="material-symbols-outlined text-3xl">{service.icon}</span>
      </div>
      <h3 className="font-bold text-lg text-text-light-primary dark:text-white">{service.title[language]}</h3>
      <p className="text-sm text-text-light-secondary dark:text-gray-400 mt-2 flex-grow">{service.description[language].substring(0, 100)}...</p>
      <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark w-full flex justify-between items-center">
        <div>
          <p className="text-xs text-text-light-secondary dark:text-gray-400">À partir de</p>
          <p className="font-bold text-primary">{new Intl.NumberFormat('fr-MA').format(service.price)} {currency}</p>
        </div>
        <button onClick={() => onViewDetails(service)} className="text-sm font-bold text-primary hover:underline">
          Voir les détails
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
