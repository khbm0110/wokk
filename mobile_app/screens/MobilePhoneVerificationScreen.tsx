// mobile_app/screens/MobilePhoneVerificationScreen.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MobilePhoneVerificationScreen = () => {
    const { user, updateAuthUser } = useAuth();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);

    const MOCK_OTP = '123456'; // For demo purposes

    useEffect(() => {
        let timer: number;
        if (resendCooldown > 0) {
            timer = window.setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp === MOCK_OTP) {
            updateAuthUser({ phoneVerified: true });
            // The main router in MobileApp.tsx will automatically redirect
        } else {
            setError('Code incorrect, veuillez réessayer.');
        }
    };

    const handleResend = () => {
        if (resendCooldown === 0) {
            setIsSending(true);
            setTimeout(() => {
                setIsSending(false);
                setResendCooldown(30);
                alert(`Un nouveau code a été envoyé à ${user?.phone}`);
            }, 1000);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4">
            <div className="w-full max-w-sm p-6 bg-white dark:bg-card-dark rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Vérification du Téléphone</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Un code a été envoyé à <span className="font-semibold">{user?.phone}</span>.
                    </p>
                </div>
                
                <form onSubmit={handleVerify} className="space-y-6 mt-6">
                    <div>
                        <label htmlFor="otp" className="sr-only">Code OTP</label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="w-full px-3 py-3 border rounded-md text-center tracking-[0.5em] text-lg dark:bg-background-dark dark:border-border-dark"
                            required
                        />
                    </div>

                    {error && <p className="text-center text-sm text-red-600">{error}</p>}

                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-md font-semibold">
                        Vérifier
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <button onClick={handleResend} disabled={resendCooldown > 0 || isSending} className="text-primary hover:underline disabled:text-gray-400">
                        {isSending ? 'Envoi...' : `Renvoyer ${resendCooldown > 0 ? `(${resendCooldown}s)` : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobilePhoneVerificationScreen;