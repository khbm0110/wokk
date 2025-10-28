// services/investmentService.ts
import { ProjectStatus, KYCStatus, TransactionType, Investment } from '../types';
import { mockProjects, mockWallets, mockTransactions, mockInvestments, mockUsers } from './mockData';

interface InvestInProjectParams {
    investorId: string;
    projectId: string;
    amount: number;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Executes a secure transaction to invest in a project using mock data.
 * It decrements the investor's wallet, increments the project's funding,
 * and creates a transaction record atomically.
 */
export const investInProject = async ({ investorId, projectId, amount }: InvestInProjectParams): Promise<void> => {
    
    await delay(1500); // Simulate network latency for a transaction

    return new Promise((resolve, reject) => {
        const project = mockProjects.find(p => p.id === projectId);
        const investor = mockUsers.find(u => u.id === investorId);
        const wallet = mockWallets.find(w => w.userId === investorId);

        // --- Validation ---
        if (!project) return reject(new Error("Project not found."));
        if (!investor) return reject(new Error("Investor not found."));
        if (!wallet) return reject(new Error("Investor wallet not found."));
        if (investor.role !== 'INVESTOR' || investor.kycStatus !== KYCStatus.VERIFIED) {
            return reject(new Error("Investor is not verified."));
        }
        if (project.status !== ProjectStatus.ACTIVE) {
            return reject(new Error("Project is not active for funding."));
        }
        if (wallet.balance < amount) {
            return reject(new Error("Insufficient funds in wallet."));
        }
        if (amount < project.minimumInvestment) {
            return reject(new Error("Investment amount is below the minimum."));
        }
        if (project.currentFunding + amount > project.fundingGoal) {
            return reject(new Error("Investment exceeds project funding goal."));
        }

        // --- Execute Mock Transaction ---
        // 1. Update wallet balance
        wallet.balance -= amount;

        // 2. Update project funding
        project.currentFunding += amount;
        if (project.currentFunding >= project.fundingGoal) {
            project.status = ProjectStatus.FUNDED;
        }

        // 3. Create new transaction record
        const newTransaction = {
            id: `trn_${Date.now()}`,
            walletId: wallet.id,
            type: TransactionType.INVESTMENT,
            amount,
            description: `Investissement dans: ${project.title.fr}`,
            date: new Date(),
            status: 'Completed' as const,
        };
        mockTransactions.unshift(newTransaction);

        // 4. Create new investment record
        const newInvestment = {
            id: `inv_${Date.now()}`,
            userId: investorId,
            projectId,
            amount,
            date: new Date(),
        };
        mockInvestments.unshift(newInvestment);
        
        console.log("Investment successful:", { newInvestment, newBalance: wallet.balance, newProjectFunding: project.currentFunding });
        resolve();
    });
};

/**
 * Executes a direct investment via card, bypassing the wallet.
 */
export const investInProjectDirectly = async ({ investorId, projectId, amount }: InvestInProjectParams): Promise<void> => {
    
    await delay(2000); // Simulate a slightly longer payment gateway transaction

    return new Promise((resolve, reject) => {
        const project = mockProjects.find(p => p.id === projectId);
        const investor = mockUsers.find(u => u.id === investorId);
        
        // --- Validation (without wallet balance check) ---
        if (!project) return reject(new Error("Project not found."));
        if (!investor) return reject(new Error("Investor not found."));
        if (investor.role !== 'INVESTOR' || investor.kycStatus !== KYCStatus.VERIFIED) {
            return reject(new Error("Investor is not verified."));
        }
        if (project.status !== ProjectStatus.ACTIVE) {
            return reject(new Error("Project is not active for funding."));
        }
        if (amount < project.minimumInvestment) {
            return reject(new Error("Investment amount is below the minimum."));
        }
        if (project.currentFunding + amount > project.fundingGoal) {
            return reject(new Error("Investment exceeds project funding goal."));
        }

        // --- Execute Mock Transaction ---
        // 1. Update project funding
        project.currentFunding += amount;
        if (project.currentFunding >= project.fundingGoal) {
            project.status = ProjectStatus.FUNDED;
        }

        // 2. Create new investment record
        const newInvestment = {
            id: `inv_direct_${Date.now()}`,
            userId: investorId,
            projectId,
            amount,
            date: new Date(),
        };
        mockInvestments.unshift(newInvestment);
        
        // Note: No wallet or transaction records are created for this flow, as requested.
        
        console.log("Direct investment successful:", { newInvestment, newProjectFunding: project.currentFunding });
        resolve();
    });
};

/**
 * Fetches all investments made by a specific user from mock data.
 * @param userId - The UID of the investor.
 */
export const getInvestmentsByUser = async (userId: string): Promise<Investment[]> => {
    await delay(500);
    return mockInvestments.filter(inv => inv.userId === userId);
};
