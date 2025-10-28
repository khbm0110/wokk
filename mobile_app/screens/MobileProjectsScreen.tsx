// mobile_app/screens/MobileProjectsScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { getProjects } from '../../services/projectService';
import { Project } from '../../types';
import Spinner from '../../components/ui/Spinner';
import MobileGridProjectCard from '../components/MobileGridProjectCard';

const MobileProjectsScreen = () => {
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all projects, not just active, to allow filtering by status in the future
                const projectsData = await getProjects(); 
                setAllProjects(projectsData);
            } catch (error) {
                console.error("Failed to fetch projects for mobile", error);
                setError("Impossible de charger les projets.");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const categories = useMemo(() => {
        return ['all', ...Array.from(new Set(allProjects.map(p => p.category.toLowerCase())))];
    }, [allProjects]);

    const filteredProjects = useMemo(() => {
        let projects = allProjects;

        if (activeCategory !== 'all') {
            projects = projects.filter(p => p.category.toLowerCase() === activeCategory);
        }

        if (searchTerm.trim() !== '') {
            projects = projects.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return projects;
    }, [allProjects, activeCategory, searchTerm]);


    if (loading) {
        return <div className="p-4 flex justify-center items-center h-full"><Spinner /></div>;
    }
    
    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 pt-4 space-y-4">
                {/* Search and Filter */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border rounded-full dark:bg-card-dark dark:border-border-dark focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button className="flex-shrink-0 size-10 flex items-center justify-center bg-gray-100 dark:bg-card-dark rounded-full border dark:border-border-dark" aria-label="Filtres avancés">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>

                {/* Categories */}
                <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex-shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full capitalize transition-colors duration-200 ${activeCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 border border-border-light dark:border-border-dark'}`}
                        >
                            {cat === 'all' ? 'Tous' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                 {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {filteredProjects.map(project => (
                            <MobileGridProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full pt-10">
                        <p className="text-center text-gray-500">Aucun projet trouvé pour votre recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileProjectsScreen;
