
import React from 'react';
import { User } from '../../types';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectOwnerProfileProps {
  owner: User;
}

const ProjectOwnerProfile = ({ owner }: ProjectOwnerProfileProps) => {
  const { t } = useLanguage();
  return (
    <div className="p-6 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-text-light dark:text-text-dark">{t('projectOwnerProfile.about')}</h3>
      <div className="flex items-center space-x-4">
        <img
          src={owner.profilePictureUrl || 'https://i.pravatar.cc/150?u=default'}
          alt={`${owner.firstName} ${owner.lastName}`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-neutral dark:text-text-dark">{owner.firstName} {owner.lastName}</h4>
          <span className="flex items-center mt-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full dark:bg-green-900/50 dark:text-green-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('projectOwnerProfile.verified')}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">{owner.bio}</p>
      <div className="mt-4 flex space-x-2">
        <Button variant="ghost" size="sm" className="w-full">{t('projectOwnerProfile.viewProfile')}</Button>
        <Button variant="secondary" size="sm" className="w-full">{t('projectOwnerProfile.contact')}</Button>
      </div>
    </div>
  );
};

export default ProjectOwnerProfile;