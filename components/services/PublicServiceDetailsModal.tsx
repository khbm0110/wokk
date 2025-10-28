import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../../types';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

interface PublicServiceDetailsModalProps {
  service: Service | null;
  onClose: () => void;
}

const PublicServiceDetailsModal: React.FC<PublicServiceDetailsModalProps> = ({ service, onClose }) => {
  const { language, currency } = useLanguage();
  if (!service) return null;

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
              <p className="text-sm text-text-light-secondary dark:text-gray-400">Prix</p>
              <p className="font-bold text-lg text-primary">{new Intl.NumberFormat('fr-MA').format(service.price)} {currency}</p>
            </div>
            <div className="bg-gray-50 dark:bg-card-dark/50 p-4 rounded-lg">
              <p className="text-sm text-text-light-secondary dark:text-gray-400">Délai de livraison estimé</p>
              <p className="font-bold text-lg text-text-light-primary dark:text-white">{service.deliveryTimeDays} jours</p>
            </div>
          </div>
        </div>
        <div className="p-6 mt-auto border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row justify-end items-center gap-4 bg-gray-50 dark:bg-card-dark/50 rounded-b-xl">
            <p className="text-sm font-semibold text-text-light-primary dark:text-white text-center sm:text-left">Prêt à commencer ?</p>
            <div className="flex gap-3">
              <Link to="/connexion">
                  <Button variant="ghost">Se connecter</Button>
              </Link>
              <Link to="/inscription/porteur_de_projet">
                  <Button>Créer un compte</Button>
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PublicServiceDetailsModal;
