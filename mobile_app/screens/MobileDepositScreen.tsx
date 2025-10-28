// mobile_app/screens/MobileDepositScreen.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { makeDeposit } from '../../services/walletService';
import { useLanguage } from '../../context/LanguageContext';

const MobileDepositScreen = () => {
    const { user } = useAuth();
    const { currency } = useLanguage();
    const [amount, setAmount] = useState(1000);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        try {
            // In a real app, we'd get the wallet ID from the user object or context
            await makeDeposit('wlt_inv1', amount); // Using mock wallet ID for now
            addNotification(`Dépôt de ${amount} ${currency} réussi !`, 'success');
            navigate('/mobile/wallet');
        } catch (error) {
            addNotification("Une erreur est survenue lors du dépôt.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <div className="bg-white dark:bg-card-dark p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                           Montant à Déposer ({currency})
                        </label>
                        <input 
                            id="amount" 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min="100"
                            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-background-dark dark:border-border-dark"
                            required 
                        />
                    </div>

                    <div>
                        <h3 className="block text-sm font-medium text-gray-700 dark:text-gray-300">Méthode de Paiement</h3>
                        <div className="mt-2 space-y-2">
                           <div className="flex items-center p-3 border rounded-md dark:border-border-dark">
                               <input id="credit-card" name="payment-method" type="radio" className="focus:ring-primary h-4 w-4 text-primary border-gray-300" defaultChecked/>
                               <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                   Carte Bancaire
                               </label>
                           </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={isLoading} className="w-full py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50">
                            {isLoading ? 'Traitement...' : `Déposer ${amount} ${currency}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MobileDepositScreen;
