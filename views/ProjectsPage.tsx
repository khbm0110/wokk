import React, { useState, useEffect } from 'react';
import ProjectList from '../components/project/ProjectList';
import { Project } from '../types';
import { getProjects } from '../services/projectService';
import Spinner from '../components/ui/Spinner';
import { useLanguage } from '../context/LanguageContext';

const ProjectsPage = () => {
  const { t } = useLanguage();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const projects = await getProjects();
            setAllProjects(projects);
        } catch (err: any) {
            console.error("Failed to fetch projects for projects page:", err);
            if (err.code === 'permission-denied') {
                setError("Erreur de permissions. Veuillez vérifier les règles de sécurité de votre base de données Firestore.");
            } else {
                setError(t('loadingErrorDesc'));
            }
        } finally {
            setLoading(false);
        }
    };
    fetchProjects();
  }, [t]);

  const filteredProjects = allProjects.filter(p => {
    if (filter === 'all') return true;
    return p.category.toLowerCase() === filter;
  });

  const categories = ['all', ...Array.from(new Set(allProjects.map(p => p.category.toLowerCase())))];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-4 text-text-light dark:text-text-dark">{t('discoverProjects')}</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">{t('discoverProjectsDesc')}</p>
      
      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : error ? (
        <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg max-w-3xl mx-auto">
            <h3 className="font-bold text-lg">{t('loadingError')}</h3>
            <p>{error}</p>
        </div>
      ) : (
        <>
            <div className="flex justify-center mb-10">
                <div className="flex flex-wrap justify-center gap-2 bg-gray-100 dark:bg-card-dark p-2 rounded-full">
                {categories.map(cat => (
                    <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full capitalize transition-colors duration-200 ${filter === cat ? 'bg-primary text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm'}`}
                    >
                    {cat === 'all' ? t('all') : cat}
                    </button>
                ))}
                </div>
            </div>
            
            {filteredProjects.length > 0 ? (
                <ProjectList projects={filteredProjects} />
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">{t('noProjectsInCategory')}</p>
            )}
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
