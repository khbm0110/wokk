import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, Report, ReportStatus } from '../types';
import { getProjectById } from '../services/projectService';
import { getReportsByProject, addReport } from '../services/reportService';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import Tabs from '../components/ui/Tabs';
import RoadmapEditor from '../components/dashboard/project-owner/RoadmapEditor';

const ReportStatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
    const { t } = useLanguage();
    const styles = {
        [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [ReportStatus.PUBLISHED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    const statusText = status === ReportStatus.PENDING ? t('poDashboard.projectManage.status.PENDING') : t('poDashboard.projectManage.status.PUBLISHED');
    return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>{statusText}</span>;
};

const ProjectOwnerManageProjectView = () => {
    const { id } = useParams<{ id: string }>();
    const { addNotification } = useNotification();
    const { t, language, currency } = useLanguage();
    const [project, setProject] = useState<Project | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [newReportTitle, setNewReportTitle] = useState('');
    const [newReportContent, setNewReportContent] = useState('');
    const [newReportFile, setNewReportFile] = useState<File | null>(null);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [projectData, reportsData] = await Promise.all([
                getProjectById(id),
                getReportsByProject(id),
            ]);
            setProject(projectData);
            setReports(reportsData);
        } catch (error) {
            console.error("Failed to fetch project management data:", error);
            addNotification("Erreur lors du chargement des données du projet.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);
    
    const onRoadmapUpdate = (updatedProject: Project) => {
        setProject(updatedProject);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewReportFile(e.target.files[0]);
        }
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project || !newReportTitle || !newReportContent) {
            addNotification("Le titre et le contenu sont obligatoires.", "error");
            return;
        }
        setIsSubmitting(true);
        try {
            const reportData = {
                projectId: project.id,
                title: newReportTitle,
                content: newReportContent,
                fileName: newReportFile?.name,
                fileType: newReportFile?.type,
            };
            await addReport(reportData);
            addNotification("Rapport soumis avec succès pour validation.", "success");
            // Reset form and refetch data
            setNewReportTitle('');
            setNewReportContent('');
            setNewReportFile(null);
            (document.getElementById('report-file') as HTMLInputElement).value = '';
            fetchData();
        } catch (error) {
            addNotification("Erreur lors de la soumission du rapport.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (!project) {
        return <div className="text-center py-20">Projet non trouvé.</div>;
    }

    const percentageFunded = Math.round((project.currentFunding / project.fundingGoal) * 100);

    const reportsTabContent = (
         <div className="space-y-8">
            <Card>
                <h2 className="text-xl font-bold mb-4">{t('poDashboard.projectManage.createUpdate')}</h2>
                <form onSubmit={handleSubmitReport} className="space-y-4">
                    <Input label={t('poDashboard.projectManage.updateTitle')} id="report-title" type="text" value={newReportTitle} onChange={(e) => setNewReportTitle(e.target.value)} required />
                    <div>
                        <label htmlFor="report-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectManage.updateContent')}</label>
                        <textarea id="report-content" rows={6} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm p-2" value={newReportContent} onChange={(e) => setNewReportContent(e.target.value)} required />
                        <p className="text-xs text-gray-500 mt-1">{t('poDashboard.projectManage.updateContentHelp')}</p>
                    </div>
                    <div>
                        <label htmlFor="report-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('poDashboard.projectManage.attachReport')}</label>
                        <input type="file" id="report-file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" />
                    </div>
                    <div className="text-right">
                        <Button type="submit" isLoading={isSubmitting}>{t('poDashboard.projectManage.submitForValidation')}</Button>
                    </div>
                </form>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">{t('poDashboard.projectManage.history')}</h2>
                <div className="space-y-4">
                    {reports.length > 0 ? reports.map(report => (
                        <div key={report.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{report.title}</h3>
                                    <p className="text-sm text-gray-500">Soumis le {report.submittedAt.toLocaleDateString('fr-FR')}</p>
                                </div>
                                <ReportStatusBadge status={report.status} />
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{report.content}</p>
                            {report.fileName && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                                    <span className="material-symbols-outlined">attachment</span>
                                    <span>{report.fileName}</span>
                                </div>
                            )}
                        </div>
                    )) : <p className="text-center text-gray-500 py-6">{t('poDashboard.projectManage.noUpdates')}</p>}
                </div>
            </Card>
        </div>
    );
    
    const roadmapTabContent = (
        <RoadmapEditor project={project} onRoadmapUpdate={onRoadmapUpdate} />
    );

    const tabs = [
        { label: t('poDashboard.projectManage.reportsTab'), content: reportsTabContent },
        { label: t('poDashboard.projectManage.roadmapTab'), content: roadmapTabContent },
    ];


    return (
        <div className="container mx-auto px-6 py-8">
            <nav className="text-sm mb-4">
                <Link to="/dashboard" className="text-primary hover:underline">{t('dashboard')}</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-500">{t('poDashboard.projectManage.breadcrumb', { title: project.title[language] })}</span>
            </nav>
            <h1 className="text-3xl font-bold mb-2">{t('poDashboard.projectManage.title', { title: project.title[language] })}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{t('poDashboard.projectManage.subtitle')}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Tabs tabs={tabs} />
                </div>

                <aside className="lg:sticky lg:top-24 h-fit">
                    <Card>
                         <h3 className="font-bold text-lg mb-4">{t('poDashboard.projectManage.statsTitle')}</h3>
                         <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">{t('wallet.status')}</span>
                                <span className="font-semibold">{project.status.replace(/_/g, ' ')}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">{t('poDashboard.projectManage.raisedFunds')}</span>
                                <span className="font-semibold">{new Intl.NumberFormat('fr-MA').format(project.currentFunding)} {currency}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">{t('poDashboard.projectManage.goal')}</span>
                                <span className="font-semibold">{new Intl.NumberFormat('fr-MA').format(project.fundingGoal)} {currency}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentageFunded}%` }}></div>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span>{percentageFunded}% {t('projectDetails.funded')}</span>
                                <span>{Math.max(0, Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} {t('projectDetails.daysLeft')}</span>
                            </div>
                         </div>
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default ProjectOwnerManageProjectView;