import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MobileProjectCardProps {
  project: Project;
}

const MobileProjectCard: React.FC<MobileProjectCardProps> = ({ project }) => {
  const { language, currency } = useLanguage();
  const percentageFunded = Math.round((project.currentFunding / project.fundingGoal) * 100);

  return (
    <Link to={`/mobile/project/${project.id}`} className="block w-64 flex-shrink-0 group">
      <div className="flex flex-col rounded-xl overflow-hidden shadow-md bg-white dark:bg-card-dark h-full transition-transform transform group-hover:-translate-y-1">
        <div className="w-full h-32 bg-cover bg-center" style={{ backgroundImage: `url("${project.imageUrl}")` }}></div>
        <div className="p-3 flex flex-col flex-grow">
          <p className="text-primary text-xs font-medium">{project.category}</p>
          <h3 className="mt-1 text-sm font-bold text-text-light dark:text-text-dark group-hover:text-primary transition-colors truncate">{project.title[language]}</h3>
          <div className="flex-grow" />
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs">
              <p className="font-semibold text-text-light dark:text-text-dark">{new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(project.fundingGoal)} {currency}</p>
              <p className="font-semibold text-primary">{percentageFunded}%</p>
            </div>
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percentageFunded}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MobileProjectCard;
