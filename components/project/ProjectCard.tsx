import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import ProjectStageBadge from './ProjectStageBadge';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t, language, currency } = useLanguage();
  const percentageFunded = Math.round((project.currentFunding / project.fundingGoal) * 100);

  return (
    <Link to={`/projet/${project.id}`} className="block group h-full">
      <div className="flex flex-col rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card-light dark:bg-card-dark h-full">
        <div className="w-full h-48 bg-cover bg-center" style={{ backgroundImage: `url("${project.imageUrl}")` }}></div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-center">
            <p className="text-primary text-sm font-medium">{project.category}</p>
            <ProjectStageBadge stage={project.stage} />
          </div>
          <h3 className="mt-2 text-xl font-bold font-display text-text-light dark:text-text-dark group-hover:text-primary transition-colors">{project.title[language]}</h3>
          <div className="flex-grow" />
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <p className="font-semibold">
                {language === 'ar' ? (
                  <>
                    <span className="font-normal text-text-light/60 dark:text-text-dark/60">{t('projectCard.goal')}</span>
                    {' '}
                    {new Intl.NumberFormat('ar-MA').format(project.fundingGoal)} {currency}
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat('fr-MA').format(project.fundingGoal)} {currency}
                    {' '}
                    <span className="font-normal text-text-light/60 dark:text-text-dark/60">{t('projectCard.goal')}</span>
                  </>
                )}
              </p>
              <p className="font-semibold">{percentageFunded}%</p>
            </div>
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentageFunded}%` }}></div>
            </div>
          </div>
          <div className="mt-6 w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary/20 text-primary text-sm font-bold leading-normal group-hover:bg-primary/30 transition-colors">
            <span className="truncate">{t('viewProject')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;