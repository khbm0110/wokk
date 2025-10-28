import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import MobileProjectCard from '../components/MobileProjectCard';
import { getProjects } from '../../services/projectService';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';

const ProjectSlider = ({ projects }: { projects: Project[] }) => (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 no-scrollbar">
        {projects.map(project => (
            <div key={project.id} className="snap-start">
                <MobileProjectCard project={project} />
            </div>
        ))}
    </div>
);

const MobileHomeScreen = () => {
    const { user } = useAuth();
    const [restaurationProjects, setRestaurationProjects] = useState<Project[]>([]);
    const [technologieProjects, setTechnologieProjects] = useState<Project[]>([]);
    const [agricultureProjects, setAgricultureProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const allProjects = await getProjects();
                
                const resta = allProjects.filter(p => p.category.toLowerCase() === 'restauration').slice(0, 8);
                const tech = allProjects.filter(p => p.category.toLowerCase() === 'technologie').slice(0, 8);
                const agri = allProjects.filter(p => p.category.toLowerCase() === 'agriculture').slice(0, 8);

                setRestaurationProjects(resta);
                setTechnologieProjects(tech);
                setAgricultureProjects(agri);
            } catch (err: any) {
                console.error("Failed to fetch projects for mobile home:", err);
                setError("Impossible de charger les projets.");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return <div className="p-4 flex justify-center items-center h-full"><Spinner /></div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 space-y-6">
            {restaurationProjects.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold mb-3 text-text-light dark:text-text-dark">Restauration</h2>
                    <ProjectSlider projects={restaurationProjects} />
                </section>
            )}

            {technologieProjects.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold mb-3 text-text-light dark:text-text-dark">Technologie</h2>
                    <ProjectSlider projects={technologieProjects} />
                </section>
            )}

            {agricultureProjects.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold mb-3 text-text-light dark:text-text-dark">Agriculture</h2>
                    <ProjectSlider projects={agricultureProjects} />
                </section>
            )}
        </div>
    );
};

export default MobileHomeScreen;
