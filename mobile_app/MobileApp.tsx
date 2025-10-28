// mobile_app/MobileApp.tsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole, KYCStatus } from '../../types';

import MobileLayout from './components/MobileLayout';
import MobileLoginScreen from './screens/MobileLoginScreen';
import MobileHomeScreen from './screens/MobileHomeScreen';
import MobileProjectsScreen from './screens/MobileProjectsScreen';
import MobileProjectDetailsScreen from './screens/MobileProjectDetailsScreen';
import MobileProfileScreen from './screens/MobileProfileScreen';
import MobilePhoneVerificationScreen from './screens/MobilePhoneVerificationScreen';
import MobileKYCVerificationScreen from './screens/MobileKYCVerificationScreen';
import MobileDepositScreen from './screens/MobileDepositScreen';
import MobileNotificationsScreen from './screens/MobileNotificationsScreen';
import Spinner from '../../components/ui/Spinner';
import MobileWithdrawScreen from './screens/MobileWithdrawScreen';
import MobileAboutScreen from './screens/MobileAboutScreen';
import MobileInfoPageScreen from './screens/MobileInfoPageScreen';
import MobileOnboardingScreen from './screens/MobileOnboardingScreen';

interface MobileAppProps {
  theme: string;
  toggleTheme: () => void;
}

const MobileApp: React.FC<MobileAppProps> = ({ theme, toggleTheme }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const [onboardingComplete, setOnboardingComplete] = useState(() => !!localStorage.getItem('hasSeenOnboarding'));

    const handleOnboardingDone = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        setOnboardingComplete(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
                <Spinner />
            </div>
        );
    }

    // 1. First time user: show onboarding (no layout)
    if (!onboardingComplete) {
        return (
            <Routes>
                <Route path="/onboarding" element={<MobileOnboardingScreen onDone={handleOnboardingDone} />} />
                <Route path="/*" element={<Navigate to="/mobile/onboarding" replace />} />
            </Routes>
        );
    }

    // 2. Authenticated user: verification flow (no layout) or main app (with layout)
    if (isAuthenticated && user) {
        if (user.role !== UserRole.INVESTOR) {
            return <Navigate to="/" replace />;
        }
        if (!user.phoneVerified) {
             return (
                <Routes>
                    <Route path="/phone-verification" element={<MobilePhoneVerificationScreen />} />
                    <Route path="/*" element={<Navigate to="/mobile/phone-verification" replace />} />
                </Routes>
            );
        }
        if ((user.kycStatus === KYCStatus.PENDING || user.kycStatus === KYCStatus.REJECTED) && !sessionStorage.getItem('kyc_submitted')) {
             return (
                <Routes>
                    <Route path="/kyc-verification" element={<MobileKYCVerificationScreen rejected={user.kycStatus === KYCStatus.REJECTED} />} />
                    <Route path="/*" element={<Navigate to="/mobile/kyc-verification" replace />} />
                </Routes>
            );
        }
        // Verified user: show full app
        return (
            <MobileLayout theme={theme} toggleTheme={toggleTheme}>
                <Routes>
                    <Route path="/home" element={<MobileHomeScreen />} />
                    <Route path="/projects" element={<MobileProjectsScreen />} />
                    <Route path="/project/:id" element={<MobileProjectDetailsScreen />} />
                    <Route path="/profile" element={<MobileProfileScreen />} />
                    <Route path="/deposit" element={<MobileDepositScreen />} />
                    <Route path="/withdraw" element={<MobileWithdrawScreen />} />
                    <Route path="/notifications" element={<MobileNotificationsScreen />} />
                    <Route path="/about" element={<MobileAboutScreen />} />
                    <Route path="/about/:page" element={<MobileInfoPageScreen />} />
                    <Route path="/*" element={<Navigate to="/mobile/home" replace />} />
                </Routes>
            </MobileLayout>
        );
    }

    // 3. Unauthenticated user (guest) who has seen onboarding
    return (
        <Routes>
            <Route path="/login" element={<MobileLoginScreen />} />
            <Route path="/*" element={
                <MobileLayout theme={theme} toggleTheme={toggleTheme}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/home" element={<MobileHomeScreen />} />
                        <Route path="/projects" element={<MobileProjectsScreen />} />
                        <Route path="/project/:id" element={<MobileProjectDetailsScreen />} />
                        <Route path="/about" element={<MobileAboutScreen />} />
                        <Route path="/about/:page" element={<MobileInfoPageScreen />} />
                        
                        {/* If guest tries to access protected route, redirect to login */}
                        <Route path="/profile" element={<Navigate to="/mobile/login" replace />} />
                        <Route path="/deposit" element={<Navigate to="/mobile/login" replace />} />
                        <Route path="/withdraw" element={<Navigate to="/mobile/login" replace />} />
                        <Route path="/notifications" element={<Navigate to="/mobile/login" replace />} />
                        
                        <Route path="/*" element={<Navigate to="/mobile/home" replace />} />
                    </Routes>
                </MobileLayout>
            } />
        </Routes>
    );
};

export default MobileApp;