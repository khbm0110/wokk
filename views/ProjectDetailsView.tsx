





import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from '../components/project/ProjectDetails';
import { Project } from '../types';
import { getProjectById } from '../services/projectService';
import Spinner from '../components/ui/Spinner';

const ProjectDetailsView = () => {
    const { id } = useParams<{ id: string }>();
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
                        setError("Erreur de permissions. Impossible de charger les détails de ce projet.");
                    } else {
                        setError("Une erreur est survenue lors du chargement du projet.");
                    }
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProject();
    }, [id]);

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
                <h2 className="text-2xl font-bold text-red-600">Erreur de chargement</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Projet non trouvé</h2>
                <p className="text-gray-600 mt-2">Le projet que vous cherchez n'existe pas ou a été déplacé.</p>
            </div>
        );
    }
    return <ProjectDetails project={project} />;
}

export default ProjectDetailsView;