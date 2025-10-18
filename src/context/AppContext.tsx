import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig, translations } from '../config/app.config';

interface AppContextType {
  config: AppConfig;
  updateLanguage: (language: 'en' | 'zh-TW') => Promise<void>;
  updateTheme: (theme: 'light' | 'dark') => Promise<void>;
  t: (key: string) => string;
}

const defaultConfig: AppConfig = {
  language: 'zh-TW',
  theme: 'dark',
};

const AppContext = createContext<AppContextType>({
  config: defaultConfig,
  updateLanguage: async () => {},
  updateTheme: async () => {},
  t: (key: string) => key,
});

export const useApp = () => useContext(AppContext);

const STORAGE_KEY = 'finora_app_config';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading app config:', error);
    }
  };

  const saveConfig = async (newConfig: AppConfig) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error('Error saving app config:', error);
    }
  };

  const updateLanguage = async (language: 'en' | 'zh-TW') => {
    await saveConfig({ ...config, language });
  };

  const updateTheme = async (theme: 'light' | 'dark') => {
    await saveConfig({ ...config, theme });
  };

  const t = (key: string): string => {
    const lang = config.language;
    const langTranslations = translations[lang];
    
    // Navigate nested keys (e.g., "home.title")
    const keys = key.split('.');
    let value: any = langTranslations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <AppContext.Provider value={{ config, updateLanguage, updateTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};
