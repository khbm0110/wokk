// components/project/ProjectRoadmap.tsx
import React from 'react';
import { Project, MilestoneStatus, RoadmapMilestone } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectRoadmapProps {
  project: Project;
}

const MilestoneIcon: React.FC<{ status: MilestoneStatus }> = ({ status }) => {
  const baseClasses = "size-12 rounded-full flex items-center justify-center bg-background-light dark:bg-background-dark ring-4 ring-background-light dark:ring-background-dark";
  
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return (
        <div className={`${baseClasses}`}>
          <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400">check</span>
          </div>
        </div>
      );
    case MilestoneStatus.IN_PROGRESS:
      return (
        <div className={`${baseClasses}`}>
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500">
                <span className="material-symbols-outlined text-blue-500 dark:text-blue-400">autorenew</span>
            </div>
        </div>
      );
    case MilestoneStatus.NOT_STARTED:
    default:
      return (
        <div className={`${baseClasses}`}>
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">schedule</span>
            </div>
        </div>
      );
  }
};


const ProjectRoadmap: React.FC<ProjectRoadmapProps> = ({ project }) => {
  const { t, language } = useLanguage();

  if (!project.roadmap || project.roadmap.length === 0) {
    return null;
  }

  return (
    <div className="relative">
        <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
        {project.roadmap.map((milestone: RoadmapMilestone) => (
             <div key={milestone.id} className="relative pl-16 py-4">
                <div className="absolute left-0 top-4">
                    <MilestoneIcon status={milestone.status} />
                </div>
                <div className="p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl w-full">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{milestone.title[language]}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                               {milestone.targetDate.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', { year: 'numeric', month: 'long' })}
                            </p>
                        </div>
                         <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                            milestone.status === MilestoneStatus.COMPLETED ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                            milestone.status === MilestoneStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                         }`}>
                            {t(`milestone.status.${milestone.status}`)}
                         </span>
                    </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{milestone.description[language]}</p>
                </div>
            </div>
        ))}
    </div>
  );
};

export default ProjectRoadmap;