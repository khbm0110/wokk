// services/reportService.ts
import { Report, ReportStatus } from '../types';
import { mockReports } from './mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getReportsByProject = async (projectId: string): Promise<Report[]> => {
    await delay(500);
    return mockReports
        .filter(r => r.projectId === projectId)
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
};

export const addReport = async (reportData: Omit<Report, 'id' | 'submittedAt' | 'status'>): Promise<Report> => {
    await delay(1000);
    const newReport: Report = {
        ...reportData,
        id: `rep_${Date.now()}`,
        submittedAt: new Date(),
        status: ReportStatus.PENDING,
    };
    mockReports.unshift(newReport);
    return newReport;
};

export const publishReport = async (reportId: string): Promise<Report> => {
    await delay(700);
    const reportIndex = mockReports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
        throw new Error("Report not found");
    }
    mockReports[reportIndex].status = ReportStatus.PUBLISHED;
    mockReports[reportIndex].publishedAt = new Date();
    return mockReports[reportIndex];
};
