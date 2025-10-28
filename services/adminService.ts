// services/adminService.ts
import { User, Project, KYCStatus, UserRole, ProjectStatus } from '../types';
import { mockUsers, mockProjects } from './mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- API FUNCTIONS ---

export const getPlatformStats = async () => {
    await delay(500);
    const allProjects = mockProjects;

    const totalInvestments = allProjects.reduce((sum, p) => sum + p.currentFunding, 0);
    const totalRefunded = allProjects.filter(p => p.status === ProjectStatus.FAILED).reduce((sum, p) => sum + p.currentFunding, 0);
    const platformFeePerProject = 10000;
    const successfullyFundedProjects = allProjects.filter(
        p => p.status === ProjectStatus.FUNDED || p.status === ProjectStatus.COMPLETED
    ).length;
    const totalEarnings = successfullyFundedProjects * platformFeePerProject;

    const pendingUsersCount = mockUsers.filter(u => u.kycStatus === KYCStatus.PENDING).length;

    return {
        totalInvestments,
        totalRefunded,
        totalEarnings,
        projectCounts: {
            active: allProjects.filter(p => p.status === ProjectStatus.ACTIVE).length,
            completed: allProjects.filter(p => p.status === ProjectStatus.COMPLETED).length,
            failed: allProjects.filter(p => p.status === ProjectStatus.FAILED).length,
            pending: allProjects.filter(p => p.status === ProjectStatus.PENDING_APPROVAL).length,
        },
        userCounts: {
            pending: pendingUsersCount
        }
    };
};

export const getAllUsers = async (): Promise<User[]> => {
    await delay(500);
    return [...mockUsers];
};

export const getAllProjects = async (): Promise<Project[]> => {
    await delay(500);
    return [...mockProjects];
};

export const getAdmins = async (): Promise<Partial<User>[]> => {
    await delay(300);
    return mockUsers.filter(u => 
        u.role === UserRole.SUPER_ADMIN || 
        u.role === UserRole.VALIDATOR_ADMIN || 
        u.role === UserRole.FINANCIAL_ADMIN ||
        u.role === UserRole.SERVICE_ADMIN
    );
};

export const updateUserStatus = async (userId: string, status: KYCStatus, message: string): Promise<void> => {
    await delay(1000);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        mockUsers[userIndex].kycStatus = status;
        console.log(`Admin action: Updated user ${userId} to ${status}. Message: ${message}`);
        return;
    }
    throw new Error("User not found");
};

export const updateProjectStatus = async (projectId: string, status: ProjectStatus, supervisorId: string, message: string, equityOffered?: number): Promise<void> => {
    await delay(1000);
    const projectIndex = mockProjects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
        mockProjects[projectIndex].status = status;
        mockProjects[projectIndex].supervisorId = supervisorId;
        if (equityOffered !== undefined) {
            mockProjects[projectIndex].equityOffered = equityOffered;
        }
        console.log(`Admin action: Updated project ${projectId} to ${status}. Message: ${message}`);
        return;
    }
    throw new Error("Project not found");
};

export const inviteAdmin = async (email: string, role: UserRole): Promise<void> => {
    await delay(1000);
    console.log(`Admin Invitation Sent to: ${email} for role: ${role}. In a real app, this would trigger an email with a unique registration link containing the role.`);
    // In a real app, you might add this user to a "pending invites" collection with their assigned role.
    // For this mock, we just log and succeed.
    return;
};