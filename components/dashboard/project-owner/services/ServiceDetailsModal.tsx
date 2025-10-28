import React from 'react';
import { Service } from '../../../../types';
import Button from '../../../ui/Button';
import { useLanguage } from '../../../../context/LanguageContext';

interface ServiceDetailsModalProps {
  service: Service | null;
  onClose: () => void;
  onConfirmRequest: (service: Service) => void;
  isSubmitting: boolean;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({ service, onClose, onConfirmRequest, isSubmitting }) => {
  const { t, language, currency } = useLanguage();
  if (!service) return null;

  const handleConfirm = () => {
    onConfirmRequest(service);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light-primary dark:text-white">{service.title[language]}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-text-light-secondary dark:text-gray-300">{service.description[language]}</p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-gray-50 dark:bg-card-dark/50 p-4 rounded-lg">
              <p className="text-sm text-text-light-secondary dark:text-gray-400">{t('publicServiceModal.price')}</p>
              <p className="font-bold text-lg text-primary">{new Intl.NumberFormat('fr-MA').format(service.price)} {currency}</p>
            </div>
            <div className="bg-gray-50 dark:bg-card-dark/50 p-4 rounded-lg">
              <p className="text-sm text-text-light-secondary dark:text-gray-400">{t('publicServiceModal.delivery')}</p>
              <p className="font-bold text-lg text-text-light-primary dark:text-white">{service.deliveryTimeDays} jours</p>
            </div>
          </div>
        </div>
        <div className="p-6 mt-auto border-t border-border-light dark:border-border-dark flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>{t('common.close')}</Button>
          <Button onClick={handleConfirm} isLoading={isSubmitting} disabled={isSubmitting}>
            {t('poDashboard.services.modal.request')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
