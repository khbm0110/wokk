// services/walletService.ts
import { Wallet, Transaction, TransactionType, WithdrawalRequest, WithdrawalStatus, User } from '../types';
import { mockWallets, mockTransactions, mockWithdrawalRequests, mockUsers } from './mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


export const getWallet = async (userId: string): Promise<Wallet | null> => {
  await delay(500);
  const wallet = mockWallets.find(w => w.userId === userId);
  return wallet || null;
};

export const getTransactions = async (walletId: string): Promise<Transaction[]> => {
  await delay(500);
  return mockTransactions
    .filter(t => t.walletId === walletId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const makeDeposit = async (walletId: string, amount: number): Promise<Transaction> => {
    await delay(1000);
    const wallet = mockWallets.find(w => w.id === walletId);
    if (!wallet) {
        throw new Error("Wallet does not exist!");
    }

    wallet.balance += amount;

    const newTransaction: Transaction = {
        id: `trn_${Date.now()}`,
        walletId,
        type: TransactionType.DEPOSIT,
        amount,
        description: 'Dépôt par carte bancaire',
        date: new Date(),
        status: 'Completed',
    };

    mockTransactions.unshift(newTransaction);
    return newTransaction;
};

// --- NEW WITHDRAWAL FUNCTIONS ---

export interface PopulatedWithdrawalRequest extends WithdrawalRequest {
  user: User;
}

export const requestWithdrawal = async (userId: string, amount: number, rib: string, bankName: string): Promise<WithdrawalRequest> => {
  await delay(1000);
  const wallet = mockWallets.find(w => w.userId === userId);
  if (!wallet) {
    throw new Error("Portefeuille non trouvé.");
  }
  if (wallet.balance < amount) {
    throw new Error("Solde insuffisant.");
  }
  if (amount <= 0) {
    throw new Error("Le montant doit être positif.");
  }

  // Deduct from balance immediately to "freeze" the funds
  wallet.balance -= amount;

  const newRequest: WithdrawalRequest = {
    id: `wreq_${Date.now()}`,
    userId,
    amount,
    rib,
    bankName,
    status: WithdrawalStatus.PENDING,
    requestDate: new Date(),
  };

  mockWithdrawalRequests.unshift(newRequest);
  
  // Also update user's bank info if it's new
  const user = mockUsers.find(u => u.id === userId);
  if (user && (!user.bankInfo || user.bankInfo.rib !== rib)) {
    user.bankInfo = { rib, bankName };
  }

  return newRequest;
};

export const getWithdrawalRequests = async (): Promise<PopulatedWithdrawalRequest[]> => {
  await delay(600);
  const populatedRequests = mockWithdrawalRequests.map(req => {
    const user = mockUsers.find(u => u.id === req.userId)!;
    return { ...req, user };
  });
  return populatedRequests.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
};

export const updateWithdrawalRequestStatus = async (requestId: string, newStatus: WithdrawalStatus, adminNotes?: string): Promise<WithdrawalRequest> => {
  await delay(700);
  const requestIndex = mockWithdrawalRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    throw new Error("Demande de retrait non trouvée.");
  }
  
  const request = mockWithdrawalRequests[requestIndex];

  // If rejected, refund the amount to the user's wallet
  if (newStatus === WithdrawalStatus.REJECTED && request.status === WithdrawalStatus.PENDING) {
    const wallet = mockWallets.find(w => w.userId === request.userId);
    if (wallet) {
      wallet.balance += request.amount;
    }
  }

  // If completed, create a transaction record
  if (newStatus === WithdrawalStatus.COMPLETED) {
    const wallet = mockWallets.find(w => w.userId === request.userId);
    if (wallet) {
       const newTransaction: Transaction = {
        id: `trn_w_${Date.now()}`,
        walletId: wallet.id,
        type: TransactionType.WITHDRAWAL,
        amount: request.amount,
        description: 'Retrait vers compte bancaire',
        date: new Date(),
        status: 'Completed',
    };
    mockTransactions.unshift(newTransaction);
    }
  }

  request.status = newStatus;
  request.decisionDate = new Date();
  if (adminNotes) {
    request.adminNotes = adminNotes;
  }
  
  return request;
};
