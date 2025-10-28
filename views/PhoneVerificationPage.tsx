import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import { useLanguage } from '../context/LanguageContext';

const PhoneVerificationPage = () => {
    const { role } = useParams<{ role: string }>();
    const navigate = useNavigate();
    const { user, loading, updateAuthUser } = useAuth();
    const { t } = useLanguage();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);

    const MOCK_OTP = '123456';

    useEffect(() => {
        if (!loading && !user?.phone) {
            const rolePath = role?.toLowerCase() === 'investisseur' ? 'investisseur' : 'porteur_de_projet';
            navigate(`/inscription/${rolePath}`);
        }
    }, [user, loading, navigate, role]);

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
            setIsVerified(true);
        } else {
            setError(t('phoneVerification.incorrectCode'));
            setIsVerified(false);
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
    
    const handleNext = () => {
        navigate(`/verification/${role}`);
    };

    if (loading) {
        return (
             <div className="container mx-auto max-w-2xl py-12 px-4">
                <div className="bg-white dark:bg-card-dark p-8 rounded-xl shadow-lg flex justify-center items-center h-96 border border-border-light dark:border-border-dark">
                    <Spinner />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <div className="bg-white dark:bg-card-dark p-8 rounded-xl shadow-lg border border-border-light dark:border-border-dark">
                <h2 className="text-2xl font-bold text-center mb-2 text-text-light dark:text-text-dark">{t('phoneVerification.title')}</h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                    {t('phoneVerification.subtitle', { phone: user?.phone })}
                </p>

                {isVerified ? (
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                        <p className="font-bold">{t('phoneVerification.success')}</p>
                        <p className="text-sm">{t('phoneVerification.continueKyc')}</p>
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500 mb-8">{t('phoneVerification.prompt')}</p>
                )}
                
                <form onSubmit={handleVerify} className="space-y-6 mt-6">
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                            {t('phoneVerification.otpLabel')}
                        </label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="mt-2 appearance-none block w-full max-w-xs mx-auto px-3 py-2 border border-gray-300 dark:border-border-dark dark:bg-background-dark rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-lg text-center tracking-[0.5em]"
                            disabled={isVerified}
                            required
                        />
                    </div>

                    {error && <p className="text-center text-sm text-red-600">{error}</p>}

                    {!isVerified && (
                        <div className="text-center">
                            <Button type="submit">{t('phoneVerification.verifyButton')}</Button>
                        </div>
                    )}
                </form>

                <div className="mt-6 text-center text-sm">
                    <button onClick={handleResend} disabled={resendCooldown > 0 || isSending} className="text-primary hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed">
                        {isSending ? t('phoneVerification.resendButtonSending') : (resendCooldown > 0 ? t('phoneVerification.resendCooldown', { seconds: resendCooldown }) : t('phoneVerification.resendButton'))}
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark text-right">
                    <Button onClick={handleNext} disabled={!isVerified}>
                        {t('phoneVerification.nextButton')}
                    </Button>
                </div>
                 <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-8">{t('roleSelection.loginPrompt')} <Link to="/connexion" className="text-primary hover:underline font-semibold">{t('roleSelection.loginLink')}</Link></p>
            </div>
        </div>
    );
};

export default PhoneVerificationPage;