import React from 'react';
import { Project } from '../../../types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';

const ProjectItem: React.FC<{ project: Project }> = ({ project }) => {
    const { t, language, currency } = useLanguage();
    const percentage = Math.round((project.currentFunding / project.fundingGoal) * 100);
    const daysLeft = Math.max(0, Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

    return (
        <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 hover:shadow-md transition-shadow">
            <img className="w-full md:w-32 h-24 object-cover rounded-lg" alt={project.title[language]} src={project.imageUrl} />
            <div className="flex-1 w-full">
                <Link to={`/projet/${project.id}`}>
                    <h3 className="font-bold text-lg text-text-light-primary dark:text-white hover:text-primary">{project.title[language]}</h3>
                </Link>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-2">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="flex flex-wrap justify-between text-sm text-text-light-secondary dark:text-gray-400">
                    <span>{percentage}% {t('poDashboard.projectCard.fundedPercent')}</span>
                    <span>
                        <span className="font-bold text-text-light-primary dark:text-gray-300">{new Intl.NumberFormat('fr-MA').format(project.currentFunding)}</span> / {new Intl.NumberFormat('fr-MA').format(project.fundingGoal)} {currency}
                    </span>
                    <span>{daysLeft} {t('projectDetails.daysLeft')}</span>
                </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <Link to={`/dashboard/projet/${project.id}/gerer`} className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary text-sm font-bold leading-normal tracking-[0.015em] text-center">{t('poDashboard.projectCard.manage')}</Link>
                <button className="flex-1 items-center justify-center rounded-lg h-10 px-4 border border-border-light dark:border-border-dark text-text-light-secondary dark:text-gray-300 text-sm font-bold leading-normal">{t('poDashboard.projectCard.update')}</button>
            </div>
        </div>
    );
};

const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => {
    const { t } = useLanguage();
    if (!projects || projects.length === 0) {
        return (
             <div className="text-center py-10 px-4 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl">
                <p className="text-text-light-secondary dark:text-gray-400">{t('poDashboard.projects.none')}</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-4">
            {projects.map(p => <ProjectItem key={p.id} project={p} />)}
        </div>
    );
};

export default ProjectList;
