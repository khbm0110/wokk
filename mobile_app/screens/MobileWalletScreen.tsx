// mobile_app/screens/MobileWalletScreen.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getWallet, getTransactions } from '../../services/walletService';
import { Wallet, Transaction, TransactionType } from '../../types';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const MobileWalletScreen = () => {
    const { user } = useAuth();
    const { currency } = useLanguage();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const walletData = await getWallet(user.id);
                setWallet(walletData);
                if (walletData) {
                    const transactionsData = await getTransactions(walletData.id);
                    setTransactions(transactionsData);
                }
            } catch (error) {
                console.error("Failed to fetch wallet data for mobile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) {
        return <div className="p-4 flex justify-center items-center h-full"><Spinner /></div>;
    }
    
    return (
        <div className="p-4 space-y-6">
            <div className="bg-primary text-white p-6 rounded-xl shadow-lg text-center">
                <p className="text-sm opacity-80">Solde Actuel</p>
                <p className="text-4xl font-bold mt-1">{new Intl.NumberFormat('fr-MA').format(wallet?.balance || 0)} {currency}</p>
                <div className="mt-6 flex gap-4 justify-center">
                    <Link to="/mobile/deposit" className="bg-white text-primary font-semibold py-2 px-6 rounded-full">
                        Déposer
                    </Link>
                    <Link to="/mobile/withdraw" className="bg-white/20 text-white font-semibold py-2 px-6 rounded-full">
                        Retirer
                    </Link>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Historique des Transactions</h2>
                <div className="space-y-3">
                    {transactions.length > 0 ? transactions.map(t => (
                        <div key={t.id} className="bg-white dark:bg-card-dark p-4 rounded-lg shadow-md flex items-center">
                            <div className={`flex items-center justify-center size-10 rounded-full mr-4 ${t.type === TransactionType.DEPOSIT ? 'bg-green-100' : 'bg-red-100'}`}>
                                <span className={`material-symbols-outlined ${t.type === TransactionType.DEPOSIT ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === TransactionType.DEPOSIT ? 'add' : 'remove'}
                                </span>
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{t.description}</p>
                                <p className="text-xs text-gray-500">{t.date.toLocaleDateString('fr-FR')}</p>
                            </div>
                            <span className={`font-bold ${t.type === TransactionType.DEPOSIT ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === TransactionType.DEPOSIT ? '+' : '-'} {t.amount} {currency}
                            </span>
                        </div>
                    )) : <p className="text-center text-gray-500 py-6">Aucune transaction.</p>}
                </div>
            </div>
        </div>
    );
};

export default MobileWalletScreen;
