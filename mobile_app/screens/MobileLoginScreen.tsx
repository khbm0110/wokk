
// mobile_app/screens/MobileLoginScreen.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types';

const MobileLoginScreen = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Attempt to log in, the AuthContext will fetch the user data
            await login(email, password);
            // The routing logic in MobileApp.tsx will handle redirection
            // based on the user's role.
            navigate('/mobile/dashboard', { replace: true });
        } catch (err: any) {
            addNotification(err.message || 'Email ou mot de passe incorrect.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLoginAsDemoInvestor = async () => {
        setIsLoading(true);
         try {
            await login("ahmed@investor.com", "password"); // Hardcoded demo investor login
            navigate('/mobile/dashboard', { replace: true });
        } catch (err: any) {
            addNotification(err.message || `Impossible de se connecter en tant qu'investisseur de démo.`, 'error');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="material-symbols-outlined text-6xl text-primary">savings</span>
                    <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mt-2">InvestMaroc Investor</h1>
                    <p className="text-gray-600 dark:text-gray-400">Accès exclusif pour les investisseurs.</p>
                </div>
                
                <form className="bg-white dark:bg-card-dark p-6 rounded-lg shadow-md space-y-4" onSubmit={handleLogin}>
                    <input 
                        type="email"
                        placeholder="Adresse Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-background-dark dark:border-border-dark"
                        required
                    />
                     <input 
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-background-dark dark:border-border-dark"
                        required
                    />
                     <button 
                        type="submit"
                        className="w-full py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50"
                        disabled={isLoading}
                    >
                       {isLoading ? 'Connexion...' : 'Connexion'}
                    </button>
                </form>

                 <div className="mt-6 text-center">
                    <button onClick={handleLoginAsDemoInvestor} className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50" disabled={isLoading}>
                        {isLoading ? '...' : "Continuer comme démo"}
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default MobileLoginScreen;
