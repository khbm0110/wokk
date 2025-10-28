// views/DepositPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNotification } from '../context/NotificationContext';
import { makeDeposit } from '../services/walletService';
import { useLanguage } from '../context/LanguageContext';

const DepositPage = () => {
    const [amount, setAmount] = useState(1000);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const { currency } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await makeDeposit('wlt_inv1', amount); // Mock wallet ID
            addNotification(`Dépôt de ${amount} ${currency} réussi !`, 'success');
            navigate('/dashboard');
        } catch (error) {
            addNotification("Une erreur est survenue lors du dépôt.", 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <Card>
                <h1 className="text-2xl font-bold text-center mb-2">Effectuer un Dépôt</h1>
                <p className="text-center text-gray-600 mb-8">Ajoutez des fonds à votre portefeuille digital pour commencer à investir.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        label={`Montant à Déposer (${currency})`} 
                        id="amount" 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min="100"
                        required 
                    />

                    <div>
                        <h3 className="block text-sm font-medium text-gray-700">Méthode de Paiement</h3>
                        <div className="mt-2 space-y-2">
                           <div className="flex items-center p-3 border rounded-md">
                               <input id="credit-card" name="payment-method" type="radio" className="focus:ring-primary h-4 w-4 text-primary border-gray-300" defaultChecked/>
                               <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                                   Carte Bancaire (Visa, Mastercard)
                               </label>
                           </div>
                             <div className="flex items-center p-3 border rounded-md bg-gray-50 opacity-60">
                               <input id="bank-transfer" name="payment-method" type="radio" className="focus:ring-primary h-4 w-4 text-primary border-gray-300" disabled/>
                               <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-500">
                                   Virement Bancaire (Bientôt disponible)
                               </label>
                           </div>
                        </div>
                    </div>

                    <div className="text-right pt-4 border-t">
                        <Button type="submit" isLoading={isLoading}>
                            {isLoading ? 'Traitement...' : `Déposer ${amount} ${currency}`}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default DepositPage;
