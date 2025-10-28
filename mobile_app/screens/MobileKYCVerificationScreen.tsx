// mobile_app/screens/MobileKYCVerificationScreen.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import KYCForm from '../../components/auth/KYCForm';
import { useNavigate } from 'react-router-dom';

const MobileKYCVerificationScreen: React.FC<{ rejected?: boolean }> = ({ rejected }) => {
    const { user, completeRegistration } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    if (!user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call for document upload and processing
        setTimeout(() => {
            completeRegistration(user.role);
            sessionStorage.setItem('kyc_submitted', 'true'); // Flag to prevent redirect loop
            setIsLoading(false);
            alert("Vos documents ont été soumis pour vérification. Vous serez notifié une fois le processus terminé.");
            // Force a reload or redirect to trigger the router's logic again
            navigate('/mobile/dashboard', { replace: true });
            window.location.reload(); // Simple way to force state refresh
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-4">
            <div className="w-full max-w-md mx-auto bg-white dark:bg-card-dark p-6 rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Vérification d'Identité</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Pour la sécurité de la plateforme, veuillez soumettre les documents requis.
                    </p>
                    {rejected && (
                        <p className="mt-2 text-sm p-2 bg-red-50 text-red-700 rounded-md">
                            Votre précédente soumission a été rejetée. Veuillez vérifier vos documents et soumettre à nouveau.
                        </p>
                    )}
                </div>
                
                <div className="mt-8">
                    <KYCForm 
                        userRole={user.role as UserRole.INVESTOR} // This app is investor only
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default MobileKYCVerificationScreen;