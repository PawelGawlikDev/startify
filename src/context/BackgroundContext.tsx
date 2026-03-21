import React, { createContext, useContext, useEffect, useState } from "react";
import backgrounds from "~/assets/backgrounds.json";
import { MS_PER_DAY } from "@/constants/time";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/storage";

const STORAGE_KEYS = {
  WALLPAPER: "userWallpaper",
  WALLPAPER_CUSTOM: "userWallpaperCustom",
  WALLPAPER_COLOR: "userWallpaperColor",
  CUSTOM_COLOR: "customColor",
  LAST_CHANGE: "wallpaperLastChange",
  USED_WALLPAPERS: "usedWallpapers"
} as const;

interface WallpaperContextProps {
  backgroundImageUrl: string | null;
  backgroundColor: string;
  defaultBgColor: string | null;
  setBackgroundImageUrl: (url: string | null) => void;
  setBackgroundColor: (color: string) => void;
}

const WallpaperContext = createContext<WallpaperContextProps>({
  backgroundImageUrl: null,
  backgroundColor: "var(--color-surface-900)",
  defaultBgColor: null,
  setBackgroundImageUrl: () => {},
  setBackgroundColor: () => {}
});

export const WallpaperProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    null
  );
  const [defaultBgColor, setDefaultBgColor] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    "var(--color-surface-900)"
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLPAPER);
    const isCustom =
      localStorage.getItem(STORAGE_KEYS.WALLPAPER_CUSTOM) === "true";
    const savedColor = localStorage.getItem(STORAGE_KEYS.WALLPAPER_COLOR);
    const customColor =
      localStorage.getItem(STORAGE_KEYS.CUSTOM_COLOR) === "true";

    if (saved && isCustom) {
      setBackgroundImageUrl(saved);
      if (savedColor) setBackgroundColor(savedColor);
      return;
    }

    if (customColor && savedColor) {
      setBackgroundColor(savedColor);
    }

    const lastChange = localStorage.getItem(STORAGE_KEYS.LAST_CHANGE);
    const now = Date.now();

    if (!lastChange || now - Number(lastChange) > MS_PER_DAY) {
      if (!customColor) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_COLOR, "false");
      }
      const allBackgrounds = backgrounds.backgrounds;
      const usedWallpapers = getLocalStorageItem<string[]>(
        STORAGE_KEYS.USED_WALLPAPERS,
        []
      );
      const unusedBackgrounds = allBackgrounds.filter(
        (bg) => !usedWallpapers.includes(bg.filename)
      );

      let selectedBg;
      let updatedUsed = [...usedWallpapers];

      if (unusedBackgrounds.length === 0) {
        selectedBg =
          allBackgrounds[Math.floor(Math.random() * allBackgrounds.length)];
        updatedUsed = [selectedBg.filename];
      } else {
        selectedBg =
          unusedBackgrounds[
            Math.floor(Math.random() * unusedBackgrounds.length)
          ];
        updatedUsed.push(selectedBg.filename);
      }

      const selectedBgColor =
        selectedBg.colors?.backgroundColor || "var(--color-surface-900)";
      setBackgroundImageUrl(selectedBg.filename);
      setDefaultBgColor(selectedBgColor);

      if (!customColor) {
        setBackgroundColor(selectedBgColor);
        setLocalStorageItem(STORAGE_KEYS.WALLPAPER_COLOR, selectedBgColor);
      }

      setLocalStorageItem(STORAGE_KEYS.WALLPAPER, selectedBg.filename);
      setLocalStorageItem(STORAGE_KEYS.WALLPAPER_CUSTOM, false);
      setLocalStorageItem(STORAGE_KEYS.LAST_CHANGE, now);
      setLocalStorageItem(STORAGE_KEYS.USED_WALLPAPERS, updatedUsed);
    } else {
      setBackgroundImageUrl(saved);
      setBackgroundColor(savedColor || "var(--color-surface-900)");
    }
  }, []);

  useEffect(() => {
    const customColor =
      localStorage.getItem(STORAGE_KEYS.CUSTOM_COLOR) === "true";

    if (backgroundImageUrl) {
      setLocalStorageItem(STORAGE_KEYS.WALLPAPER, backgroundImageUrl);
      if (!customColor) {
        setLocalStorageItem(STORAGE_KEYS.WALLPAPER_COLOR, backgroundColor);
      }
    }
  }, [backgroundImageUrl, backgroundColor]);

  return (
    <WallpaperContext.Provider
      value={{
        backgroundImageUrl,
        backgroundColor,
        defaultBgColor,
        setBackgroundImageUrl,
        setBackgroundColor
      }}>
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => useContext(WallpaperContext);
