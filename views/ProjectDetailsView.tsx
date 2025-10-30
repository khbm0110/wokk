

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from '../components/project/ProjectDetails';
import { Project } from '../types';
import { getProjectById } from '../services/projectService';
import Spinner from '../components/ui/Spinner';
import { useLanguage } from '../context/LanguageContext';

const ProjectDetailsView = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useLanguage();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (id) {
                setLoading(true);
                setError(null);
                try {
                    const fetchedProject = await getProjectById(id);
                    setProject(fetchedProject);
                } catch (err: any) {
                    console.error(`Failed to fetch project ${id}:`, err);
                    if (err.code === 'permission-denied') {
                        setError(t('projectDetails.error.permissionDenied'));
                    } else {
                        setError(t('projectDetails.error.generic'));
                    }
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProject();
    }, [id, t]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Spinner />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600">{t('projectDetails.error.loading')}</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">{t('projectDetails.error.notFoundTitle')}</h2>
                <p className="text-gray-600 mt-2">{t('projectDetails.error.notFoundDesc')}</p>
            </div>
        );
    }
    return <ProjectDetails project={project} />;
}

export default ProjectDetailsView;