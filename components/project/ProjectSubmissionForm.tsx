

import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { addProject } from '../../services/projectService';
import { Project, ProjectStatus, ProjectStage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { generateProjectDescription, translateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';


const ProjectSubmissionForm = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        title: { fr: '', ar: '' },
        category: '',
        location: '',
        fundingGoal: 10000,
        startDate: '',
        deadline: '',
        minimumInvestment: 1000,
        equityOffered: 20,
        description: { fr: '', ar: '' },
        // Fix: Add stage to form data state
        stage: ProjectStage.IDEA,
    });
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    // AI Modal State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Translation State
    const [isTranslating, setIsTranslating] = useState<'title' | 'description' | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type, name } = e.target;

        if (name && (name.startsWith('title.') || name.startsWith('description.'))) {
            const [field, lang] = name.split('.') as ['title' | 'description', 'fr' | 'ar'];
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [lang]: value
                }
            }));
        } else {
            setFormData(prev => ({ 
                ...prev, 
                [id]: type === 'number' ? Number(value) : value 
            }));
        }
    };
    
    const handleTranslate = async (field: 'title' | 'description', sourceLang: 'fr' | 'ar', targetLang: 'fr' | 'ar') => {
        const textToTranslate = formData[field][sourceLang];
        if (!textToTranslate.trim()) {
            const langName = sourceLang === 'fr' ? t('common.lang.fr') : t('common.lang.ar');
            addNotification(t('poDashboard.projectSubmit.fillSourceLangFirst', { lang: langName }), "error");
            return;
        }
        setIsTranslating(field);
        try {
            const translatedText = await translateText(textToTranslate, targetLang);
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [targetLang]: translatedText
                }
            }));
        } catch (error: any) {
            addNotification(error.message || t('poDashboard.projectSubmit.translationError'), "error");
        } finally {
            setIsTranslating(null);
        }
    };


    const handleGenerateDescription = async () => {
        if (!aiPrompt.trim()) {
            addNotification(t('poDashboard.projectSubmit.aiPromptError'), "error");
            return;
        }
        setIsGenerating(true);
        setGeneratedDescription('');
        try {
            const description = await generateProjectDescription(aiPrompt);
            setGeneratedDescription(description);
        } catch (error: any) {
            addNotification(error.message || t('poDashboard.projectSubmit.aiGenerationError'), "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUseDescription = () => {
        setFormData(prev => ({ ...prev, description: { ...prev.description, fr: generatedDescription } }));
        setIsAiModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            addNotification(t('poDashboard.projectSubmit.loginRequired'), "error");
            return;
        }

        setSubmissionStatus('submitting');
        
        const newProject: Omit<Project, 'id'> = {
            title: formData.title,
            category: formData.category,
            location: formData.location,
            fundingGoal: formData.fundingGoal,
            currentFunding: 0,
            startDate: new Date(formData.startDate),
            deadline: new Date(formData.deadline),
            minimumInvestment: formData.minimumInvestment,
            equityOffered: formData.equityOffered,
            description: formData.description,
            status: ProjectStatus.PENDING_APPROVAL,
            // Fix: Add stage property to new project object
            stage: formData.stage,
            owner: { // Denormalized owner info for easy display
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePictureUrl: user.profilePictureUrl || `https://i.pravatar.cc/150?u=${user.id}`,
                bio: user.bio || '',
                // Add other necessary User fields if needed, but keep it minimal
                email: user.email,
                role: user.role,
                phone: user.phone,
                kycStatus: user.kycStatus,
                createdAt: user.createdAt,
            },
            imageUrl: `https://picsum.photos/seed/${formData.title.fr.replace(/\s/g, '')}/600/400`, // Placeholder image based on french title
            // businessPlanUrl will be handled by file upload later
        };

        try {
            await addProject(newProject);
            setSubmissionStatus('success');
            addNotification(t('poDashboard.projectSubmit.submitSuccess'), "success");
        } catch (error) {
            console.error("Error submitting project:", error);
            addNotification(t('poDashboard.projectSubmit.submitError'), "error");
            setSubmissionStatus('idle');
        }
    };

    if (submissionStatus === 'success') {
        return (
            <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold mt-4 text-green-800 dark:text-green-200">{t('poDashboard.projectSubmit.successTitle')}</h3>
                <p className="text-green-700 dark:text-green-300 mt-2">
                   {t('poDashboard.projectSubmit.successDesc')}
                </p>
                <div className="mt-6">
                    <Button onClick={() => setSubmissionStatus('idle')}>{t('poDashboard.projectSubmit.submitAnother')}</Button>
                </div>
            </div>
        )
    }

    const fileInputClasses = "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90";

    return (
        <>
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold">{t('poDashboard.projectSubmit.title')}</h2>

            <div>
                <Input label={t('poDashboard.projectSubmit.titleFr')} name="title.fr" type="text" value={formData.title.fr} onChange={handleChange} required />
                 <div className="flex justify-center my-2">
                    <Button type="button" size="sm" variant="ghost" onClick={() => handleTranslate('title', 'fr', 'ar')} disabled={isTranslating === 'title'}>
                        {isTranslating === 'title' ? t('poDashboard.projectSubmit.translating') : t('poDashboard.projectSubmit.translateToAr')}
                        <span className="material-symbols-outlined text-base ml-1 rtl:mr-1">translate</span>
                    </Button>
                </div>
                <Input label={t('poDashboard.projectSubmit.titleAr')} name="title.ar" type="text" value={formData.title.ar} onChange={handleChange} dir="rtl" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label={t('poDashboard.projectSubmit.category')} id="category" type="text" value={formData.category} onChange={handleChange} placeholder="Ex: Agriculture, Technologie" required />
                <Input label={t('poDashboard.projectSubmit.location')} id="location" type="text" value={formData.location} onChange={handleChange} placeholder="Ex: Casablanca" required />
            </div>
            {/* Fix: Add UI for selecting project stage */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.stage')}</label>
                <div className="mt-2 flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="stage"
                            value={ProjectStage.IDEA}
                            checked={formData.stage === ProjectStage.IDEA}
                            onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value as ProjectStage }))}
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                        />
                        <span className="text-sm">{t('projectStage.IDEA')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="stage"
                            value={ProjectStage.GROWTH}
                            checked={formData.stage === ProjectStage.GROWTH}
                            onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value as ProjectStage }))}
                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                        />
                        <span className="text-sm">{t('projectStage.GROWTH')}</span>
                    </label>
                </div>
            </div>

            {formData.stage === ProjectStage.GROWTH && (
                <div className="space-y-6 p-6 border-l-4 border-primary bg-primary/5 dark:bg-primary/10 rounded-r-lg animate-fade-in">
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-primary">{t('poDashboard.projectSubmit.financialDocsTitle')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('poDashboard.projectSubmit.financialDocsDesc')}</p>
                    </div>

                    <div>
                        <label htmlFor="financial-statements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.financialStatements')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('poDashboard.projectSubmit.financialStatementsDesc')}</p>
                        <input type="file" id="financial-statements" multiple required className={fileInputClasses} />
                    </div>
                    
                    <div>
                        <label htmlFor="bank-statements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.bankStatements')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('poDashboard.projectSubmit.bankStatementsDesc')}</p>
                        <input type="file" id="bank-statements" multiple required className={fileInputClasses} />
                    </div>
                    
                    <div>
                        <label htmlFor="tax-declarations" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.taxDeclarations')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('poDashboard.projectSubmit.taxDeclarationsDesc')}</p>
                        <input type="file" id="tax-declarations" multiple required className={fileInputClasses} />
                    </div>

                    <h3 className="text-lg font-bold text-primary pt-4 border-t border-primary/20">{t('poDashboard.projectSubmit.legalDocsTitle')}</h3>

                    <div>
                        <label htmlFor="commercial-registration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.commercialRegistration')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('poDashboard.projectSubmit.commercialRegistrationDesc')}</p>
                        <input type="file" id="commercial-registration" multiple required className={fileInputClasses} />
                    </div>
                    
                    <div>
                        <label htmlFor="ownership-proof" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.ownershipProof')}</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('poDashboard.projectSubmit.ownershipProofDesc')}</p>
                        <input type="file" id="ownership-proof" multiple required className={fileInputClasses} />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label={t('poDashboard.projectSubmit.startDate')} id="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                <Input label={t('poDashboard.projectSubmit.deadline')} id="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label={t('poDashboard.projectSubmit.goal')} id="fundingGoal" type="number" min="10000" value={formData.fundingGoal} onChange={handleChange} required />
                <Input label={t('poDashboard.projectSubmit.minInvestment')} id="minimumInvestment" type="number" min="100" value={formData.minimumInvestment} onChange={handleChange} required />
                <Input label={t('poDashboard.projectSubmit.equityOffered')} id="equityOffered" type="number" min="1" max="100" value={formData.equityOffered} onChange={handleChange} required />
            </div>
            <div>
                 <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.descriptionFr')}</label>
                    <button type="button" onClick={() => setIsAiModalOpen(true)} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                        <span className="material-symbols-outlined text-base">auto_awesome</span>
                        {t('poDashboard.projectSubmit.aiHelper')}
                    </button>
                </div>
                <textarea
                    name="description.fr"
                    rows={6}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card-light text-neutral dark:bg-card-dark dark:text-text-dark"
                    value={formData.description.fr}
                    onChange={handleChange}
                    required
                />
            </div>
             <div>
                 <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.descriptionAr')}</label>
                    <Button type="button" size="sm" variant="ghost" onClick={() => handleTranslate('description', 'fr', 'ar')} disabled={isTranslating === 'description'}>
                        {isTranslating === 'description' ? t('poDashboard.projectSubmit.translating') : t('poDashboard.projectSubmit.translateToAr')}
                        <span className="material-symbols-outlined text-base ml-1 rtl:mr-1">translate</span>
                    </Button>
                </div>
                <textarea
                    name="description.ar"
                    rows={6}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card-light text-neutral dark:bg-card-dark dark:text-text-dark"
                    value={formData.description.ar}
                    onChange={handleChange}
                    dir="rtl"
                    required
                />
            </div>

            <div>
                <label htmlFor="business-plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.businessPlan')}</label>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('poDashboard.projectSubmit.businessPlanDesc')}</p>
                <input type="file" id="business-plan" className={fileInputClasses} required />
            </div>
            <div className="text-right pt-4 border-t dark:border-border-dark">
                <Button type="submit" isLoading={submissionStatus === 'submitting'} disabled={submissionStatus === 'submitting'}>
                    {submissionStatus === 'submitting' ? t('poDashboard.projectSubmit.submitButtonLoading') : t('poDashboard.projectSubmit.submitButton')}
                </Button>
            </div>
        </form>

        {isAiModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={() => setIsAiModalOpen(false)}>
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center p-6 border-b border-border-light dark:border-border-dark">
                        <h2 className="text-xl font-bold text-text-light-primary dark:text-white">{t('ai.modalTitle')}</h2>
                        <button type="button" onClick={() => setIsAiModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-4">
                        <div>
                            <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('ai.modalPrompt')}</label>
                            <textarea
                                id="ai-prompt"
                                rows={3}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm p-2 bg-card-light text-neutral dark:text-text-dark"
                                placeholder={t('ai.modalPlaceholder')}
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleGenerateDescription} isLoading={isGenerating} disabled={isGenerating} className="w-full">
                            {isGenerating ? t('ai.generating') : t('ai.generateButton')}
                        </Button>
                        
                        {(isGenerating || generatedDescription) && (
                            <div className="pt-4 border-t border-border-light dark:border-border-dark">
                                {isGenerating ? (
                                    <div className="flex justify-center items-center h-32"><Spinner /></div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectSubmit.aiResult')}</label>
                                        <textarea readOnly rows={6} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md shadow-sm p-2 bg-gray-50" value={generatedDescription} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-6 mt-auto border-t border-border-light dark:border-border-dark flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsAiModalOpen(false)}>{t('ai.close')}</Button>
                        <Button onClick={handleUseDescription} disabled={!generatedDescription || isGenerating}>
                            {t('ai.useThisDescription')}
                        </Button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default ProjectSubmissionForm;