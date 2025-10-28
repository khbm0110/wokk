// components/project/ProjectStageBadge.tsx
import React from 'react';
import { ProjectStage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectStageBadgeProps {
  stage: ProjectStage;
}

const ProjectStageBadge: React.FC<ProjectStageBadgeProps> = ({ stage }) => {
  const { t } = useLanguage();

  const isIdea = stage === ProjectStage.IDEA;

  const styles = isIdea 
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' 
    : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
  
  const icon = isIdea ? 'lightbulb' : 'trending_up';

  const text = t(`projectStage.${stage}`);

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>
      <span className="material-symbols-outlined !text-sm">{icon}</span>
      <span>{text}</span>
    </div>
  );
};

export default ProjectStageBadge;