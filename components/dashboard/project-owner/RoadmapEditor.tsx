// components/dashboard/project-owner/RoadmapEditor.tsx
import React, { useState, useEffect } from 'react';
import { Project, RoadmapMilestone, MilestoneStatus, LocalizedString } from '../../../types';
import { useLanguage } from '../../../context/LanguageContext';
import { useNotification } from '../../../context/NotificationContext';
import { updateProjectRoadmap } from '../../../services/projectService';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

interface RoadmapEditorProps {
    project: Project;
    onRoadmapUpdate: (updatedProject: Project) => void;
}

const RoadmapEditor: React.FC<RoadmapEditorProps> = ({ project, onRoadmapUpdate }) => {
    const { t } = useLanguage();
    const { addNotification } = useNotification();
    const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Deep copy to prevent direct mutation of props
        setRoadmap(project.roadmap ? JSON.parse(JSON.stringify(project.roadmap)) : []);
    }, [project.roadmap]);

    const handleMilestoneChange = (index: number, field: keyof RoadmapMilestone, value: string | Date | LocalizedString) => {
        const newRoadmap = [...roadmap];
        (newRoadmap[index] as any)[field] = value;
        setRoadmap(newRoadmap);
    };

    const handleLocalizedStringChange = (index: number, field: 'title' | 'description', lang: 'fr' | 'ar', value: string) => {
        const newRoadmap = [...roadmap];
        newRoadmap[index][field][lang] = value;
        setRoadmap(newRoadmap);
    };

    const handleAddMilestone = () => {
        const newMilestone: RoadmapMilestone = {
            id: `ms_${Date.now()}`,
            title: { fr: '', ar: '' },
            description: { fr: '', ar: '' },
            targetDate: new Date(),
            status: MilestoneStatus.NOT_STARTED,
        };
        setRoadmap([...roadmap, newMilestone]);
    };

    const handleDeleteMilestone = (id: string) => {
        setRoadmap(roadmap.filter(ms => ms.id !== id));
    };

    const handleSaveRoadmap = async () => {
        setIsSaving(true);
        try {
            const updatedProject = await updateProjectRoadmap(project.id, roadmap);
            addNotification(t('poDashboard.projectManage.saveSuccess'), 'success');
            onRoadmapUpdate(updatedProject);
        } catch (error) {
            console.error(error);
            addNotification(t('poDashboard.projectManage.saveError'), 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const formatDateForInput = (date: Date | string) => {
        try {
            return new Date(date).toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    }

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">{t('poDashboard.projectManage.manageRoadmapTitle')}</h2>
            <div className="space-y-6">
                {roadmap.map((milestone, index) => (
                    <div key={milestone.id} className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:bg-card-dark/50 relative">
                         <button 
                            type="button"
                            onClick={() => handleDeleteMilestone(milestone.id)} 
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                            aria-label={t('poDashboard.projectManage.deleteMilestone')}
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Input label={t('poDashboard.projectManage.milestoneTitleFr')} id={`title-fr-${index}`} value={milestone.title.fr} onChange={(e) => handleLocalizedStringChange(index, 'title', 'fr', e.target.value)} />
                           <Input label={t('poDashboard.projectManage.milestoneTitleAr')} id={`title-ar-${index}`} value={milestone.title.ar} onChange={(e) => handleLocalizedStringChange(index, 'title', 'ar', e.target.value)} dir="rtl" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectManage.milestoneDescFr')}</label>
                             <textarea rows={3} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm p-2" value={milestone.description.fr} onChange={(e) => handleLocalizedStringChange(index, 'description', 'fr', e.target.value)} />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectManage.milestoneDescAr')}</label>
                             <textarea rows={3} dir="rtl" className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm p-2" value={milestone.description.ar} onChange={(e) => handleLocalizedStringChange(index, 'description', 'ar', e.target.value)} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label={t('poDashboard.projectManage.targetDate')} id={`date-${index}`} type="date" value={formatDateForInput(milestone.targetDate)} onChange={(e) => handleMilestoneChange(index, 'targetDate', new Date(e.target.value))} />
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectManage.statusLabel')}</label>
                                <select value={milestone.status} onChange={(e) => handleMilestoneChange(index, 'status', e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-border-dark dark:bg-card-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                    {Object.values(MilestoneStatus).map(status => (
                                        <option key={status} value={status}>{t(`milestone.status.${status}`)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
                
                <Button variant="ghost" onClick={handleAddMilestone}>
                    + {t('poDashboard.projectManage.addMilestone')}
                </Button>
            </div>
            <div className="text-right mt-6 border-t dark:border-border-dark pt-4">
                <Button onClick={handleSaveRoadmap} isLoading={isSaving}>
                    {t('poDashboard.projectManage.saveRoadmap')}
                </Button>
            </div>
        </Card>
    );
};

export default RoadmapEditor;