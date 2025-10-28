import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MobileGridProjectCardProps {
  project: Project;
}

const MobileGridProjectCard: React.FC<MobileGridProjectCardProps> = ({ project }) => {
  const { language, currency } = useLanguage();
  const percentageFunded = Math.round((project.currentFunding / project.fundingGoal) * 100);

  return (
    <Link to={`/mobile/project/${project.id}`} className="block group">
      <div className="flex flex-col rounded-xl overflow-hidden shadow-md bg-white dark:bg-card-dark h-full transition-shadow hover:shadow-lg">
        <img src={project.imageUrl} alt={project.title[language]} className="w-full h-24 object-cover" />
        <div className="p-3 flex flex-col flex-grow">
          <p className="text-primary text-xs font-semibold capitalize">{project.category}</p>
          <h3 className="mt-1 text-sm font-bold text-text-light dark:text-text-dark group-hover:text-primary transition-colors h-10 leading-tight">
            {project.title[language]}
          </h3>
          <div className="flex-grow" />
          <div className="mt-2">
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="font-bold text-text-light dark:text-text-dark">{percentageFunded}%</span>
              <span>{new Intl.NumberFormat('fr-MA', { notation: 'compact' }).format(project.fundingGoal)} {currency}</span>
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

export default MobileGridProjectCard;
