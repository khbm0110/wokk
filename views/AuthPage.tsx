import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const AuthPage = () => {
    const { login, loginAsRole } = useAuth();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { t } = useLanguage();
    
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            addNotification(err.message || t('authPage.loginError'), 'error');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginAsDemo = async (role: UserRole) => {
        setLoadingRole(role);
        try {
            await loginAsRole(role);
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            addNotification(err.message || t('authPage.loginAsError', { role }), 'error');
            console.error(err);
        } finally {
            setLoadingRole(null);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-neutral dark:text-text-dark">
                        {t('authPage.title')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {t('authPage.or')} <Link to="/inscription" className="font-medium text-primary hover:text-primary/80">{t('authPage.createAccountLink')}</Link>
                    </p>
                </div>
                
                <form className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-md border border-border-light dark:border-border-dark space-y-6" onSubmit={handleLogin}>
                    <Input 
                        label={t('authPage.emailLabel')}
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                     <Input 
                        label={t('authPage.passwordLabel')}
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                     <Button 
                        type="submit"
                        className="w-full flex justify-center py-3"
                        isLoading={isLoading}
                        disabled={isLoading || !!loadingRole}
                    >
                       {t('authPage.loginButton')}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-background-light dark:bg-background-dark text-gray-500">
                            {t('authPage.demoPrompt')}
                        </span>
                    </div>
                </div>

                 <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md border border-border-light dark:border-border-dark space-y-3">
                    <Button 
                        onClick={() => handleLoginAsDemo(UserRole.INVESTOR)} 
                        className="w-full"
                        variant="ghost"
                        isLoading={loadingRole === UserRole.INVESTOR}
                        disabled={isLoading || !!loadingRole}
                    >
                       {t('authPage.demoInvestor')}
                    </Button>
                    <Button 
                        onClick={() => handleLoginAsDemo(UserRole.PROJECT_OWNER)} 
                        className="w-full"
                        variant="ghost"
                        isLoading={loadingRole === UserRole.PROJECT_OWNER}
                        disabled={isLoading || !!loadingRole}
                    >
                       {t('authPage.demoProjectOwner')}
                    </Button>
                     <Button 
                        onClick={() => handleLoginAsDemo(UserRole.SUPER_ADMIN)} 
                        className="w-full" 
                        variant="ghost"
                        isLoading={loadingRole === UserRole.SUPER_ADMIN}
                        disabled={isLoading || !!loadingRole}
                     >
                       {t('authPage.demoAdmin')}
                    </Button>
                    <Button 
                        onClick={() => handleLoginAsDemo(UserRole.VALIDATOR_ADMIN)} 
                        className="w-full" 
                        variant="ghost"
                        isLoading={loadingRole === UserRole.VALIDATOR_ADMIN}
                        disabled={isLoading || !!loadingRole}
                     >
                       {t('authPage.demoValidator')}
                    </Button>
                    <Button 
                        onClick={() => handleLoginAsDemo(UserRole.FINANCIAL_ADMIN)} 
                        className="w-full" 
                        variant="ghost"
                        isLoading={loadingRole === UserRole.FINANCIAL_ADMIN}
                        disabled={isLoading || !!loadingRole}
                     >
                       {t('authPage.demoFinancial')}
                    </Button>
                    <Button 
                        onClick={() => handleLoginAsDemo(UserRole.SERVICE_ADMIN)} 
                        className="w-full" 
                        variant="ghost"
                        isLoading={loadingRole === UserRole.SERVICE_ADMIN}
                        disabled={isLoading || !!loadingRole}
                     >
                       {t('authPage.demoServiceManager')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;