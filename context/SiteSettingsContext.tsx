// context/SiteSettingsContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { SiteSettings } from '../types';
import { getSiteSettings, updateSiteSettings as updateSettingsService } from '../services/siteSettingsService';
import Spinner from '../components/ui/Spinner';

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const siteSettings = await getSiteSettings();
        setSettings(siteSettings);
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    if (!settings) return;
    try {
        const updatedSettings = { ...settings, ...newSettings };
        await updateSettingsService(updatedSettings);
        setSettings(updatedSettings);
    } catch (error) {
        console.error("Failed to update site settings:", error);
        throw error;
    }
  }, [settings]);

  if (loading || !settings) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const value = {
    settings,
    loading,
    updateSettings,
  };

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
