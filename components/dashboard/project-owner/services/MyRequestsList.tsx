import React from 'react';
import { Service, ServiceRequest, ServiceStatus } from '../../../../types';
import { useLanguage } from '../../../../context/LanguageContext';

interface MyRequestsListProps {
  requests: (ServiceRequest & { service: Service })[];
}

const StatusBadge: React.FC<{ status: ServiceStatus }> = ({ status }) => {
  const styles = {
    [ServiceStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    [ServiceStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [ServiceStatus.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [ServiceStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };
  const statusText = status.replace(/_/g, ' ');
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{statusText}</span>;
};

const MyRequestsList: React.FC<MyRequestsListProps> = ({ requests }) => {
  const { language, currency } = useLanguage();

  if (requests.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-light-secondary dark:text-gray-400">Vous n'avez demandé aucun service pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-light-secondary dark:text-gray-400 uppercase bg-gray-50 dark:bg-card-dark/50">
          <tr>
            <th scope="col" className="px-6 py-3">Service</th>
            <th scope="col" className="px-6 py-3">Date de la demande</th>
            <th scope="col" className="px-6 py-3">Prix</th>
            <th scope="col" className="px-6 py-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark last:border-b-0">
              <td className="px-6 py-4 font-medium text-text-light-primary dark:text-white">{req.service.title[language]}</td>
              <td className="px-6 py-4 text-text-light-secondary dark:text-gray-400">{req.requestDate.toLocaleDateString('fr-FR')}</td>
              <td className="px-6 py-4 font-semibold text-text-light-primary dark:text-white">{new Intl.NumberFormat('fr-MA').format(req.service.price)} {currency}</td>
              <td className="px-6 py-4">
                <StatusBadge status={req.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyRequestsList;
