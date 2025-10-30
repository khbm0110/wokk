// views/WithdrawPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNotification } from '../context/NotificationContext';
import { requestWithdrawal, getWallet } from '../services/walletService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

const WithdrawPage = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const { t, currency } = useLanguage();

    const [amount, setAmount] = useState(100);
    const [rib, setRib] = useState('');
    const [bankName, setBankName] = useState('');
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBalance, setLoadingBalance] = useState(true);

    useEffect(() => {
        if(user) {
            getWallet(user.id).then(wallet => {
                setBalance(wallet?.balance || 0);
                setLoadingBalance(false);
            });
            if (user.bankInfo) {
                setRib(user.bankInfo.rib);
                setBankName(user.bankInfo.bankName);
            }
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        if (balance === null || amount > balance) {
            addNotification(t('withdraw.insufficientBalance'), "error");
            return;
        }

        if (rib.length !== 24 || !/^\d+$/.test(rib)) {
            addNotification(t('withdraw.invalidRib'), "error");
            return;
        }

        setIsLoading(true);
        try {
            await requestWithdrawal(user.id, amount, rib, bankName);
            addNotification(t('withdraw.success'), 'success');
            navigate('/dashboard');
        } catch (error: any) {
            addNotification(error.message || t('withdraw.error'), 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <Card>
                <h1 className="text-2xl font-bold text-center mb-2">{t('withdraw.title')}</h1>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-8">{t('withdraw.subtitle')}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="p-4 bg-primary/10 rounded-lg text-center">
                        <p className="text-sm text-primary/80">{t('withdraw.availableBalance')}</p>
                        {loadingBalance ? <Spinner/> : <p className="text-2xl font-bold text-primary">{new Intl.NumberFormat('fr-MA').format(balance ?? 0)} {currency}</p>}
                    </div>

                    <Input 
                        label={`${t('withdraw.amountLabel')} (${currency})`}
                        id="amount" 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min="100"
                        max={balance ?? 0}
                        required 
                    />

                    <Input 
                        label={t('withdraw.bankNameLabel')}
                        id="bankName" 
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Ex: Attijariwafa Bank"
                        required 
                    />

                    <Input 
                        label={t('withdraw.ribLabel')}
                        id="rib" 
                        type="text"
                        value={rib}
                        onChange={(e) => setRib(e.target.value.replace(/\s/g, ''))}
                        placeholder={t('withdraw.ribPlaceholder')}
                        maxLength={24}
                        required 
                    />
                    
                    <p className="text-xs text-center text-gray-500">{t('withdraw.info')}</p>

                    <div className="text-right pt-4 border-t dark:border-border-dark">
                        <Button type="submit" isLoading={isLoading}>
                            {isLoading ? t('withdraw.submitButtonLoading') : t('withdraw.submitButton')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default WithdrawPage;