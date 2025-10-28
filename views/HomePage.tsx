import React, { useState, useEffect, useRef, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import ProjectCard from '../components/project/ProjectCard';
import { getProjects } from '../services/projectService';
import Spinner from '../components/ui/Spinner';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useLanguage } from '../context/LanguageContext';

// New ProjectSlider component
const ProjectSlider = ({ projects }: { projects: Project[] }) => {
    const scrollContainer = useRef<HTMLDivElement>(null);
    const { dir } = useLanguage();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainer.current) {
            const scrollAmount = scrollContainer.current.clientWidth * 0.8;
            let scrollDirection = direction === 'left' ? -scrollAmount : scrollAmount;
            if (dir === 'rtl') {
                scrollDirection = -scrollDirection;
            }
            scrollContainer.current.scrollBy({
                left: scrollDirection,
                behavior: 'smooth',
            });
        }
    };
    
    // Only show buttons if projects exceed the typical view count
    const showButtons = projects.length > 3;

    return (
        <div className="relative">
            <div
                ref={scrollContainer}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar"
            >
                {projects.map(project => (
                    <div key={project.id} className="snap-start flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>
            {showButtons && (
              <>
                <button
                    onClick={() => scroll('left')}
                    className="absolute top-1/2 start-0 -translate-y-1/2 -translate-x-1/2 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-background-dark transition-all z-10 opacity-0 group-hover:opacity-100"
                    aria-label="Previous projects"
                >
                    <span className="material-symbols-outlined">{dir === 'rtl' ? 'chevron_right' : 'chevron_left'}</span>
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute top-1/2 end-0 -translate-y-1/2 translate-x-1/2 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-background-dark transition-all z-10 opacity-0 group-hover:opacity-100"
                    aria-label="Next projects"
                >
                    <span className="material-symbols-outlined">{dir === 'rtl' ? 'chevron_left' : 'chevron_right'}</span>
                </button>
              </>
            )}
        </div>
    );
};


const HomePage = () => {
    const { settings } = useSiteSettings();
    const { t, language } = useLanguage();
    const [restaurationProjects, setRestaurationProjects] = useState<Project[]>([]);
    const [technologieProjects, setTechnologieProjects] = useState<Project[]>([]);
    const [agricultureProjects, setAgricultureProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove: MouseEventHandler<HTMLElement> = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = x - centerX;
        const deltaY = y - centerY;

        const maxRotation = 8; 

        const rotateX = (deltaY / centerY) * -maxRotation;
        const rotateY = (deltaX / centerX) * maxRotation;
        
        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    useEffect(() => {
        const originalTitle = document.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        const originalDescContent = metaDesc ? metaDesc.getAttribute('content') : '';

        if (settings.seoTitle) {
            document.title = settings.seoTitle;
        }
        if (metaDesc && settings.seoDescription) {
            metaDesc.setAttribute('content', settings.seoDescription);
        }

        // Cleanup function to restore original values
        return () => {
            document.title = originalTitle;
            if (metaDesc && originalDescContent) {
                metaDesc.setAttribute('content', originalDescContent);
            }
        };
    }, [settings.seoTitle, settings.seoDescription]);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all active projects
                const allProjects = await getProjects();
                
                // Filter by category and limit to 8
                const resta = allProjects.filter(p => p.category.toLowerCase() === 'restauration').slice(0, 8);
                const tech = allProjects.filter(p => p.category.toLowerCase() === 'technologie').slice(0, 8);
                const agri = allProjects.filter(p => p.category.toLowerCase() === 'agriculture').slice(0, 8);

                setRestaurationProjects(resta);
                setTechnologieProjects(tech);
                setAgricultureProjects(agri);

            } catch (err: any) {
                console.error("Failed to fetch projects for homepage:", err);
                setError("Impossible de charger les projets à la une.");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section 
                className="relative pt-20 pb-8 sm:pb-12 flex items-center justify-center" 
                style={{ perspective: '1200px' }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent"></div>
                
                {/* 3D Container */}
                <div 
                    className="max-w-5xl w-full mx-auto p-2 relative z-10 transition-transform duration-300 ease-out bg-gray-200/20 dark:bg-gray-800/20 rounded-[2rem] shadow-lg"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Inner Content Card */}
                    <div 
                        className="p-8 sm:p-12 md:p-16 text-center bg-white/60 dark:bg-background-dark/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20"
                        style={{ transform: 'translateZ(20px)' }}
                    >
                        <h1 
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight tracking-tighter text-text-light dark:text-text-dark"
                            style={{ transform: 'translateZ(60px)' }}
                        >
                            {settings.heroTitle[language]}
                        </h1>
                        <p 
                            className="mt-6 max-w-2xl mx-auto text-lg text-text-light/80 dark:text-text-dark/80"
                            style={{ transform: 'translateZ(40px)' }}
                        >
                            {settings.heroSubtitle[language]}
                        </p>
                        <div 
                            className="mt-10 flex flex-wrap gap-4 justify-center"
                            style={{ transform: 'translateZ(20px)' }}
                        >
                            <Link to={settings.heroButton1Url} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-secondary text-text-light text-base font-bold leading-normal tracking-[0.015em] hover:bg-secondary/90 transition-colors shadow-lg">
                                <span className="truncate">{settings.heroButton1Text[language]}</span>
                            </Link>
                            <Link to={settings.heroButton2Url} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-lg">
                                <span className="truncate">{settings.heroButton2Text[language]}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Featured Projects Section */}
            <section className="py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold font-display text-center text-text-light dark:text-text-dark mb-8">{t('featuredProjects')}</h2>

                    {loading ? (
                        <div className="flex justify-center mt-12 h-96 items-center"><Spinner /></div>
                    ) : error ? (
                        <p className="text-center text-danger mt-12">{error}</p>
                    ) : (
                        <div className="space-y-12">
                            {restaurationProjects.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold font-display mb-6 text-text-light dark:text-text-dark">{t('restoration')}</h3>
                                    <div className="group">
                                        <ProjectSlider projects={restaurationProjects} />
                                    </div>
                                </div>
                            )}

                            {technologieProjects.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold font-display mb-6 text-text-light dark:text-text-dark">{t('technology')}</h3>
                                    <div className="group">
                                        <ProjectSlider projects={technologieProjects} />
                                    </div>
                                </div>
                            )}

                            {agricultureProjects.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold font-display mb-6 text-text-light dark:text-text-dark">{t('agriculture')}</h3>
                                    <div className="group">
                                        <ProjectSlider projects={agricultureProjects} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-20 text-center">
                        <Link to="/projets" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-secondary text-text-light text-base font-bold leading-normal tracking-[0.015em] hover:bg-secondary/90 transition-colors shadow-lg mx-auto">
                            <span className="truncate">{t('viewAllProjects')}</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold font-display text-center text-text-light dark:text-text-dark">{t('howItWorks')}</h2>
                    <div className="mt-16 grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                                <span className="material-symbols-outlined text-4xl">person_add</span>
                            </div>
                            <h3 className="mt-6 text-xl font-bold font-display">{t('createAnAccount')}</h3>
                            <p className="mt-2 text-text-light/80 dark:text-text-dark/80">{t('createAnAccountDesc')}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                                <span className="material-symbols-outlined text-4xl">checklist</span>
                            </div>
                            <h3 className="mt-6 text-xl font-bold font-display">{t('chooseAProject')}</h3>
                            <p className="mt-2 text-text-light/80 dark:text-text-dark/80">{t('chooseAProjectDesc')}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                                <span className="material-symbols-outlined text-4xl">monitoring</span>
                            </div>
                            <h3 className="mt-6 text-xl font-bold font-display">{t('investAndFollow')}</h3>
                            <p className="mt-2 text-text-light/80 dark:text-text-dark/80">{t('investAndFollowDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Why InvestMaroc Section */}
            <section className="py-8 sm:py-12 bg-white dark:bg-background-dark/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-display text-text-light dark:text-text-dark">{t('whyInvestMaroc', {siteName: t('siteName')})}</h2>
                        <p className="mt-4 text-lg text-text-light/80 dark:text-text-dark/80">{t('whyInvestMarocDesc')}</p>
                        <div className="mt-8 space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-secondary/20 text-secondary">
                                    <span className="material-symbols-outlined">security</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold font-display">{t('securityAndTrust')}</h4>
                                    <p className="mt-1 text-text-light/80 dark:text-text-dark/80">{t('securityAndTrustDesc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-secondary/20 text-secondary">
                                    <span className="material-symbols-outlined">visibility</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold font-display">{t('totalTransparency')}</h4>
                                    <p className="mt-1 text-text-light/80 dark:text-text-dark/80">{t('totalTransparencyDesc')}</p>
                                </div>
                            </div>
                             <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-secondary/20 text-secondary">
                                    <span className="material-symbols-outlined">public</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold font-display">{t('strongLocalImpact')}</h4>
                                    <p className="mt-1 text-text-light/80 dark:text-text-dark/80">{t('strongLocalImpactDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <img className="rounded-xl shadow-2xl" alt="Business meeting in a modern office." src={settings.heroImageUrl} />
                    </div>
                </div>
            </section>

            {/* Qui Sommes-Nous Section */}
            <section className="py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold font-display text-center text-text-light dark:text-text-dark">{settings.teamSectionTitle[language]}</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-center text-text-light/80 dark:text-text-dark/80">
                       {settings.teamSectionDescription[language]}
                    </p>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                        {settings.teamMembers.map((member) => (
                            <div key={member.id} className="bg-white dark:bg-background-dark/50 rounded-xl p-8 text-center shadow-lg transition-transform transform hover:-translate-y-2">
                                <img 
                                    className="w-24 h-24 mx-auto rounded-full mb-4 shadow-md" 
                                    src={member.imageUrl} 
                                    alt={`Photo de ${member.name}`} 
                                />
                                <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">{member.name}</h3>
                                <p className="text-primary font-semibold text-sm">{member.role}</p>
                                <p className="mt-4 text-text-light/80 dark:text-text-dark/80 text-sm">{member.bio}</p>
                                <div className="mt-6 flex justify-center space-x-4">
                                    <a href={member.socials.linkedin} className="text-text-light/60 hover:text-primary transition-colors" aria-label="Profil LinkedIn">LinkedIn</a>
                                    <a href={member.socials.twitter} className="text-text-light/60 hover:text-primary transition-colors" aria-label="Profil Twitter">Twitter</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
