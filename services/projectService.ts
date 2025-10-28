// services/projectService.ts
import { Project, ProjectStatus, Investment, RoadmapMilestone } from '../types';
import { mockProjects, mockInvestments } from './mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


/**
 * Fetches a list of active projects from mock data.
 * @param count - Optional number of projects to limit the result to.
 */
export const getProjects = async (count?: number): Promise<Project[]> => {
    await delay(500);
    let activeProjects = mockProjects
        .filter(p => p.status === ProjectStatus.ACTIVE)
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

    if (count) {
        return activeProjects.slice(0, count);
    }
    return activeProjects;
};

/**
 * Fetches a single project by its ID from mock data.
 * @param id - The document ID of the project.
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
    await delay(500);
    const project = mockProjects.find(p => p.id === id);
    return project || null;
};


/**
 * Adds a new project to the mock data array.
 * @param projectData - The project data to add (without id).
 */
export const addProject = async (projectData: Omit<Project, 'id'>): Promise<string> => {
    await delay(1000);
    const newProject: Project = {
        ...projectData,
        id: `prj_${Date.now()}`,
    };
    mockProjects.unshift(newProject);
    return newProject.id;
};

/**
 * Fetches all projects submitted by a specific owner from mock data.
 * @param ownerId - The UID of the project owner.
 */
export const getProjectsByOwner = async (ownerId: string): Promise<Project[]> => {
    await delay(500);
    return mockProjects
        .filter(p => p.owner.id === ownerId)
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
};

/**
 * Fetches all projects a user has invested in from mock data.
 * @param userId - The UID of the investor.
 */
export const getInvestedProjects = async (userId: string): Promise<Project[]> => {
    await delay(500);
    const userInvestments = mockInvestments.filter(inv => inv.userId === userId);
    const projectIds = [...new Set(userInvestments.map(inv => inv.projectId))];

    if (projectIds.length === 0) {
        return [];
    }

    return mockProjects.filter(p => projectIds.includes(p.id));
};

/**
 * Updates the roadmap for a specific project.
 * @param projectId The ID of the project to update.
 * @param roadmap The new array of roadmap milestones.
 */
export const updateProjectRoadmap = async (projectId: string, roadmap: RoadmapMilestone[]): Promise<Project> => {
    await delay(1000);
    const projectIndex = mockProjects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
        throw new Error("Project not found");
    }
    
    // Ensure date objects are correctly handled
    const newRoadmap = roadmap.map(milestone => ({...milestone, targetDate: new Date(milestone.targetDate)}));
    
    mockProjects[projectIndex].roadmap = newRoadmap;
    
    return { ...mockProjects[projectIndex] };
};