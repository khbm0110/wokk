


import React, { useState, useEffect, useMemo } from 'react';
import { getAllProjects, getAdmins, updateProjectStatus } from '../../../services/adminService';
import { getReportsByProject, publishReport } from '../../../services/reportService'; // New import
import { Project, ProjectStatus, User, Report, ReportStatus } from '../../../types'; // New import
import Card from '../../ui/Card';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';
import { useNotification } from '../../../context/NotificationContext';
import { useLanguage } from '../../../context/LanguageContext';
import Input from '../../ui/Input';

const ProjectStatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
    const styles = {
        [ProjectStatus.ACTIVE]: 'bg-green-100 text-green-800',
        [ProjectStatus.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-800',
        [ProjectStatus.FUNDED]: 'bg-blue-100 text-blue-800',
        [ProjectStatus.COMPLETED]: 'bg-indigo-100 text-indigo-800',
        [ProjectStatus.FAILED]: 'bg-red-100 text-red-800',
        [ProjectStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    };
    return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>{status.replace(/_/g, ' ')}</span>;
}

const ActionModal: React.FC<{ project: Project, admins: Partial<User>[], action: 'approve' | 'reject', onClose: () => void, onConfirm: (project: Project, supervisorId: string, message: string, newEquity: number) => void }> = ({ project, admins, action, onClose, onConfirm }) => {
    const { language, t } = useLanguage();
    const [message, setMessage] = useState('');
    const [supervisorId, setSupervisorId] = useState(admins[0]?.id || '');
    const [equityValue, setEquityValue] = useState(project.equityOffered);
    const title = action === 'approve' ? 'Valider' : 'Refuser';
    const defaultMessage = action === 'approve'
        ? `Bonjour, votre projet "${project.title[language]}" a été approuvé et est maintenant visible par les investisseurs. Bonne chance !`
        : `Bonjour, après examen, votre projet "${project.title[language]}" ne peut être accepté en l'état. Veuillez consulter vos emails pour les détails et les modifications requises.`;

    useEffect(() => setMessage(defaultMessage), [defaultMessage]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4">
                <h2 className="text-xl font-bold">{title} le projet: {project.title[language]}</h2>
                <div>
                    <label className="block text-sm font-medium">Superviseur du projet</label>
                    <select value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)} className="w-full p-2 border rounded-md mt-1">
                        {admins.map(admin => <option key={admin.id} value={admin.id}>{admin.firstName} {admin.lastName}</option>)}
                    </select>
                </div>
                {action === 'approve' && (
                    <Input
                        label={t('admin.projects.modal.equityLabel')}
                        id="equityOffered"
                        type="number"
                        min="1"
                        max="100"
                        value={equityValue}
                        onChange={(e) => setEquityValue(Number(e.target.value))}
                    />
                )}
                <div>
                    <label className="block text-sm font-medium">Message au porteur de projet</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="ghost" onClick={onClose}>Annuler</Button>
                    <Button variant={action === 'approve' ? 'primary' : 'danger'} onClick={() => onConfirm(project, supervisorId, message, equityValue)}>
                        Confirmer et Notifier
                    </Button>
                </div>
            </div>
        </div>
    );
};

// *** NEW COMPONENT: Management Modal ***
const ManagementModal: React.FC<{
    project: Project,
    onClose: () => void,
}> = ({ project, onClose }) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();
    const { language } = useLanguage();

    const fetchReports = async () => {
        setLoading(true);
        try {
            const reportsData = await getReportsByProject(project.id);
            setReports(reportsData);
        } catch (e) {
            addNotification("Erreur lors du chargement des rapports.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [project.id]);

    const handlePublish = async (reportId: string) => {
        try {
            await publishReport(reportId);
            addNotification("Rapport publié avec succès aux investisseurs.", "success");
            fetchReports(); // Refresh the list
        } catch (error) {
            addNotification("Erreur lors de la publication du rapport.", "error");
        }
    };
    
    const ReportStatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
        const styles = {
            [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
            [ReportStatus.PUBLISHED]: 'bg-green-100 text-green-800',
        };
        return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>{status === 'PENDING' ? 'En attente' : 'Publié'}</span>;
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-card-dark p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center pb-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-bold">Gérer le projet : {project.title[language]}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="overflow-y-auto mt-4 space-y-4">
                    <h3 className="font-bold">Rapports et Mises à Jour</h3>
                    {loading ? <Spinner /> : (
                        <div className="space-y-3">
                            {reports.length > 0 ? reports.map(report => (
                                <div key={report.id} className="p-3 border rounded-md bg-gray-50 dark:bg-card-dark/50">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="font-semibold">{report.title}</p>
                                            <p className="text-xs text-gray-500">Soumis le: {report.submittedAt.toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <ReportStatusBadge status={report.status} />
                                            {report.status === ReportStatus.PENDING && (
                                                <Button size="sm" onClick={() => handlePublish(report.id)}>Publier</Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{report.content}</p>
                                     {report.fileName && (
                                        <div className="mt-2 text-sm text-primary flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">attachment</span>
                                            Fichier joint : {report.fileName}
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-center text-gray-500 py-4">Aucun rapport soumis.</p>}
                        </div>
                    )}
                </div>
                 <div className="mt-6 flex justify-end">
                    <Button variant="ghost" onClick={onClose}>Fermer</Button>
                </div>
            </div>
        </div>
    );
};


const ProjectManagement = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [admins, setAdmins] = useState<Partial<User>[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [modalState, setModalState] = useState<{ project: Project; action: 'approve' | 'reject' } | null>(null);
    const [manageModalProject, setManageModalProject] = useState<Project | null>(null); // New state for management modal
    const { addNotification } = useNotification();
    // Fix: Get currency from language context
    const { language, currency: CURRENCY } = useLanguage();

    useEffect(() => {
        Promise.all([getAllProjects(), getAdmins()]).then(([projectsData, adminsData]) => {
            setProjects(projectsData);
            setAdmins(adminsData);
            setLoading(false);
        });
    }, []);

    const handleActionConfirm = async (project: Project, supervisorId: string, message: string, newEquity: number) => {
        const newStatus = modalState?.action === 'approve' ? ProjectStatus.ACTIVE : ProjectStatus.FAILED; // Simplified, could be REJECTED status
        try {
            await updateProjectStatus(project.id, newStatus, supervisorId, message, newEquity);
            setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: newStatus, supervisorId, equityOffered: newEquity } : p));
            addNotification(`Statut du projet "${project.title[language]}" mis à jour.`, 'success');
        } catch (error) {
            addNotification('Erreur lors de la mise à jour.', 'error');
        } finally {
            setModalState(null);
        }
    };

    const filteredProjects = useMemo(() => {
        if (filter === 'all') return projects;
        return projects.filter(p => p.status === filter);
    }, [projects, filter]);

    if (loading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }

    return (
        <Card>
            {modalState && <ActionModal {...modalState} admins={admins} onClose={() => setModalState(null)} onConfirm={handleActionConfirm} />}
            {manageModalProject && <ManagementModal project={manageModalProject} onClose={() => setManageModalProject(null)} />}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Gestion des Projets ({filteredProjects.length})</h2>
                 <select onChange={(e) => setFilter(e.target.value)} className="border rounded-md p-2">
                    <option value="all">Tous</option>
                    {/* FIX: Explicitly cast 'status' to string to fix type inference issue. */}
                    {Object.values(ProjectStatus).map((status: string) => (
                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Projet</th>
                            <th className="px-6 py-3">Objectif</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="px-6 py-3">Dates</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map(p => (
                             <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">{p.title[language]}<p className="font-normal text-gray-400">{p.owner.firstName} {p.owner.lastName}</p></td>
                                <td className="px-6 py-4">{new Intl.NumberFormat('fr-MA').format(p.fundingGoal)} {CURRENCY}</td>
                                <td className="px-6 py-4"><ProjectStatusBadge status={p.status} /></td>
                                <td className="px-6 py-4">{new Date(p.startDate).toLocaleDateString('fr-FR')} - {new Date(p.deadline).toLocaleDateString('fr-FR')}</td>
                                <td className="px-6 py-4">
                                    {p.status === ProjectStatus.PENDING_APPROVAL ? (
                                         <div className="flex space-x-2">
                                            <Button size="sm" onClick={() => setModalState({ project: p, action: 'approve' })}>Valider</Button>
                                            <Button size="sm" variant="danger" onClick={() => setModalState({ project: p, action: 'reject' })}>Refuser</Button>
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="ghost" onClick={() => setManageModalProject(p)}>Gérer</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </Card>
    );
};

export default ProjectManagement;