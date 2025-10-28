// components/dashboard/admin/ContentManagement.tsx
import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { useNotification } from '../../../context/NotificationContext';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import { TeamMember, FooterLink, SiteSettings } from '../../../types';
import Tabs from '../../ui/Tabs';

const ContentManagement = () => {
    const { settings, updateSettings, loading: contextLoading } = useSiteSettings();
    const { addNotification } = useNotification();
    const [localSettings, setLocalSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);

    useEffect(() => {
        setLocalSettings(settings);
        setHeroImagePreview(settings.heroImageUrl);
    }, [settings]);
    
    const handleRootChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [field, lang] = name.split('.');
        setLocalSettings(prev => ({
            ...prev,
            [field]: { ...prev[field as keyof SiteSettings], [lang]: value }
        }));
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'hero' | 'member', memberId?: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImageUrl = reader.result as string;
                if(imageType === 'hero') {
                    setHeroImagePreview(newImageUrl);
                    setLocalSettings(prev => ({...prev, heroImageUrl: newImageUrl }));
                } else if (imageType === 'member' && memberId) {
                    setLocalSettings(prev => ({
                        ...prev,
                        teamMembers: prev.teamMembers.map(member => 
                            member.id === memberId ? { ...member, imageUrl: newImageUrl } : member
                        )
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            await updateSettings(localSettings);
            addNotification('Paramètres du site mis à jour avec succès !', 'success');
        } catch (error) {
            addNotification('Erreur lors de la mise à jour des paramètres.', 'error');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleMemberChange = (id: string, field: keyof TeamMember | keyof TeamMember['socials'], value: string, isSocial = false) => {
        setLocalSettings(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.map(member => {
                if (member.id === id) {
                    if (isSocial) {
                        return { ...member, socials: { ...member.socials, [field as keyof TeamMember['socials']]: value } };
                    }
                    return { ...member, [field as keyof TeamMember]: value };
                }
                return member;
            })
        }));
    };

    const handleAddMember = () => {
        const newMember: TeamMember = {
            id: `team_${Date.now()}`,
            name: 'Nouveau Membre',
            role: 'Nouveau Rôle',
            bio: '',
            imageUrl: 'https://i.pravatar.cc/150',
            socials: { linkedin: '#', twitter: '#' }
        };
        setLocalSettings(prev => ({
            ...prev,
            teamMembers: [...prev.teamMembers, newMember]
        }));
    };

    const handleDeleteMember = (id: string) => {
        setLocalSettings(prev => ({
            ...prev,
            teamMembers: prev.teamMembers.filter(member => member.id !== id)
        }));
    };

    const handleFooterDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name: lang, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            footer: {
                ...prev.footer,
                description: { ...prev.footer.description, [lang]: value }
            }
        }));
    };

    const handleSocialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name: platform, value } = e.target;
         setLocalSettings(prev => ({
            ...prev,
            footer: {
                ...prev.footer,
                socials: {
                    ...prev.footer.socials,
                    [platform]: value
                }
            }
        }));
    };

    const handleFooterLinkChange = (listName: 'navigationLinks' | 'legalLinks', id: string, field: 'text.fr' | 'text.ar' | 'url', value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            footer: {
                ...prev.footer,
                [listName]: prev.footer[listName].map(link => {
                    if (link.id !== id) return link;
                    if (field === 'url') {
                        return { ...link, url: value };
                    }
                    const [, lang] = field.split('.'); // e.g. "text.fr" -> "fr"
                    return { ...link, text: { ...link.text, [lang]: value } };
                })
            }
        }));
    };

    const handleAddFooterLink = (listName: 'navigationLinks' | 'legalLinks') => {
        const newLink: FooterLink = { id: `footer_link_${Date.now()}`, text: { fr: 'Nouveau lien', ar: 'رابط جديد' }, url: '#' };
        setLocalSettings(prev => ({
            ...prev,
            footer: {
                ...prev.footer,
                [listName]: [...prev.footer[listName], newLink]
            }
        }));
    };
    
    const handleDeleteFooterLink = (listName: 'navigationLinks' | 'legalLinks', id: string) => {
        setLocalSettings(prev => ({
            ...prev,
            footer: {
                ...prev.footer,
                [listName]: prev.footer[listName].filter(link => link.id !== id)
            }
        }));
    };
    
    if (contextLoading) {
        return <div className="flex justify-center py-20"><Spinner /></div>;
    }
    
    const homePageContent = (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre Principal</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Français" id="heroTitle-fr" name="heroTitle.fr" value={localSettings.heroTitle.fr} onChange={handleRootChange} />
                    <Input label="Arabe" id="heroTitle-ar" name="heroTitle.ar" value={localSettings.heroTitle.ar} onChange={handleRootChange} dir="rtl"/>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sous-titre</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea name="heroSubtitle.fr" rows={3} className="block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.heroSubtitle.fr} onChange={handleRootChange} />
                    <textarea name="heroSubtitle.ar" rows={3} className="block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.heroSubtitle.ar} onChange={handleRootChange} dir="rtl"/>
                </div>
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bouton 1</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Texte (Français)" id="heroButton1Text-fr" name="heroButton1Text.fr" value={localSettings.heroButton1Text.fr} onChange={handleRootChange} />
                    <Input label="Texte (Arabe)" id="heroButton1Text-ar" name="heroButton1Text.ar" value={localSettings.heroButton1Text.ar} onChange={handleRootChange} dir="rtl"/>
                </div>
                 <Input label="URL" id="heroButton1Url-url" name="heroButton1Url" value={localSettings.heroButton1Url} onChange={(e) => setLocalSettings(p => ({...p, heroButton1Url: e.target.value}))} />
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bouton 2</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Texte (Français)" id="heroButton2Text-fr" name="heroButton2Text.fr" value={localSettings.heroButton2Text.fr} onChange={handleRootChange} />
                    <Input label="Texte (Arabe)" id="heroButton2Text-ar" name="heroButton2Text.ar" value={localSettings.heroButton2Text.ar} onChange={handleRootChange} dir="rtl"/>
                </div>
                 <Input label="URL" id="heroButton2Url-url" name="heroButton2Url" value={localSettings.heroButton2Url} onChange={(e) => setLocalSettings(p => ({...p, heroButton2Url: e.target.value}))} />
            </div>

             <div>
                <label htmlFor="heroImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image de fond</label>
                <div className="mt-2 flex items-center gap-4">
                    {heroImagePreview && <img src={heroImagePreview} alt="Aperçu" className="w-48 h-24 object-cover rounded-md"/>}
                    <input type="file" id="heroImageUrl" accept="image/*" onChange={(e) => handleImageChange(e, 'hero')} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"/>
                </div>
            </div>
        </div>
    );

    const teamContent = (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre de la section</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Français" id="teamSectionTitle-fr" name="teamSectionTitle.fr" value={localSettings.teamSectionTitle.fr} onChange={handleRootChange} />
                    <Input label="Arabe" id="teamSectionTitle-ar" name="teamSectionTitle.ar" value={localSettings.teamSectionTitle.ar} onChange={handleRootChange} dir="rtl"/>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description de la section</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea name="teamSectionDescription.fr" rows={3} className="block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.teamSectionDescription.fr} onChange={handleRootChange} />
                    <textarea name="teamSectionDescription.ar" rows={3} className="block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.teamSectionDescription.ar} onChange={handleRootChange} dir="rtl"/>
                </div>
            </div>
            
            <h3 className="text-md font-bold pt-4 border-t border-border-light dark:border-border-dark">Membres de l'équipe</h3>
            <div className="space-y-6">
                {localSettings.teamMembers.map(member => (
                    <div key={member.id} className="p-4 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-card-dark/50 space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">{member.name}</p>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteMember(member.id)}>Supprimer</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Nom" id={`member-name-${member.id}`} value={member.name} onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)} />
                            <Input label="Rôle" id={`member-role-${member.id}`} value={member.role} onChange={(e) => handleMemberChange(member.id, 'role', e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor={`member-bio-${member.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Biographie</label>
                            <textarea id={`member-bio-${member.id}`} rows={2} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={member.bio} onChange={(e) => handleMemberChange(member.id, 'bio', e.target.value)} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="URL LinkedIn" id={`member-linkedin-${member.id}`} value={member.socials.linkedin} onChange={(e) => handleMemberChange(member.id, 'linkedin', e.target.value, true)} />
                            <Input label="URL Twitter" id={`member-twitter-${member.id}`} value={member.socials.twitter} onChange={(e) => handleMemberChange(member.id, 'twitter', e.target.value, true)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Photo</label>
                             <div className="mt-2 flex items-center gap-4">
                                <img src={member.imageUrl} alt="Aperçu" className="w-16 h-16 object-cover rounded-full"/>
                                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'member', member.id)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="ghost" onClick={handleAddMember}>+ Ajouter un membre</Button>
        </div>
    );

    const servicesContent = (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre de la page Services</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Français" id="servicesPageTitle-fr" name="servicesPageTitle.fr" value={localSettings.servicesPageTitle.fr} onChange={handleRootChange} />
                    <Input label="Arabe" id="servicesPageTitle-ar" name="servicesPageTitle.ar" value={localSettings.servicesPageTitle.ar} onChange={handleRootChange} dir="rtl"/>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description de la page Services</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea name="servicesPageDescription.fr" rows={3} className="block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.servicesPageDescription.fr} onChange={handleRootChange} />
                    <textarea name="servicesPageDescription.ar" rows={3} className="block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.servicesPageDescription.ar} onChange={handleRootChange} dir="rtl" />
                </div>
            </div>
        </div>
    );

    const footerContent = (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description courte</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea name="fr" rows={2} className="block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.footer.description.fr} onChange={handleFooterDescriptionChange} />
                    <textarea name="ar" rows={2} className="block w-full border-gray-300 dark:border-gray-600 dark:bg-card-dark rounded-md shadow-sm" value={localSettings.footer.description.ar} onChange={handleFooterDescriptionChange} dir="rtl" />
                </div>
            </div>
            <div>
                <h3 className="font-bold mb-2">Réseaux Sociaux</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="URL Facebook" name="facebook" id="social-facebook" value={localSettings.footer.socials.facebook} onChange={handleSocialsChange} />
                    <Input label="URL Twitter" name="twitter" id="social-twitter" value={localSettings.footer.socials.twitter} onChange={handleSocialsChange} />
                    <Input label="URL LinkedIn" name="linkedin" id="social-linkedin" value={localSettings.footer.socials.linkedin} onChange={handleSocialsChange} />
                    <Input label="URL Instagram" name="instagram" id="social-instagram" value={localSettings.footer.socials.instagram} onChange={handleSocialsChange} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border-light dark:border-border-dark">
                <div>
                    <h3 className="font-bold mb-2">Liens de Navigation</h3>
                    <div className="space-y-4">
                        {localSettings.footer.navigationLinks.map(link => (
                            <div key={link.id} className="p-3 border rounded-lg space-y-2">
                                <div className="flex gap-2">
                                    <Input label="Texte (FR)" id={`nav-text-fr-${link.id}`} value={link.text.fr} onChange={(e) => handleFooterLinkChange('navigationLinks', link.id, 'text.fr', e.target.value)} />
                                    <Input label="Texte (AR)" id={`nav-text-ar-${link.id}`} value={link.text.ar} onChange={(e) => handleFooterLinkChange('navigationLinks', link.id, 'text.ar', e.target.value)} dir="rtl"/>
                                </div>
                                <Input label="URL" id={`nav-url-${link.id}`} value={link.url} onChange={(e) => handleFooterLinkChange('navigationLinks', link.id, 'url', e.target.value)} />
                                <button onClick={() => handleDeleteFooterLink('navigationLinks', link.id)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
                            </div>
                        ))}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleAddFooterLink('navigationLinks')}>+ Ajouter un lien</Button>
                </div>
                 <div>
                    <h3 className="font-bold mb-2">Liens Légaux</h3>
                     <div className="space-y-4">
                        {localSettings.footer.legalLinks.map(link => (
                             <div key={link.id} className="p-3 border rounded-lg space-y-2">
                                <div className="flex gap-2">
                                    <Input label="Texte (FR)" id={`legal-text-fr-${link.id}`} value={link.text.fr} onChange={(e) => handleFooterLinkChange('legalLinks', link.id, 'text.fr', e.target.value)} />
                                    <Input label="Texte (AR)" id={`legal-text-ar-${link.id}`} value={link.text.ar} onChange={(e) => handleFooterLinkChange('legalLinks', link.id, 'text.ar', e.target.value)} dir="rtl"/>
                                </div>
                                <Input label="URL" id={`legal-url-${link.id}`} value={link.url} onChange={(e) => handleFooterLinkChange('legalLinks', link.id, 'url', e.target.value)} />
                                <button onClick={() => handleDeleteFooterLink('legalLinks', link.id)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
                            </div>
                        ))}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleAddFooterLink('legalLinks')}>+ Ajouter un lien</Button>
                </div>
            </div>
        </div>
    );
    
    const tabs = [
        { label: "Page d'accueil", content: homePageContent },
        { label: "Équipe", content: teamContent },
        { label: "Services", content: servicesContent },
        { label: "Pied de page", content: footerContent },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <div>
                    <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Gestion du Contenu</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Modifiez les textes, images et liens de votre site public.</p>
                </div>
                <Button onClick={handleSaveChanges} isLoading={isSaving} disabled={isSaving}>
                    Enregistrer les modifications
                </Button>
            </div>
            
            <Card>
                <Tabs tabs={tabs} />
            </Card>
        </div>
    );
};

export default ContentManagement;