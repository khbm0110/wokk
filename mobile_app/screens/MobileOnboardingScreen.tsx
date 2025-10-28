// mobile_app/screens/MobileOnboardingScreen.tsx
import React, { useState, useRef, TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';


// --- SVG Illustrations as React Components ---

const OnboardingIcon1 = () => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
            <radialGradient id="coinGrad" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="3" dy="5" result="offsetblur"/>
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <style>{`
                @keyframes growSprout { 
                    from { stroke-dashoffset: 200; } 
                    to { stroke-dashoffset: 0; } 
                }
                @keyframes fadeInLeaf { 
                    from { opacity: 0; transform: scale(0.5); } 
                    to { opacity: 1; transform: scale(1); } 
                }
                @keyframes subtleRotate {
                    0% { transform: rotateY(0deg); }
                    50% { transform: rotateY(15deg); }
                    100% { transform: rotateY(0deg); }
                }
                .coin-group { animation: subtleRotate 8s ease-in-out infinite; transform-origin: center; }
                .sprout-path { stroke-dasharray: 200; stroke-dashoffset: 200; animation: growSprout 1.5s ease-out 0.5s forwards; }
                .sprout-leaf { opacity: 0; animation: fadeInLeaf 0.7s ease-out 1.8s forwards; transform-origin: bottom right; }
            `}</style>
        </defs>
        <g style={{ filter: 'url(#dropShadow)' }} className="coin-group">
            {/* Coin 3D effect */}
            <ellipse cx="100" cy="135" rx="50" ry="20" fill="#D97706" />
            <ellipse cx="100" cy="130" rx="50" ry="20" fill="url(#coinGrad)" stroke="#FDE68A" strokeWidth="1" />
            <text x="100" y="136" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fff" fillOpacity="0.8">MAD</text>
        </g>
        <g>
            {/* Sprout */}
            <path d="M 100 120 C 90 80, 130 70, 115 40" stroke="#10B981" strokeWidth="6" fill="none" strokeLinecap="round" className="sprout-path" />
            <g transform="translate(115, 40)">
                <path d="M 0 0 C 15 -4, 20 10, 0 15 Z" fill="#34D399" className="sprout-leaf" />
                <path d="M 0 0 C -15 -4, -20 10, 0 15 Z" fill="#6EE7B7" className="sprout-leaf" style={{ animationDelay: '2s' }}/>
            </g>
        </g>
    </svg>
);

const OnboardingIcon2 = () => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#06E0CA" />
            </linearGradient>
            <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <clipPath id="shieldClip">
                <path d="M 100,25 C 40,35 30,100 100,175 C 170,100 160,35 100,25 Z" />
            </clipPath>
            <filter id="shieldShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="4" dy="8" stdDeviation="5" floodColor="#0d9488" floodOpacity="0.3"/>
            </filter>
            <style>{`
                @keyframes popShield { 
                    from { transform: scale(0.7); opacity: 0; } 
                    to { transform: scale(1); opacity: 1; } 
                }
                @keyframes starPulse { 
                    0%, 100% { transform: scale(1); opacity: 0.8; } 
                    50% { transform: scale(1.1); opacity: 1; } 
                }
                @keyframes shine { 
                    0% { x: -150; } 
                    100% { x: 200; } 
                }
                .shield-base { animation: popShield 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .star { animation: starPulse 3s ease-in-out infinite 1s; transform-origin: center; }
                .shine-effect { animation: shine 3s ease-in-out infinite 1.5s; }
            `}</style>
        </defs>
        <g filter="url(#shieldShadow)">
            <path d="M 100,25 C 40,35 30,100 100,175 C 170,100 160,35 100,25 Z" fill="#042f2e" transform="translate(2, 4)" opacity="0.5"/>
            <path d="M 100,25 C 40,35 30,100 100,175 C 170,100 160,35 100,25 Z" fill="url(#shieldGrad)" className="shield-base" />

            <g transform="translate(100, 100) scale(2.5)" className="star">
                <path d="M0 -10 L2.939 -4.045 L9.511 -3.09 L4.755 1.545 L6.18 8.09 L0 5 L-6.18 8.09 L-4.755 1.545 L-9.511 -3.09 L-2.939 -4.045Z" fill="white" fillOpacity="0.8"/>
            </g>

            <rect x="-150" y="0" width="100" height="200" fill="url(#shineGrad)" clipPath="url(#shieldClip)" className="shine-effect" transform="skewX(-20)" />
        </g>
    </svg>
);

const OnboardingIcon3 = () => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
            <radialGradient id="nodeGradCore" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#06b6d4" />
            </radialGradient>
            <filter id="nodeShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
            </filter>
            <style>{`
                @keyframes popNode { from { r: 0; } }
                @keyframes pulseLine { from { stroke-width: 1; } to { stroke-width: 3; } }
                @keyframes orbit1 { from { transform: rotate(0deg) translateX(60px) rotate(0deg); } to { transform: rotate(360deg) translateX(60px) rotate(-360deg); } }
                @keyframes orbit2 { from { transform: rotate(60deg) translateX(65px) rotate(-60deg); } to { transform: rotate(420deg) translateX(65px) rotate(-420deg); } }
                @keyframes orbit3 { from { transform: rotate(120deg) translateX(60px) rotate(-120deg); } to { transform: rotate(480deg) translateX(60px) rotate(-480deg); } }
                .node { animation: popNode 0.5s ease-out forwards; }
                .line { animation: pulseLine 1.5s ease-in-out alternate infinite; }
                .orbiting-node { transform-origin: 100px 100px; }
                #n1 { animation: orbit1 15s linear infinite; }
                #n2 { animation: orbit2 18s linear infinite reverse; }
                #n3 { animation: orbit3 16s linear infinite; }
            `}</style>
        </defs>

        <g filter="url(#nodeShadow)">
            <line x1="100" y1="100" x2="160" y2="100" stroke="url(#nodeGradCore)" strokeWidth="2" className="line" style={{animationDelay: '0s'}} transform-origin="center" />
            <line x1="100" y1="100" x2="77.5" y2="42.2" stroke="url(#nodeGradCore)" strokeWidth="2" className="line" style={{animationDelay: '0.5s'}} transform-origin="center" />
            <line x1="100" y1="100" x2="47.5" y2="132.2" stroke="url(#nodeGradCore)" strokeWidth="2" className="line" style={{animationDelay: '1s'}} transform-origin="center" />

            <circle cx="100" cy="100" r="20" fill="url(#nodeGradCore)" className="node" style={{animationDelay: '0s'}}/>

            <g id="n1" className="orbiting-node">
                <circle cx="0" cy="0" r="15" fill="#F59E0B" className="node" style={{animationDelay: '0.2s'}}/>
            </g>
            <g id="n2" className="orbiting-node">
                <circle cx="0" cy="0" r="12" fill="#3b82f6" className="node" style={{animationDelay: '0.4s'}}/>
            </g>
            <g id="n3" className="orbiting-node">
                <circle cx="0" cy="0" r="14" fill="#10b981" className="node" style={{animationDelay: '0.6s'}}/>
            </g>
        </g>
    </svg>
);


interface MobileOnboardingScreenProps {
  onDone: () => void;
}

const slides = [
  {
    icon: <OnboardingIcon1 />,
    title: "Investissez dans l'avenir",
    description: "Soutenez les projets locaux prometteurs et regardez votre investissement grandir.",
  },
  {
    icon: <OnboardingIcon2 />,
    title: 'Sécurisé et fiable',
    description: 'Investissez en toute sécurité avec notre plateforme qui garantit la protection de vos données et transactions.',
  },
  {
    icon: <OnboardingIcon3 />,
    title: 'Opportunités Diverses',
    description: 'Découvrez une large gamme de projets dans divers secteurs et obtenez des rendements attractifs.',
  },
];

const MobileOnboardingScreen: React.FC<MobileOnboardingScreenProps> = ({ onDone }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const navigate = useNavigate();

    const handleNext = () => {
        if (activeSlide < slides.length - 1) {
            setActiveSlide(prev => prev + 1);
        } else {
            onDone();
        }
    };

    const handleSkip = () => {
        onDone();
    };
    
    const handleLogin = () => {
        onDone();
        navigate('/mobile/login');
    }

    const handleTouchStart = (e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
        if (touchStartX.current === null) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX.current;
        const swipeThreshold = 50;

        if (deltaX < -swipeThreshold && activeSlide < slides.length - 1) { // Swiped left
            setActiveSlide(prev => prev + 1);
        } else if (deltaX > swipeThreshold && activeSlide > 0) { // Swiped right
            setActiveSlide(prev => prev - 1);
        }

        touchStartX.current = null;
    };

    return (
        <div 
            className="h-screen bg-background-light dark:bg-card-dark text-text-light-primary dark:text-white flex flex-col font-body overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Top Bar */}
            <div className="flex justify-between items-center pt-8 px-6 z-10">
                <div className="flex gap-1.5">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                index === activeSlide ? 'w-6 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-600'
                            }`}
                        />
                    ))}
                </div>
                {activeSlide < slides.length - 1 && (
                    <button onClick={handleSkip} className="text-gray-500 dark:text-gray-400 font-semibold text-sm">Passer</button>
                )}
            </div>

            {/* Slides Container */}
            <div className="flex-1 flex overflow-hidden">
                <div 
                    className="flex w-full h-full transition-transform duration-500 ease-in-out" 
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center p-6 h-full">
                            
                            {/* Illustration Area - Updated for better scaling */}
                            <div className="w-64 h-64">
                               {slide.icon}
                            </div>

                            {/* Text Area */}
                            <div className="flex-shrink-0 w-full max-w-xs pb-4 mt-8">
                                <h1 className="text-2xl font-bold font-display text-text-light dark:text-text-dark">
                                    {slide.title}
                                </h1>
                                <p className="mt-2 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {slide.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="px-6 pb-8 pt-4 space-y-4 z-10">
                <button 
                    onClick={handleNext} 
                    className="w-full h-14 bg-primary text-white rounded-full font-bold text-lg flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all active:scale-95"
                >
                    {activeSlide === slides.length - 1 ? 'Commencer' : 'Suivant'}
                </button>
                {activeSlide === slides.length - 1 && (
                    <button onClick={handleLogin} className="w-full text-center text-gray-600 dark:text-gray-300 font-semibold text-sm">
                        Se connecter
                    </button>
                )}
            </div>
        </div>
    );
};

export default MobileOnboardingScreen;