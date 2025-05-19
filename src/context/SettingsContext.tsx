import React, { createContext, useState, useContext, useEffect } from "react";

import { Settings } from "@/types";
import { storage } from "wxt/utils/storage";
import { defaultSettings } from "@/constants/defaultSettings";

interface SettingsContextType {
  settings: Settings | null;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  getSetting: <K extends keyof Settings>(key: K) => Settings[K] | undefined;
  isSettingsLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children
}) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings =
          await storage.getItem<Settings>("local:settings");

        if (storedSettings) {
          setSettings(storedSettings);
        } else {
          setSettings(defaultSettings);
          await storage.setItem<Settings>("local:settings", defaultSettings);
        }
      } catch {
        setSettings(defaultSettings);
      } finally {
        setIsSettingsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  const updateSetting = async <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prevSettings) => {
      const newSettings: Settings = {
        ...(prevSettings ?? defaultSettings),
        [key]: value
      };

      storage.setItem("local:settings", newSettings).catch(() => {});

      return newSettings;
    });
  };

  const getSetting = <K extends keyof Settings>(
    key: K
  ): Settings[K] | undefined => {
    return settings?.[key];
  };

  const value: SettingsContextType = {
    settings,
    updateSetting,
    getSetting,
    isSettingsLoaded
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};
