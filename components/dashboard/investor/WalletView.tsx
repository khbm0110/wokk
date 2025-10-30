

import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Transaction, TransactionType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import { useLanguage } from '../../../context/LanguageContext';

interface WalletViewProps {
    wallet: Wallet | null;
    transactions: Transaction[];
}

interface TransactionRowProps {
    transaction: Transaction;
}

// FIX: Changed to React.FC to correctly handle the 'key' prop when used in a list.
const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
    const { currency, language } = useLanguage();
    const isDebit = transaction.type === TransactionType.INVESTMENT || transaction.type === TransactionType.WITHDRAWAL;
    const amountColor = isDebit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
    const amountPrefix = isDebit ? '-' : '+';
    
    return (
        <tr className="bg-card-light dark:bg-card-dark border-b dark:border-border-dark">
            <td className="px-6 py-4 text-text-light dark:text-text-dark">{transaction.date.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}</td>
            <td className="px-6 py-4 font-medium text-text-light dark:text-text-dark">{transaction.type}</td>
            <td className="px-6 py-4 text-text-light/80 dark:text-text-dark/80">{transaction.description}</td>
            <td className={`px-6 py-4 font-bold ${amountColor}`}>{amountPrefix} {new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-FR').format(transaction.amount)} {currency}</td>
            <td className="px-6 py-4">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">{transaction.status}</span>
            </td>
        </tr>
    );
}

const WalletView = ({ wallet, transactions }: WalletViewProps) => {
    const { currency, t } = useLanguage();
    if (!wallet) {
        return <Card><div className="flex justify-center py-10"><Spinner /></div></Card>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h3 className="font-semibold text-text-light/80 dark:text-text-dark/80">{t('wallet.currentBalance')}</h3>
                        <p className="text-3xl font-bold font-display text-text-light dark:text-text-dark">{new Intl.NumberFormat('fr-MA').format(wallet.balance)} {currency}</p>
                    </div>
                    <div className="flex space-x-2">
                        <Link to="/depot">
                            <Button>{t('wallet.deposit')}</Button>
                        </Link>
                        <Link to="/retrait">
                            <Button variant="ghost">{t('wallet.withdraw')}</Button>
                        </Link>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="font-bold text-xl mb-4 text-text-light dark:text-text-dark">{t('wallet.history')}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-card-dark/80">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('wallet.date')}</th>
                                <th scope="col" className="px-6 py-3">{t('wallet.type')}</th>
                                <th scope="col" className="px-6 py-3">{t('wallet.description')}</th>
                                <th scope="col" className="px-6 py-3">{t('wallet.amount')}</th>
                                <th scope="col" className="px-6 py-3">{t('wallet.status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map(t => <TransactionRow key={t.id} transaction={t} />)
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-text-light/60 dark:text-text-dark/60">{t('wallet.noTransactions')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default WalletView;