// services/professionalService.ts
import { Service, ServiceRequest, ServiceStatus, User } from '../types';
import { mockServices, mockServiceRequests, mockUsers } from './mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export type AdminServiceRequest = ServiceRequest & { user: User; service: Service };

export const getAvailableServices = async (): Promise<Service[]> => {
    await delay(300);
    return [...mockServices];
};

export const getMyServiceRequests = async (userId: string): Promise<(ServiceRequest & { service: Service })[]> => {
    await delay(400);
    const requests = mockServiceRequests.filter(req => req.userId === userId);
    return requests.map(req => {
        const service = mockServices.find(s => s.id === req.serviceId)!;
        return { ...req, service };
    }).sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
};

export const requestService = async (userId: string, serviceId: string): Promise<ServiceRequest> => {
    await delay(800);
    const existingRequest = mockServiceRequests.find(req => req.userId === userId && req.serviceId === serviceId && (req.status === ServiceStatus.PENDING || req.status === ServiceStatus.IN_PROGRESS));
    if (existingRequest) {
        throw new Error("Vous avez déjà une demande en cours pour ce service.");
    }
    
    const newRequest: ServiceRequest = {
        id: `sreq_${Date.now()}`,
        userId,
        serviceId,
        status: ServiceStatus.PENDING,
        requestDate: new Date(),
    };
    mockServiceRequests.unshift(newRequest);
    return newRequest;
};

// --- Fonctions pour l'administrateur ---

export const getAllServiceRequests = async (): Promise<AdminServiceRequest[]> => {
    await delay(600);
    // Join request with user and service data
    const populatedRequests = mockServiceRequests.map(req => {
        const user = mockUsers.find(u => u.id === req.userId)!;
        const service = mockServices.find(s => s.id === req.serviceId)!;
        return { ...req, user, service };
    });
    return populatedRequests.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
};

export const updateServiceRequestStatus = async (requestId: string, status: ServiceStatus): Promise<ServiceRequest> => {
    await delay(700);
    const requestIndex = mockServiceRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
        throw new Error("Demande de service non trouvée.");
    }
    mockServiceRequests[requestIndex].status = status;
    if (status === ServiceStatus.COMPLETED) {
        mockServiceRequests[requestIndex].completionDate = new Date();
    }
    return mockServiceRequests[requestIndex];
};

// --- NEW FUNCTIONS FOR SERVICE CRUD ---

export const addService = async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
    await delay(500);
    const newService: Service = {
        ...serviceData,
        id: `serv_${Date.now()}`,
    };
    mockServices.unshift(newService);
    return newService;
};

export const updateService = async (updatedService: Service): Promise<Service> => {
    await delay(500);
    const serviceIndex = mockServices.findIndex(s => s.id === updatedService.id);
    if (serviceIndex === -1) {
        throw new Error("Service not found");
    }
    mockServices[serviceIndex] = updatedService;
    return updatedService;
};

export const deleteService = async (serviceId: string): Promise<void> => {
    await delay(500);
    const serviceIndex = mockServices.findIndex(s => s.id === serviceId);
    if (serviceIndex > -1) {
        mockServices.splice(serviceIndex, 1);
    } else {
        throw new Error("Service not found or could not be deleted");
    }
};
