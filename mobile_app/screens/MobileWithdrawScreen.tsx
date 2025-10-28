// mobile_app/screens/MobileWithdrawScreen.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

const MobileWithdrawScreen = () => {
    const { user } = useAuth();
    const { currency } = useLanguage();
    const [amount, setAmount] = useState(100);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        // Simulate withdrawal logic
        setTimeout(() => {
            addNotification(`Demande de retrait de ${amount} ${currency} soumise avec succès.`, 'success');
            navigate('/mobile/wallet');
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="p-4 space-y-6">
            <div className="bg-white dark:bg-card-dark p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                           Montant à Retirer ({currency})
                        </label>
                        <input 
                            id="amount" 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min="50"
                            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-background-dark dark:border-border-dark"
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="rib" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                           RIB (Relevé d'Identité Bancaire)
                        </label>
                        <input 
                            id="rib" 
                            type="text" 
                            placeholder="123 456 78901234567890 12"
                            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-background-dark dark:border-border-dark"
                            required 
                        />
                         <p className="text-xs text-gray-500 mt-1">Les fonds seront transférés sur ce compte bancaire.</p>
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={isLoading} className="w-full py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50">
                            {isLoading ? 'Traitement...' : `Demander le retrait de ${amount} ${currency}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MobileWithdrawScreen;
